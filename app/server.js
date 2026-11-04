'use strict'
// Farol (painel local): configuração (Claude, LinkedIn, Desigma), fila de posts, aprovação e publicação.
// Sem dependências. Escuta só em 127.0.0.1; toda ação exige o token desta sessão (contra sites tentando agir pelo navegador).
// Uso: node app/server.js   → http://127.0.0.1:4800
const fs = require('fs')
const path = require('path')
const http = require('http')
const crypto = require('crypto')
const { spawn, execFile } = require('child_process')
const C = require('../engine/config.js')

const ROOT = C.ROOT, PUB = path.join(__dirname, 'public')
const TOKEN = crypto.randomBytes(24).toString('hex')
const PORT = +process.env.PORT || C.cfg.app.port
const IS_WIN = process.platform === 'win32'

// ---------------------------------------------------------------- utilidades
// caminho do claude (no Windows, spawn sem shell não acha "claude" sozinho)
const CLAUDE = (() => {
  const dirs = (process.env.PATH || '').split(path.delimiter).concat(process.env.USERPROFILE ? [path.join(process.env.USERPROFILE, '.local', 'bin')] : [])
  for (const d of dirs) for (const n of IS_WIN ? ['claude.exe', 'claude.cmd'] : ['claude']) if (fs.existsSync(path.join(d, n))) return path.join(d, n)
  return 'claude'
})()
const run = (cmd, args, o = {}) => new Promise(ok => execFile(cmd, args, { cwd: ROOT, timeout: o.timeout || 30000, windowsHide: true, shell: o.shell || false, maxBuffer: 4e6 }, (err, stdout, stderr) => ok({ code: err ? (err.code ?? 1) : 0, out: String(stdout || ''), err: String(stderr || '') })))
const readJSON = (p, d = null) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')) } catch { return d } }
const exists = p => { try { return !!p && fs.existsSync(p) } catch { return false } }
const send = (res, code, body, type = 'application/json; charset=utf-8') => { res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body)) }
const body = req => new Promise(ok => { let s = ''; req.on('data', c => { s += c; if (s.length > 1e5) req.destroy() }); req.on('end', () => { try { ok(JSON.parse(s || '{}')) } catch { ok({}) } }) })
const publicados = () => readJSON(C.PUBLICADOS, [])
// abre um console à parte (para logins interativos que pedem o navegador)
const console_ = (title, cmd) => IS_WIN ? spawn('cmd.exe', ['/c', 'start', `"${title}"`, 'cmd', '/k', cmd], { cwd: ROOT, detached: true, stdio: 'ignore', windowsVerbatimArguments: true }).unref() : spawn('sh', ['-c', cmd], { cwd: ROOT, detached: true, stdio: 'ignore' }).unref()

// ---------------------------------------------------------------- estado das três conexões
async function claudeStatus() {
  const v = await run(CLAUDE, ['--version'])
  if (v.code !== 0) return { installed: false }
  const s = await run(CLAUDE, ['auth', 'status', '--json'])
  const j = readJSONText(s.out)
  return { installed: true, version: v.out.trim(), loggedIn: !!(j && j.loggedIn), email: j && j.email, plan: j && j.subscriptionType, expiresAt: j && j.loginExpiresAt }
}
function readJSONText(t) { try { return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)) } catch { return null } }

function linkedinStatus() {
  const k = readJSON(C.LINKEDIN.config), t = readJSON(C.LINKEDIN.token)
  const masked = k && k.client_id ? k.client_id.slice(0, 4) + '…' + k.client_id.slice(-2) : null
  return { configured: !!(k && k.client_id && k.client_secret), clientId: masked, connected: !!(t && t.access_token && t.expires_at > Date.now()), name: t && t.nome, expiresAt: t && t.expires_at, redirectUri: C.cfg.linkedin.redirectUri }
}

