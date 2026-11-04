'use strict'
// Configuração única do motor. Valores padrão + config/engine.config.json (local, fora do Git).
// Segredos (chaves e token do LinkedIn) ficam em config/ e nunca entram no repositório.
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const CONFIG_DIR = path.join(ROOT, 'config')
const FILE = path.join(CONFIG_DIR, 'engine.config.json')

const DEFAULTS = {
  // pasta com as imagens usadas nas peças (pixel art, fotos de projeto); o padrão são os exemplos do repositório
  assetsDir: path.join(ROOT, 'examples', 'assets'),
  // onde as peças geradas são salvas (svg, png, pdf, legendas, aprovações, registro de publicações)
  workspaceDir: path.join(ROOT, 'workspace'),
  // dia 1 do Daily UI (os desafios contam só dias úteis)
  dailyUiStart: new Date().toISOString().slice(0, 10),
  desigma: {
    exe: '',            // caminho do desigma.exe (editor)
    mcpExe: '',         // caminho do desigma-mcp.exe
    workspace: '',      // pasta que o MCP do desigma enxerga
    project: '',        // o .desigma do projeto (dentro da pasta acima)
  },
  linkedin: { version: '202610', redirectUri: 'http://localhost:8765/callback' },
  app: { port: 4800 },
}

function deep(a, b) { const o = { ...a }; for (const [k, v] of Object.entries(b || {})) o[k] = v && typeof v === 'object' && !Array.isArray(v) ? deep(a[k] || {}, v) : v; return o }
function load() { try { return deep(DEFAULTS, JSON.parse(fs.readFileSync(FILE, 'utf8'))) } catch { return deep(DEFAULTS, {}) } }
function save(patch) { const cur = (() => { try { return JSON.parse(fs.readFileSync(FILE, 'utf8')) } catch { return {} } })(); fs.mkdirSync(CONFIG_DIR, { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(deep(cur, patch), null, 2), 'utf8'); return load() }

const cfg = load()
const WS = cfg.workspaceDir
const ws = (...p) => { const d = path.join(WS, ...p); return d }
module.exports = {
  ROOT, CONFIG_DIR, FILE, load, save, cfg,
  ASSETS: cfg.assetsDir, WS, ws,
  LINKEDIN: { config: path.join(CONFIG_DIR, 'linkedin.json'), token: path.join(CONFIG_DIR, 'linkedin-token.json') },
  PUBLICADOS: path.join(WS, 'publicados.json'),
}
