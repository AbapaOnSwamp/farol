'use strict'
// Farol: onboarding em cenas + fila de posts. Fala com app/server.js (toda chamada leva o token desta sessão).
const TOKEN = document.querySelector('meta[name=engine-token]').content
const $ = (s, el = document) => el.querySelector(s)
const $$ = (s, el = document) => [...el.querySelectorAll(s)]
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const store = { get: (k, d) => { try { return localStorage.getItem('farol.' + k) ?? d } catch { return d } }, set: (k, v) => { try { localStorage.setItem('farol.' + k, v) } catch {} } }
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

// sem o servidor local (site estático, como a demo na Vercel) o token não é preenchido: o Farol roda em demonstração,
// com dados de exemplo e sem conectar nem publicar nada de verdade
const DEMO = TOKEN === '__' + 'TOKEN__'
const arquivo = p => DEMO ? p : `/files/${encodeURI(String(p).replace(/\\/g, '/'))}`
const D = DEMO && {
  status: { claude: { installed: true, version: '2.x (Claude Code)', loggedIn: true, email: 'voce@exemplo.com', plan: 'pro', expiresAt: new Date(Date.now() + 20 * 864e5).toISOString() },
    linkedin: { configured: true, clientId: '77ab…yz', connected: true, name: 'Seu Nome', expiresAt: Date.now() + 59 * 864e5, redirectUri: 'http://localhost:8765/callback' },
    desigma: { exe: 'C:\\Programas\\desigma\\desigma.exe', mcpExe: 'C:\\Programas\\desigma\\desigma-mcp.exe', workspace: 'C:\\Users\\voce\\Documents\\desigma', project: 'C:\\Users\\voce\\Documents\\desigma\\posts.desigma', exeOk: true, mcpOk: true, workspaceOk: true, projectOk: true, registered: true, registration: [] },
    config: { assetsDir: 'examples/assets', workspaceDir: 'workspace', dailyUiStart: '2026-11-03' } },
  fila: [
    { kind: 'dailyui', id: '002', title: 'Daily UI 002', cover: 'demo/dailyui-002.png', file: 'demo/dailyui-002.png', hasFile: true, approved: false, published: null, caption: 'Daily UI 002 · Credit Card Checkout\n\nSegunda missão: a tela de pagamento de uma loja. Número em blocos, valor no botão, erro que ensina e confiança perto da ação.\n\n#dailyui #uidesign' },
    { kind: 'noticias', id: 'demo-a', title: 'Carrossel A · hoje', cover: 'demo/carrossel-capa.png', file: 'demo/carrossel-capa.png', hasFile: true, approved: false, published: null, caption: 'A Canva se reorganizou. E o recado vale para todo designer.\n\nUm carrossel de 7 slides com o fato, o outro lado e a leitura de quem desenha. Fontes checadas.' },
    { kind: 'series', id: '02', title: 'Série 02', cover: 'demo/serie-02.png', file: 'demo/serie-02.png', hasFile: true, approved: true, published: null, caption: 'Ficha do personagem, para quem está chegando agora.\n\nNome, base, classe e a missão atual: aberto a freelas e vagas fixas.' },
  ],
}
async function apiDemo(path, data) {
  await new Promise(r => setTimeout(r, 180))
  const it = data && D.fila.find(i => i.kind === data.kind && i.id === data.id)
  switch (path) {
    case '/api/status': return D.status
    case '/api/queue': return D.fila
    case '/api/runs': return { rotinas: [{ id: 'daily-ui', titulo: 'Gerar o Daily UI de hoje' }, { id: 'pauta-noticias', titulo: 'Montar os carrosséis de notícias' }], runs: [] }
    case '/api/approve': it.approved = true; return { ok: true }
    case '/api/unapprove': it.approved = false; return { ok: true }
    case '/api/publish': it.published = { link: 'https://github.com/AbapaOnSwamp/farol', quando: new Date().toISOString() }; return { ok: true }
    case '/api/run': throw new Error('Na demonstração as rotinas não rodam. Baixe o Farol para usar de verdade.')
    default: return { ok: true, msg: 'Demonstração: nada foi alterado de verdade.' }
  }
}