const DESIGMA_GUESS = () => {
  const roots = [process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs', 'desigma'), process.env.ProgramFiles && path.join(process.env.ProgramFiles, 'desigma'), 'E:\\Programas\\desigma', 'C:\\Programas\\desigma', 'D:\\Programas\\desigma'].filter(Boolean)
  for (const r of roots) if (exists(path.join(r, IS_WIN ? 'desigma.exe' : 'desigma'))) return { exe: path.join(r, IS_WIN ? 'desigma.exe' : 'desigma'), mcpExe: exists(path.join(r, IS_WIN ? 'desigma-mcp.exe' : 'desigma-mcp')) ? path.join(r, IS_WIN ? 'desigma-mcp.exe' : 'desigma-mcp') : '' }
  return { exe: '', mcpExe: '' }
}
async function desigmaStatus() {
  const cfg = C.load().desigma
  const g = cfg.exe ? {} : DESIGMA_GUESS()
  const exe = cfg.exe || g.exe, mcpExe = cfg.mcpExe || g.mcpExe
  const m = await run(CLAUDE, ['mcp', 'get', 'desigma'], { timeout: 60000 })
  return { exe, mcpExe, exeOk: exists(exe), mcpOk: exists(mcpExe), workspace: cfg.workspace, project: cfg.project, workspaceOk: exists(cfg.workspace), projectOk: exists(cfg.project), registered: m.code === 0 && /desigma/i.test(m.out), registration: m.code === 0 ? m.out.replace(/\r/g, '').split('\n').filter(l => /Command|Args|Scope|Status/i.test(l)).map(l => l.trim()).slice(0, 4) : [], guessed: !cfg.exe && !!g.exe, download: 'https://github.com/deepfounder-ai/desigma/releases' }
}

// ---------------------------------------------------------------- fila de posts (lida do workspace)
function queue() {
  const pub = publicados(), pubBy = Object.fromEntries(pub.map(p => [p.imagem, p]))
  const items = []
  const add = (kind, id, title, file, cover, legenda, okFile, extra = {}) => {
    const base = path.basename(file || '')
    items.push({ kind, id, title, file: file && path.relative(C.WS, file), cover: cover && path.relative(C.WS, cover), hasFile: exists(file), approved: kind === 'series' ? true : exists(okFile), published: pubBy[base] || null, caption: exists(legenda) ? fs.readFileSync(legenda, 'utf8') : '', ...extra })
  }
  // Daily UI
  const du = C.ws('dailyui')
  for (const f of ls(path.join(du, 'legendas')).filter(f => /^\d{3}\.txt$/.test(f))) {
    const nn = f.slice(0, 3), png = ls(path.join(du, 'png')).find(x => x.startsWith(nn + '-'))
    const file = png && path.join(du, 'png', png)
    add('dailyui', nn, `Daily UI ${nn}`, file, file, path.join(du, 'legendas', f), path.join(du, 'aprovados', nn + '.ok'), { svg: !png && ls(path.join(du, 'svg')).some(x => x.startsWith(nn + '-')) })
  }
  // carrosséis de notícias
  const nt = C.ws('noticias')
  for (const f of ls(path.join(nt, 'legendas')).filter(f => f.endsWith('.txt'))) {
    const id = f.replace('.txt', '')
    add('noticias', id, `Carrossel ${id.slice(-1).toUpperCase()} · ${id.slice(0, 10)}`, path.join(nt, 'pdf', id + '.pdf'), path.join(nt, 'png', id, '01.png'), path.join(nt, 'legendas', f), path.join(nt, 'aprovados', id + '.ok'))
  }
  // série própria (já aprovada pelo autor ao gerar)
  const se = C.ws('series')
  for (const f of ls(path.join(se, 'legendas')).filter(f => /^\d\d-.*\.txt$/.test(f))) {
    const id = f.replace('.txt', ''), file = path.join(se, 'png', id + '.png')
    add('series', id, `Série ${id.slice(0, 2)}`, file, file, path.join(se, 'legendas', f), null)
  }
  return items.sort((a, b) => (a.published ? 1 : 0) - (b.published ? 1 : 0) || a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id))
}
function ls(d) { try { return fs.readdirSync(d).sort() } catch { return [] } }
const findItem = (kind, id) => queue().find(i => i.kind === kind && i.id === id)

