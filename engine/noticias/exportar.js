'use strict'
// Exporta um carrossel pelo Edge: png/<id>/NN.png (prévia de cada slide) e pdf/<id>.pdf (o arquivo que vai para o LinkedIn).
// Uso: node exportar.js <id>   (ex.: 2026-11-03-a)
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = require('../config.js').ws('noticias')
const id = process.argv[2]
const EDGE = path.join(process.env['ProgramFiles(x86)'], 'Microsoft', 'Edge', 'Application', 'msedge.exe')
const url = p => 'file:///' + p.replace(/\\/g, '/')
const PERFIL = path.join(require('os').tmpdir(), 'edge-carrossel')
const edge = args => execFileSync(EDGE, ['--headless', `--user-data-dir=${PERFIL}`, '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', ...args], { stdio: 'ignore' })

const svgDir = path.join(ROOT, 'svg', id), pngDir = path.join(ROOT, 'png', id)
fs.mkdirSync(pngDir, { recursive: true }); fs.mkdirSync(path.join(ROOT, 'pdf'), { recursive: true })
const slides = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg')).sort()
// o Edge às vezes devolve antes de gravar: apaga, tenta até 3 vezes e espera cada arquivo aparecer
const esperar = (p, n = 40) => { for (let w = 0; w < n && !fs.existsSync(p); w++) execFileSync('powershell', ['-NoProfile', '-Command', 'Start-Sleep -Milliseconds 500']) }
for (const f of slides) {
  const png = path.join(pngDir, f.replace('.svg', '.png'))
  if (fs.existsSync(png)) fs.unlinkSync(png)
  for (let t = 0; t < 3 && !fs.existsSync(png); t++) { edge([`--screenshot=${png}`, '--window-size=1080,1350', url(path.join(svgDir, f))]); esperar(png) }
  if (!fs.existsSync(png)) { console.error('slide não exportou:', f); process.exit(1) }
}

// PDF: uma página de 1080 × 1350 por slide, com os PNG (as fontes já estão "assadas" na imagem)
const html = path.join(pngDir, 'carrossel.html')
fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:1080px 1350px;margin:0}html,body{margin:0}img{display:block;width:1080px;height:1350px;page-break-after:always;break-after:page}img:last-child{page-break-after:auto;break-after:auto}</style></head><body>${slides.map(f => `<img src="${f.replace('.svg', '.png')}">`).join('')}</body></html>`, 'utf8')
const pdf = path.join(ROOT, 'pdf', id + '.pdf')
if (fs.existsSync(pdf)) fs.unlinkSync(pdf)
// o Edge às vezes devolve antes de terminar de gravar: tenta de novo e espera o arquivo aparecer
for (let t = 0; t < 3 && !fs.existsSync(pdf); t++) {
  edge([`--print-to-pdf=${pdf}`, '--no-pdf-header-footer', '--print-to-pdf-no-header', url(html)])
  for (let w = 0; w < 40 && !fs.existsSync(pdf); w++) execFileSync('powershell', ['-NoProfile', '-Command', 'Start-Sleep -Milliseconds 500'])
}
const pages = (fs.readFileSync(pdf, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
console.log(JSON.stringify({ id, slides: slides.length, pdf: `pdf/${id}.pdf`, paginas: pages, kb: Math.round(fs.statSync(pdf).size / 1024) }))