async function api(path, data) {
  if (DEMO) return apiDemo(path, data)
  const r = await fetch(path, { method: data ? 'POST' : 'GET', headers: { 'X-Engine-Token': TOKEN, 'Content-Type': 'application/json' }, body: data ? JSON.stringify(data) : undefined })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw Object.assign(new Error(j.erro || `erro ${r.status}`), { status: r.status })
  return j
}

// ---------------------------------------------------------------- som (WebAudio, tudo em Ré maior, como o Mutto)
const Som = (() => {
  let ctx = null
  const pref = () => store.get('sound', 'tom')
  const ac = () => { if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ctx = new A() } if (ctx.state === 'suspended') ctx.resume(); return ctx }
  // um tom: forma, frequência, início, ataque, duração, volume
  function tom(f, t0, atk, dur, vol, tipo = 'sine') {
    const c = ac(); if (!c) return
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0
    o.type = tipo; o.frequency.value = f
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + atk); g.gain.exponentialRampToValueAtTime(0.0001, t + atk + dur)
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + atk + dur + .05)
  }
  const sino = (f, t0, vol = .06, dur = .32) => { tom(f, t0, .008, dur, vol); tom(f * 2, t0, .005, dur * .45, vol * .25) }
  // acordes medidos no vídeo: Lá (E3 A4 C#4 E4), Ré (D3 A3 F#4 D5), Si menor (B2 F#3 B4 D4)
  const ACORDES = [[164.81, 277.18, 329.63, 440], [146.83, 220, 369.99, 587.33], [123.47, 185, 293.66, 493.88]]
  let passo = 0
  return {
    acordar: ac,
    pad() { if (pref() !== 'tom') return; const a = ACORDES[passo++ % ACORDES.length]; a.forEach((f, i) => tom(f, i * .02, .65, 1.0, i ? .018 : .028, i === 3 ? 'triangle' : 'sine')) },
    tique() { const p = pref(); if (p === 'off') return; tom(1174.66, 0, .004, .045, p === 'clique' ? .05 : .025) },
    liga() { const p = pref(); if (p === 'off') return; if (p === 'bipe') { tom(880, 0, .005, .08, .05, 'square'); tom(880, .12, .005, .08, .05, 'square'); return } if (p === 'clique') return this.tique(); sino(587.33, 0); sino(880, .14) },
    desliga() { const p = pref(); if (p === 'off') return; if (p === 'bipe') { tom(440, 0, .005, .1, .05, 'square'); return } if (p === 'clique') return this.tique(); sino(880, 0); sino(587.33, .14) },
    publica() { const p = pref(); if (p === 'off') return; if (p !== 'tom') return this.liga(); [587.33, 739.99, 880, 1174.66].forEach((f, i) => sino(f, i * .09, .05, .5)); tom(146.83, 0, .3, 1.1, .03) },
    erro() { if (pref() === 'off') return; tom(246.94, 0, .01, .12, .05, 'triangle'); tom(207.65, .15, .01, .18, .05, 'triangle') },
  }
})()
addEventListener('pointerdown', () => Som.acordar(), { once: true })
addEventListener('keydown', () => Som.acordar(), { once: true })

// ---------------------------------------------------------------- pílula de aviso e humor do fundo
let pillT
function pill(titulo, sub = '', cor = 'var(--accent)') {
  const p = $('#pill'), modo = store.get('toast', 'padrao')
  $('#pill-t').textContent = titulo; $('#pill-s').textContent = modo === 'compacto' ? '' : sub
  p.style.setProperty('--c', cor); p.hidden = false; p.classList.remove('out'); void p.offsetWidth
  clearTimeout(pillT); pillT = setTimeout(() => { p.classList.add('out'); setTimeout(() => (p.hidden = true), 300) }, modo === 'detalhado' ? 4200 : 2600)
}
const humor = m => (document.documentElement.dataset.mood = m)
function falha(e) { Som.erro(); humor('error'); pill('Algo deu errado', e.message, 'var(--red)'); setTimeout(atualizarHumor, 2600) }
function confirmar(t, p, ok = 'Confirmar') { const d = $('#dlg'); $('#dlg-t').textContent = t; $('#dlg-p').textContent = p; $('#dlg-ok').textContent = ok; d.showModal(); return new Promise(r => d.addEventListener('close', () => r(d.returnValue === 'sim'), { once: true })) }
const ring = el => { if (reduced || !el) return; const r = document.createElement('span'); r.className = 'ring'; el.appendChild(r); setTimeout(() => r.remove(), 750) }