// ---------------------------------------------------------------- rotinas (Claude Code em modo não interativo)
const ROTINAS = {
  'daily-ui': { titulo: 'Gerar o Daily UI de hoje', prompt: 'prompts/daily-ui.md' },
  'pauta-noticias': { titulo: 'Montar os carrosséis de notícias', prompt: 'prompts/pauta-noticias.md' },
}
const RUNS = []
function startRun(id) {
  const r = ROTINAS[id]; if (!r) throw new Error('rotina desconhecida')
  if (RUNS.some(x => x.id === id && x.status === 'rodando')) throw new Error('essa rotina já está rodando')
  const logDir = C.ws('logs'); fs.mkdirSync(logDir, { recursive: true })
  const log = path.join(logDir, `${id}-${new Date().toISOString().replace(/[:.]/g, '-')}.log`)
  const prompt = fs.readFileSync(path.join(ROOT, r.prompt), 'utf8')
  // ferramentas liberadas: ler/escrever no repositório, rodar node, pesquisar e o MCP do desigma. Publicar no LinkedIn fica de fora.
  const allowed = ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'WebSearch', 'WebFetch', 'Bash(node:*)', 'mcp__desigma']
  const p = spawn(CLAUDE, ['-p', '--permission-mode', 'acceptEdits', '--allowedTools', allowed.join(','), '--disallowedTools', 'Bash(node engine/linkedin/postar.js:*)'], { cwd: ROOT, windowsHide: true })
  p.stdin.end(prompt)
  const run = { id, titulo: r.titulo, status: 'rodando', inicio: Date.now(), log: path.relative(C.WS, log) }
  const out = fs.createWriteStream(log)
  p.stdout.pipe(out); p.stderr.pipe(out)
  p.on('close', code => { run.status = code === 0 ? 'concluída' : 'falhou'; run.fim = Date.now() })
  RUNS.unshift(run)
  return run
}

