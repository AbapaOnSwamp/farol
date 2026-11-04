'use strict'
// Publica uma imagem com legenda no seu perfil do LinkedIn pela API oficial (Posts API).
// Sem --confirmo, só mostra o que seria publicado. Só use --confirmo depois que o Otavio aprovar o post do dia.
// Uso: node postar.js <imagem.png> <legenda.txt> [--confirmo]
const fs = require('fs')
const path = require('path')

const DIR = __dirname
const [img, txt, flag] = process.argv.slice(2)
const C = require('../config.js')
const cfg = { ...JSON.parse(fs.readFileSync(C.LINKEDIN.config, 'utf8')), version: C.cfg.linkedin.version }
const tok = JSON.parse(fs.readFileSync(C.LINKEDIN.token, 'utf8'))
const legenda = fs.readFileSync(txt, 'utf8').trim()

if (Date.now() > tok.expires_at - 86400000) { console.error('O token do LinkedIn venceu (ou vence hoje). Rode: node auth.js'); process.exit(2) }

// "little text" do LinkedIn: caracteres reservados com barra; #tag vira hashtag de verdade
const RESERV = /[\\|{}@\[\]()<>*_~]/g
const commentary = legenda.split(/(#[\p{L}\p{N}_]+)/u).map(p => p.startsWith('#') && p.length > 1 ? `{hashtag|\\#|${p.slice(1)}}` : p.replace(RESERV, m => '\\' + m).replace(/#/g, '\\#')).join('')

if (flag !== '--confirmo') {
  console.log(JSON.stringify({ ensaio: true, autor: tok.nome, imagem: img, caracteres: legenda.length, inicio: legenda.slice(0, 120) }, null, 2))
  console.log('Nada foi publicado. Para publicar: acrescente --confirmo')
  process.exit(0)
}

const H = { Authorization: `Bearer ${tok.access_token}`, 'LinkedIn-Version': cfg.version || '202610', 'X-Restli-Protocol-Version': '2.0.0', 'Content-Type': 'application/json' }
;(async () => {
  // PDF vira carrossel (Documents API); PNG/JPG vira imagem (Images API)
  const doc = /\.pdf$/i.test(img)
  const ini = await fetch(`https://api.linkedin.com/rest/${doc ? 'documents' : 'images'}?action=initializeUpload`, { method: 'POST', headers: H, body: JSON.stringify({ initializeUploadRequest: { owner: tok.author } }) })
  if (!ini.ok) throw new Error('initializeUpload ' + ini.status + ' ' + await ini.text())
  const { value } = await ini.json()
  value.image = value.image || value.document
  const up = await fetch(value.uploadUrl, { method: 'PUT', headers: { Authorization: H.Authorization }, body: fs.readFileSync(img) })
  if (!up.ok) throw new Error('upload ' + up.status + ' ' + await up.text())
  const post = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST', headers: H,
    body: JSON.stringify({
      author: tok.author, commentary, visibility: 'PUBLIC',
      distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
      content: { media: { title: doc ? legenda.split('\n')[0].slice(0, 100) : path.basename(img), id: value.image } },
      lifecycleState: 'PUBLISHED', isReshareDisabledByAuthor: false,
    }),
  })
  if (!post.ok) throw new Error('posts ' + post.status + ' ' + await post.text())
  const id = post.headers.get('x-restli-id')
  const log = C.PUBLICADOS
  const lista = fs.existsSync(log) ? JSON.parse(fs.readFileSync(log, 'utf8')) : []
  lista.push({ quando: new Date().toISOString(), imagem: path.basename(img), post: id, link: `https://www.linkedin.com/feed/update/${id}/` })
  fs.writeFileSync(log, JSON.stringify(lista, null, 2), 'utf8')
  console.log(JSON.stringify({ ok: true, post: id, link: `https://www.linkedin.com/feed/update/${id}/` }))
})().catch(e => { console.error('Falhou, nada foi publicado:', e.message); process.exit(1) })