// ---------------------------------------------------------------- tema
function aplicarTema() {
  const t = store.get('theme', 'auto')
  document.documentElement.dataset.theme = t === 'auto' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : t
}
matchMedia('(prefers-color-scheme: light)').addEventListener('change', aplicarTema)
aplicarTema()

// ---------------------------------------------------------------- cenas
const ONB = ['ola', 'claude', 'linkedin', 'desigma', 'aprovar', 'jeito', 'truques']
let atual = null, voltarPara = null
function cena(nome, { som = true } = {}) {
  const prox = $(`.scene[data-scene="${nome}"]`); if (!prox || atual === prox) return
  const ant = atual; atual = prox
  const mostrar = () => {
    if (ant) { ant.hidden = true; ant.classList.remove('on', 'leaving') }
    $$('[data-in]', prox).forEach((el, i) => el.style.setProperty('--d', (i * 90) + 'ms'))
    prox.hidden = false; void prox.offsetWidth; prox.classList.add('on'); scrollTo({ top: 0 })
    const ob = ONB.indexOf(nome)
    $('#dots').innerHTML = ob >= 0 ? ONB.map((_, i) => `<i class="${i === ob ? 'on' : ''}"></i>`).join('') : ''
    $('#nav').hidden = ob >= 0 && !voltarPara
    $$('#nav [data-view]').forEach(b => b.toggleAttribute('aria-current', b.dataset.view === nome))
    if (som) Som.pad()
    ENTRAR[nome]?.()
  }
  if (ant && !reduced) { ant.classList.add('leaving'); setTimeout(mostrar, 220) } else mostrar()
}
const proximaCena = () => { const i = ONB.indexOf(atual?.dataset.scene); if (i >= 0 && i < ONB.length - 1) cena(ONB[i + 1]); else if (i === ONB.length - 1) terminar() }
function terminar() { store.set('onboarded', '1'); voltarPara = null; cena('fila') }

// o que cada cena faz ao entrar
const ENTRAR = {
  claude: () => status(), linkedin: () => status(), desigma: () => status(),
  aprovar: () => demo(), jeito: () => marcarPrefs(),
  fila: () => carregarFila(), rotinas: () => carregarRotinas(), ajustes: () => status(),
}