// ---------------------------------------------------------------- HTTP
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8', '.log': 'text/plain; charset=utf-8', '.woff2': 'font/woff2' }
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://127.0.0.1:${PORT}`)
  try {
    // arquivos do painel
    if (req.method === 'GET' && !u.pathname.startsWith('/api/') && !u.pathname.startsWith('/files/')) {
      const f = u.pathname === '/' ? 'index.html' : u.pathname.slice(1)
      const p = path.join(PUB, path.normalize(f))
      if (!p.startsWith(PUB) || !exists(p)) return send(res, 404, 'não encontrado', 'text/plain')
      let b = fs.readFileSync(p)
      if (f === 'index.html') b = b.toString('utf8').replace('__TOKEN__', TOKEN)
      return send(res, 200, b, MIME[path.extname(p)] || 'application/octet-stream')
    }
    // arquivos gerados (só de dentro do workspace)
    if (req.method === 'GET' && u.pathname.startsWith('/files/')) {
      const p = path.join(C.WS, path.normalize(decodeURIComponent(u.pathname.slice(7))))
      if (!p.startsWith(C.WS + path.sep) || !exists(p)) return send(res, 404, 'não encontrado', 'text/plain')
      return send(res, 200, fs.readFileSync(p), MIME[path.extname(p)] || 'application/octet-stream')
    }
    // API: exige o token da sessão e a origem local
    if (req.headers['x-engine-token'] !== TOKEN) return send(res, 403, { erro: 'token inválido' })
    const origin = req.headers.origin
    if (origin && !/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)) return send(res, 403, { erro: 'origem não permitida' })

    if (req.method === 'GET' && u.pathname === '/api/status') {
      // ENGINE_DEMO=1: dados de exemplo no lugar dos seus (para capturas de tela públicas)
      if (process.env.ENGINE_DEMO) return send(res, 200, {
        claude: { installed: true, version: '2.x (Claude Code)', loggedIn: true, email: 'voce@exemplo.com', plan: 'pro', expiresAt: new Date(Date.now() + 20 * 864e5).toISOString() },
        linkedin: { configured: true, clientId: '77ab…yz', connected: true, name: 'Seu Nome', expiresAt: Date.now() + 59 * 864e5, redirectUri: C.cfg.linkedin.redirectUri },
        desigma: { exe: 'C:\\Programas\\desigma\\desigma.exe', mcpExe: 'C:\\Programas\\desigma\\desigma-mcp.exe', workspace: 'C:\\Users\\voce\\Documents\\desigma', project: 'C:\\Users\\voce\\Documents\\desigma\\posts.desigma', exeOk: true, mcpOk: true, workspaceOk: true, projectOk: true, registered: true, registration: ['Scope: User config', 'Status: Connected'], guessed: false, download: 'https://github.com/deepfounder-ai/desigma/releases' },
        config: { assetsDir: 'examples/assets', workspaceDir: 'workspace', dailyUiStart: '2026-11-03' },
      })
      return send(res, 200, { claude: await claudeStatus(), linkedin: linkedinStatus(), desigma: await desigmaStatus(), config: { assetsDir: C.load().assetsDir, workspaceDir: C.WS, dailyUiStart: C.load().dailyUiStart } })
    }
    if (req.method === 'GET' && u.pathname === '/api/queue') return send(res, 200, queue())
    if (req.method === 'GET' && u.pathname === '/api/runs') return send(res, 200, { rotinas: Object.entries(ROTINAS).map(([id, r]) => ({ id, titulo: r.titulo })), runs: RUNS.slice(0, 10).map(r => ({ ...r, tail: (() => { try { return fs.readFileSync(path.join(C.WS, r.log), 'utf8').slice(-1500) } catch { return '' } })() })) })
    if (req.method !== 'POST') return send(res, 404, { erro: 'rota não encontrada' })

    const b = await body(req)
    switch (u.pathname) {
      case '/api/claude/login': console_('Login do Claude', `"${CLAUDE}" auth login`); return send(res, 200, { ok: true, msg: 'Abri uma janela para você entrar na sua conta do Claude.' })
      case '/api/linkedin/keys': {
        const id = String(b.client_id || '').trim(), sec = String(b.client_secret || '').trim()
        if (!/^[A-Za-z0-9]{8,40}$/.test(id) || sec.length < 8) return send(res, 400, { erro: 'Confira o Client ID e o Client Secret.' })
        fs.mkdirSync(C.CONFIG_DIR, { recursive: true })
        fs.writeFileSync(C.LINKEDIN.config, JSON.stringify({ client_id: id, client_secret: sec }, null, 2), { encoding: 'utf8', mode: 0o600 })
        return send(res, 200, { ok: true })
      }
      case '/api/linkedin/connect': {
        if (!linkedinStatus().configured) return send(res, 400, { erro: 'Salve o Client ID e o Client Secret antes.' })
        spawn(process.execPath, [path.join(ROOT, 'engine', 'linkedin', 'auth.js')], { cwd: ROOT, detached: true, stdio: 'ignore', windowsHide: true }).unref()
        return send(res, 200, { ok: true, msg: 'Abri o LinkedIn no navegador: entre e clique em Permitir.' })
      }
      case '/api/linkedin/disconnect': { if (exists(C.LINKEDIN.token)) fs.unlinkSync(C.LINKEDIN.token); return send(res, 200, { ok: true }) }
      case '/api/desigma/config': {
        const patch = {}
        for (const k of ['exe', 'mcpExe', 'workspace', 'project']) if (typeof b[k] === 'string') patch[k] = b[k].trim()
        C.save({ desigma: patch }); return send(res, 200, { ok: true, desigma: await desigmaStatus() })
      }
      case '/api/desigma/register': {
        const d = await desigmaStatus()
        if (!d.mcpOk) return send(res, 400, { erro: 'Informe onde está o desigma-mcp.exe.' })
        if (!d.workspaceOk) return send(res, 400, { erro: 'Informe uma pasta de trabalho que exista.' })
        if (d.registered && !b.replace) return send(res, 409, { erro: 'Já existe um MCP "desigma" no Claude Code. Use "Substituir" se quiser trocar.' })
        if (d.registered) await run(CLAUDE, ['mcp', 'remove', 'desigma', '--scope', 'user'], { timeout: 60000 })
        const r = await run(CLAUDE, ['mcp', 'add', 'desigma', '--scope', 'user', '--', d.mcpExe, '--workspace', d.workspace], { timeout: 60000 })
        return send(res, r.code === 0 ? 200 : 500, r.code === 0 ? { ok: true, msg: 'MCP do Desigma registrado no Claude Code.' } : { erro: (r.err || r.out).slice(0, 400) })
      }
      case '/api/desigma/open': { const d = await desigmaStatus(); if (!d.exeOk) return send(res, 400, { erro: 'Desigma não encontrado.' }); spawn(d.exe, ['--bridge', ...(d.projectOk ? [d.project] : [])], { detached: true, stdio: 'ignore' }).unref(); return send(res, 200, { ok: true }) }
      case '/api/config': { const patch = {}; for (const k of ['assetsDir', 'dailyUiStart']) if (typeof b[k] === 'string') patch[k] = b[k].trim(); C.save(patch); return send(res, 200, { ok: true, msg: 'Salvo. Reinicie o painel para valer em tudo.' }) }
      case '/api/approve': case '/api/unapprove': {
        const it = findItem(b.kind, b.id); if (!it || it.kind === 'series') return send(res, 400, { erro: 'Item não encontrado.' })
        const ok = path.join(C.ws(it.kind, 'aprovados'), it.id + '.ok')
        if (u.pathname === '/api/approve') { fs.mkdirSync(path.dirname(ok), { recursive: true }); fs.writeFileSync(ok, `${new Date().toISOString()} aprovado no painel\n`) } else if (exists(ok)) fs.unlinkSync(ok)
        return send(res, 200, { ok: true })
      }
      case '/api/publish': {
        const it = findItem(b.kind, b.id)
        if (!it || !it.hasFile) return send(res, 400, { erro: 'Arquivo do post não encontrado: exporte antes.' })
        if (!it.approved) return send(res, 400, { erro: 'Aprove o post antes de publicar.' })
        if (it.published) return send(res, 409, { erro: 'Esse post já foi publicado.' })
        if (!linkedinStatus().connected) return send(res, 400, { erro: 'Conecte o LinkedIn antes.' })
        const leg = { dailyui: C.ws('dailyui', 'legendas', it.id + '.txt'), noticias: C.ws('noticias', 'legendas', it.id + '.txt'), series: C.ws('series', 'legendas', it.id + '.txt') }[it.kind]
        const r = await run(process.execPath, [path.join(ROOT, 'engine', 'linkedin', 'postar.js'), path.join(C.WS, it.file), leg, '--confirmo'], { timeout: 120000 })
        const j = readJSONText(r.out)
        return send(res, r.code === 0 && j && j.ok ? 200 : 500, r.code === 0 && j ? j : { erro: (r.err || r.out).slice(0, 400) })
      }
      case '/api/export': {
        const kind = b.kind
        const r = kind === 'noticias' ? await run(process.execPath, [path.join(ROOT, 'engine', 'noticias', 'exportar.js'), b.id], { timeout: 300000 }) : await run(process.execPath, [path.join(ROOT, 'engine', 'exportar-png.js'), kind, b.id || ''], { timeout: 300000 })
        return send(res, r.code === 0 ? 200 : 500, r.code === 0 ? { ok: true } : { erro: (r.err || r.out).slice(0, 400) })
      }
      case '/api/run': { try { return send(res, 200, startRun(b.id)) } catch (e) { return send(res, 400, { erro: e.message }) } }
    }
    return send(res, 404, { erro: 'rota não encontrada' })
  } catch (e) { return send(res, 500, { erro: e.message }) }
})
server.listen(PORT, '127.0.0.1', () => console.log(`Farol: http://127.0.0.1:${PORT}`))
