'use strict'
// Próximo post da série de 30 que ainda não foi ao ar (confere dailyui/publicados.json, onde o postar.js registra tudo).
// Uso: node proximo-post.js   → {"nn":"02","png":"png/02-....png","legenda":"legendas/02-....txt"} ou {"fim":true}
const fs = require('fs')
const path = require('path')
const C = require('../config.js'), ROOT = C.ws('series')
const log = C.PUBLICADOS
const feitos = new Set((fs.existsSync(log) ? JSON.parse(fs.readFileSync(log, 'utf8')) : []).map(p => p.imagem))
for (const f of fs.readdirSync(path.join(ROOT, 'png')).filter(f => /^\d\d-.*\.png$/.test(f)).sort()) {
  if (feitos.has(f)) continue
  const nn = f.slice(0, 2), base = f.replace(/\.png$/, '')
  console.log(JSON.stringify({ nn, png: `png/${f}`, legenda: `legendas/${base}.txt`, restam: 30 - feitos.size }))
  process.exit(0)
}
console.log(JSON.stringify({ fim: true }))