// ---------------------------------------------------------------- conexões
let ST = null
const quando = ms => ms ? new Date(ms).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : ''
const fatos = (k, rows) => { const el = $(`[data-facts="${k}"]`); if (el) el.innerHTML = rows.filter(r => r[1]).map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('') }
async function status() {
  try { ST = await api('/api/status') } catch (e) { return falha(e) }
  const { claude: c, linkedin: l, desigma: d, config } = ST
  const orb = $('[data-orb=claude]'); orb.dataset.state = !c.installed ? 'bad' : c.loggedIn ? 'ok' : 'warn'
  fatos('claude', c.installed ? [['Conta', c.email], ['Plano', c.plan], ['Login vale até', c.expiresAt && quando(Date.parse(c.expiresAt))], ['Versão', c.version]] : [['Status', 'Claude Code não instalado']])
  $('[data-install]').hidden = c.installed
  $('[data-act=claude-login]').textContent = c.loggedIn ? 'Trocar de conta' : 'Entrar no Claude'
  $('[data-act=claude-login]').className = 'btn' + (c.loggedIn ? '' : ' accent')
  fatos('linkedin', [['Conta', l.name], ['Acesso vale até', l.expiresAt && quando(l.expiresAt)], ['Client ID', l.clientId]])
  $('[data-redirect]').textContent = l.redirectUri
  $('[data-act=linkedin-connect]').textContent = l.connected ? 'Reconectar' : 'Conectar'
  $('[data-act=linkedin-connect]').disabled = !l.configured
  if (l.configured) $('[name=client_secret]').placeholder = 'salvo (digite para trocar)'
  const f = $('[data-form=desigma]'); for (const k of ['exe', 'mcpExe', 'workspace', 'project']) if (document.activeElement !== f[k]) f[k].value = d[k] || ''
  const dok = d.exeOk && d.mcpOk && d.workspaceOk && d.registered
  fatos('desigma', [['Editor', d.exeOk ? 'encontrado' : 'não encontrado'], ['MCP', d.mcpOk ? 'encontrado' : 'não encontrado'], ['Claude Code', d.registered ? 'registrado' : 'não registrado']])
  const fc = $('[data-form=config]'); fc.assetsDir.value = config.assetsDir; fc.dailyUiStart.value = config.dailyUiStart
  const conn = { claude: [c.loggedIn ? 'ok' : c.installed ? 'warn' : 'bad', c.loggedIn ? `Conectado · ${c.email}` : 'Falta entrar'], linkedin: [l.connected ? 'ok' : l.configured ? 'warn' : 'bad', l.connected ? `Conectado · ${l.name}` : l.configured ? 'Falta conectar' : 'Sem chaves'], desigma: [dok ? 'ok' : 'warn', dok ? 'Pronto, MCP registrado' : 'Falta configurar'] }
  for (const [k, [s, t]] of Object.entries(conn)) { const a = $(`[data-conn="${k}"]`); $('.orb', a).dataset.state = s; $('[data-conn-t]', a).textContent = t }
  // nas cenas de conexão, o brilho do fundo segue o estado (verde conectado, âmbar falta algo, vermelho problema)
  const cs = conn[atual?.dataset.scene]; if (cs) humor({ ok: 'live', warn: 'waiting', bad: 'error' }[cs[0]])
  $('[data-sched]').textContent = `schtasks /Create /SC WEEKLY /D MON,TUE,WED,THU,FRI /ST 08:00 /TN "Farol - Daily UI" /TR "cmd /c cd /d <pasta do Farol> && claude -p < prompts\\daily-ui.md"`
}
function vigiar() { let n = 0; const t = setInterval(async () => { const antes = JSON.stringify(ST); await status(); if (JSON.stringify(ST) !== antes) { Som.liga(); pill('Conexão atualizada', '', 'var(--green)'); clearInterval(t) } if (++n > 24) clearInterval(t) }, 5000) }

// ---------------------------------------------------------------- demonstração da aprovação (a "faixa de apps" do Mutto)
let demoOn = false
function demo() {
  const nomes = [['Daily UI 003', 'dailyui'], ['Carrossel A', 'noticias'], ['Série 04', 'series']]
  $('[data-demo]').innerHTML = nomes.map(([n]) => `<article class="post glass"><div class="shot"><i></i></div><footer><span class="state${demoOn ? ' ok' : ''}"></span><span><b>${n}</b><small>${demoOn ? 'aprovado' : 'esperando você'}</small></span></footer></article>`).join('')
  humor(demoOn ? 'live' : 'waiting')
}
function alternarDemo() {
  demoOn = !demoOn; demo()
  $$('[data-demo] .state').forEach((s, i) => setTimeout(() => ring(s), i * 60))
  demoOn ? Som.liga() : Som.desliga()
  const t = $('[data-title]'), s = $('[data-sub]')
  t.classList.remove('swap'); s.classList.remove('swap'); void t.offsetWidth
  t.innerHTML = demoOn ? 'Aprovados. <span class="soft">Todos, de uma vez.</span>' : 'Aperte <kbd>A</kbd> para aprovar.'
  s.textContent = demoOn ? 'Aperte de novo para desfazer. Nada vai ao ar sem você.' : 'Âmbar é esperando você. Verde é aprovado.'
  t.classList.add('swap'); s.classList.add('swap')
  pill(demoOn ? 'Aprovados' : 'Esperando você', '3 posts · demonstração', demoOn ? 'var(--green)' : 'var(--amber)')
}

