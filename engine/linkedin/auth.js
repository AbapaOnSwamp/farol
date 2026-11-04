'use strict'
// Autoriza este script a publicar no seu perfil do LinkedIn (OAuth da API oficial). Rode uma vez, e de novo a cada ~60 dias.
// Precisa de config.json (copie de config.example.json) com client_id e client_secret do seu app em linkedin.com/developers.
// Uso: node auth.js   → abre o navegador; você entra na sua conta e autoriza; o token fica em token.json (só nesta máquina).
const fs = require('fs')
const path = require('path')
const http = require('http')
const { exec } = require('child_process')

const DIR = __dirname
const C = require('../config.js')
const cfg = { ...JSON.parse(fs.readFileSync(C.LINKEDIN.config, 'utf8')), redirect_uri: C.cfg.linkedin.redirectUri }
const redirect = cfg.redirect_uri || 'http://localhost:8765/callback'
const port = +new URL(redirect).port
const state = Math.random().toString(36).slice(2)
const url = 'https://www.linkedin.com/oauth/v2/authorization?' + new URLSearchParams({
  response_type: 'code', client_id: cfg.client_id, redirect_uri: redirect, state, scope: 'openid profile w_member_social',
})

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, redirect)
  if (u.pathname !== new URL(redirect).pathname) { res.end(); return }
  if (u.searchParams.get('state') !== state || !u.searchParams.get('code')) { res.end('Autorização recusada ou inválida. Pode fechar esta aba.'); server.close(); return }
  try {
    const tok = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', code: u.searchParams.get('code'), redirect_uri: redirect, client_id: cfg.client_id, client_secret: cfg.client_secret }),
    }).then(r => r.json())
    if (!tok.access_token) throw new Error(JSON.stringify(tok))
    const me = await fetch('https://api.linkedin.com/v2/userinfo', { headers: { Authorization: `Bearer ${tok.access_token}` } }).then(r => r.json())
    const out = { access_token: tok.access_token, expires_at: Date.now() + tok.expires_in * 1000, author: `urn:li:person:${me.sub}`, nome: me.name }
    fs.writeFileSync(C.LINKEDIN.token, JSON.stringify(out, null, 2), 'utf8')
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(`<p>Pronto, ${me.name}. Pode fechar esta aba.</p>`)
    console.log(`ok: autorizado como ${me.name}; vale até ${new Date(out.expires_at).toLocaleDateString('pt-BR')}`)
  } catch (e) {
    res.end('Deu erro ao trocar o código pelo token. Veja o terminal.'); console.error(e.message)
  }
  server.close()
})
server.listen(port, () => {
  console.log('Abrindo o navegador para você autorizar...\n' + url)
  exec(`start "" "${url}"`)
})