// ---------------------------------------------------------------- preferências
function marcarPrefs() { for (const g of $$('[data-pref]')) { const v = store.get(g.dataset.pref, { theme: 'auto', sound: 'tom', toast: 'padrao' }[g.dataset.pref]); $$('button', g).forEach(b => b.classList.toggle('on', b.dataset.v === v)) } }
$$('[data-pref] button').forEach(b => b.addEventListener('click', () => {
  const k = b.closest('[data-pref]').dataset.pref; store.set(k, b.dataset.v); marcarPrefs()
  if (k === 'theme') aplicarTema()
  if (k === 'sound') Som.liga(); else Som.tique()
  if (k === 'toast') pill('Assim fica o aviso', 'Daily UI 003 · esperando você', 'var(--amber)')
}))

// ---------------------------------------------------------------- fila
let FILA = [], FILTRO = 'pendente', foco = 0
const TIPO = { dailyui: 'Daily UI', noticias: 'Carrossel', series: 'Série' }
const estado = i => i.published ? 'pub' : i.approved ? 'ok' : ''
const estadoTxt = i => i.published ? 'no ar' : i.approved ? 'aprovado' : 'esperando você'
const visiveis = () => FILA.filter(i => FILTRO === 'todos' || (FILTRO === 'pendente' && !i.published && !i.approved) || (FILTRO === 'pronto' && !i.published && i.approved) || (FILTRO === 'publicado' && i.published))
async function carregarFila() {
  try { FILA = await api('/api/queue') } catch (e) { return falha(e) }
  $$('[data-filter] button').forEach(b => b.classList.toggle('on', b.dataset.v === FILTRO))
  desenharFila(); atualizarHumor()
}
function atualizarHumor() {
  if (!['fila', 'rotinas', 'ajustes'].includes(atual?.dataset.scene)) return
  const pend = FILA.filter(i => !i.published && !i.approved).length
  humor(pend ? 'waiting' : FILA.some(i => i.approved && !i.published) ? 'live' : 'neutral')
}
function desenharFila() {
  const v = visiveis(), pend = FILA.filter(i => !i.published && !i.approved).length, prontos = FILA.filter(i => !i.published && i.approved).length
  const t = $('[data-fila-title]'), s = $('[data-fila-sub]')
  t.textContent = pend ? `${pend} ${pend === 1 ? 'post esperando' : 'posts esperando'} você.` : prontos ? 'Tudo aprovado.' : FILA.length ? 'Tudo no ar.' : 'Nada na fila.'
  s.textContent = pend ? 'Aperte A para aprovar, P para publicar, ← e → para navegar.' : prontos ? `${prontos} ${prontos === 1 ? 'sai' : 'saem'} no horário da rotina, ou publique agora com P.` : 'Gere peças na aba Rotinas.'
  foco = Math.max(0, Math.min(foco, v.length - 1))
  $('[data-strip]').innerHTML = v.map((i, n) => `<article class="post glass${n === foco ? ' focus' : ''}" data-n="${n}">
    <div class="shot">${i.cover ? `<img src="${arquivo(i.cover)}" alt="" loading="lazy">` : 'sem prévia'}</div>
    <footer><span class="state ${estado(i)}"></span><span><b>${esc(i.title)}</b><small>${TIPO[i.kind]} · ${estadoTxt(i)}</small></span></footer></article>`).join('')
  detalhe()
  const el = $(`[data-strip] .post[data-n="${foco}"]`); el && el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })
}
function detalhe() {
  const i = visiveis()[foco], d = $('[data-detail]')
  if (!i) { d.hidden = true; return } d.hidden = false
  const acoes = i.published ? `<a class="btn" href="${esc(i.published.link)}" target="_blank" rel="noopener">Ver no LinkedIn</a>`
    : [!i.hasFile ? `<button class="btn" data-q="export">Exportar</button>` : '',
       i.kind !== 'series' ? `<button class="btn${i.approved ? '' : ' accent'}" data-q="toggle">${i.approved ? 'Desfazer aprovação' : 'Aprovar'} <kbd>A</kbd></button>` : '',
       i.approved && i.hasFile ? `<button class="btn${i.kind === 'series' ? ' accent' : ''}" data-q="publish">Publicar agora <kbd>P</kbd></button>` : '',
       i.file ? `<a class="link" href="${arquivo(i.file)}" target="_blank" rel="noopener">Abrir arquivo</a>` : ''].join('')
  d.innerHTML = `<div class="row"><span class="tag">${TIPO[i.kind]}</span><span class="state ${estado(i)}"></span><h3>${esc(i.title)}</h3></div><p class="cap">${esc(i.caption)}</p><div class="row">${acoes}</div>`
}
async function acao(q) {
  const i = visiveis()[foco]; if (!i) return
  const item = { kind: i.kind, id: i.id }
  try {
    if (q === 'toggle' && i.kind !== 'series' && !i.published) {
      await api(i.approved ? '/api/unapprove' : '/api/approve', item)
      i.approved ? Som.desliga() : Som.liga()
      pill(i.approved ? 'Aprovação desfeita' : 'Aprovado', i.title, i.approved ? 'var(--amber)' : 'var(--green)')
      const s = $(`[data-strip] .post[data-n="${foco}"] .state`); ring(s)
    }
    if (q === 'export') { pill('Exportando…', i.title); await api('/api/export', item); Som.tique(); pill('Exportado', i.title, 'var(--green)') }
    if (q === 'publish') {
      if (!i.approved || i.published || !i.hasFile) return
      if (!(await confirmar('Publicar no LinkedIn agora?', `"${i.title}" vai para o seu perfil, visível para todo mundo.`, 'Publicar'))) return
      const r = await api('/api/publish', item); Som.publica(); humor('live'); pill('No ar', i.title, 'var(--accent)')
      if (r.link) window.open(r.link, '_blank', 'noopener')
    }
    await carregarFila()
  } catch (e) { falha(e) }
}
$('[data-strip]').addEventListener('click', e => { const p = e.target.closest('.post'); if (!p) return; foco = +p.dataset.n; Som.tique(); desenharFila() })
$('[data-detail]').addEventListener('click', e => { const q = e.target.closest('[data-q]')?.dataset.q; if (q) acao(q) })
$$('[data-filter] button').forEach(b => b.addEventListener('click', () => { FILTRO = b.dataset.v; foco = 0; Som.tique(); carregarFila() }))

// ---------------------------------------------------------------- rotinas
async function carregarRotinas() {
  let d; try { d = await api('/api/runs') } catch (e) { return falha(e) }
  $('[data-rotinas]').innerHTML = d.rotinas.map(r => {
    const u = d.runs.find(x => x.id === r.id), rodando = u && u.status === 'rodando'
    return `<article class="glass trick"><h3>${esc(r.titulo)}</h3><p>${u ? `${esc(u.status)} · começou ${quando(u.inicio)}` : 'Ainda não rodou nesta sessão.'}</p>${u ? `<pre class="log">${esc(u.tail || '…')}</pre>` : ''}<button class="link" data-run="${r.id}" ${rodando ? 'disabled' : ''}>${rodando ? 'Rodando…' : 'Rodar agora'}</button></article>`
  }).join('')
  if (d.runs.some(r => r.status === 'rodando')) setTimeout(() => atual?.dataset.scene === 'rotinas' && carregarRotinas(), 4000)
}
async function rodar(id) {
  if (!ST?.claude?.loggedIn) return falha(new Error('Entre no Claude primeiro.'))
  try { await api('/api/run', { id }); Som.liga(); pill('Rotina iniciada', 'As peças aparecem na fila quando ficarem prontas.', 'var(--violet)'); if (atual?.dataset.scene === 'rotinas') carregarRotinas() } catch (e) { falha(e) }
}

// ---------------------------------------------------------------- cliques e formulários
document.addEventListener('click', async e => {
  const t = e.target.closest('button, a'); if (!t) return
  if (t.matches('[data-next]')) return proximaCena()
  if (t.matches('[data-finish]')) return terminar()
  if (t.matches('[data-view]')) return cena(t.dataset.view)
  if (t.matches('[data-goto]')) { terminar(); return cena(t.dataset.goto) }
  if (t.matches('[data-goscene]')) { voltarPara = atual.dataset.scene; return cena(t.dataset.goscene) }
  if (t.matches('[data-restart]')) { voltarPara = null; return cena('ola') }
  if (t.matches('[data-run]')) return rodar(t.dataset.run)
  const act = t.dataset.act; if (!act) return
  try {
    if (act === 'recheck') { await status(); Som.tique(); pill('Verificado') }
    if (act === 'claude-login') { const r = await api('/api/claude/login', {}); pill('Abrindo o login', r.msg); vigiar() }
    if (act === 'copy-redirect') { await navigator.clipboard.writeText($('[data-redirect]').textContent); Som.tique(); pill('Copiado') }
    if (act === 'linkedin-connect') { const r = await api('/api/linkedin/connect', {}); pill('Abrindo o LinkedIn', r.msg); vigiar() }
    if (act === 'desigma-register') {
      try { const r = await api('/api/desigma/register', {}); Som.liga(); pill('Registrado', r.msg, 'var(--green)') } catch (err) {
        if (err.status !== 409) throw err
        if (await confirmar('Substituir o MCP "desigma"?', err.message, 'Substituir')) { const r = await api('/api/desigma/register', { replace: true }); Som.liga(); pill('Registrado', r.msg, 'var(--green)') }
      }
      status()
    }
  } catch (err) { falha(err) }
})
const form = (sel, fn) => $(sel).addEventListener('submit', async e => { e.preventDefault(); try { await fn(e.target); Som.liga(); status() } catch (err) { falha(err) } })
form('[data-form=linkedin-keys]', async f => { await api('/api/linkedin/keys', { client_id: f.client_id.value, client_secret: f.client_secret.value }); f.client_secret.value = ''; pill('Chaves salvas', 'Só nesta máquina', 'var(--green)') })
form('[data-form=desigma]', async f => { await api('/api/desigma/config', { exe: f.exe.value, mcpExe: f.mcpExe.value, workspace: f.workspace.value, project: f.project.value }); pill('Caminhos salvos', '', 'var(--green)') })
form('[data-form=config]', async f => { const r = await api('/api/config', { assetsDir: f.assetsDir.value, dailyUiStart: f.dailyUiStart.value }); pill('Salvo', r.msg, 'var(--green)') })

// ---------------------------------------------------------------- teclado (Enter avança; A, P, ← e → na fila)
const lit = (k, on) => $$(`kbd[data-k="${k}"]`).forEach(x => x.classList.toggle('lit', on))
addEventListener('keydown', e => {
  if (e.target.closest('input, textarea, select') || $('#dlg').open) return
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
  const nome = atual?.dataset.scene
  lit({ ArrowLeft: '←', ArrowRight: '→' }[k] || k, true)
  if (k === 'Enter' && ONB.includes(nome) && !e.target.closest('button, a, summary')) { e.preventDefault(); return nome === 'truques' ? terminar() : proximaCena() }
  if (nome === 'aprovar' && k === 'a') return alternarDemo()
  if (nome === 'fila') {
    if (k === 'ArrowRight' || k === 'ArrowLeft') { e.preventDefault(); foco += k === 'ArrowRight' ? 1 : -1; Som.tique(); desenharFila() }
    if (k === 'a') acao('toggle')
    if (k === 'p') acao('publish')
  }
})
addEventListener('keyup', e => { const k = e.key.length === 1 ? e.key.toLowerCase() : e.key; lit({ ArrowLeft: '←', ArrowRight: '→' }[k] || k, false) })
$('[data-demo]').addEventListener('click', alternarDemo)

// ---------------------------------------------------------------- início
status()
if (DEMO) setTimeout(() => pill('Demonstração', 'Dados de exemplo: nada é publicado de verdade', 'var(--violet)'), 1200)
if (new URLSearchParams(location.search).has('captura')) document.documentElement.classList.add('static')
const pedida = new URLSearchParams(location.search).get('tela')   // ?tela=fila abre direto numa cena (útil para capturas e atalhos)
if (pedida && $(`.scene[data-scene="${pedida}"]`)) cena(pedida, { som: false })
else if (store.get('onboarded') === '1') { cena('fila', { som: false }); setInterval(() => atual?.dataset.scene === 'fila' && carregarFila(), 60000) } else cena('ola', { som: false })
