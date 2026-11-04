'use strict'
// Exporta para PNG (pelo Edge headless) os SVG gerados: node exportar-png.js dailyui|series [prefixo]
//   workspace/<tipo>/svg/*.svg → workspace/<tipo>/png/*.png
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const C = require('./config.js')

const tipo = process.argv[2] || 'dailyui', pref = process.argv[3] || ''
const EDGE = [process.env['ProgramFiles(x86)'], process.env.ProgramFiles].filter(Boolean).map(p => path.join(p, 'Microsoft', 'Edge', 'Application', 'msedge.exe')).find(fs.existsSync)
if (!EDGE) { console.error('Edge não encontrado: instale o Microsoft Edge ou exporte pelo Desigma.'); process.exit(1) }
const PERFIL = path.join(require('os').tmpdir(), 'content-engine-edge')
const esperar = p => { for (let w = 0; w < 40 && !fs.existsSync(p); w++) execFileSync('powershell', ['-NoProfile', '-Command', 'Start-Sleep -Milliseconds 400']) }
const src = C.ws(tipo, 'svg'), dst = C.ws(tipo, 'png')
fs.mkdirSync(dst, { recursive: true })
const out = []
for (const f of fs.readdirSync(src).filter(f => f.endsWith('.svg') && f.startsWith(pref)).sort()) {
  const s = fs.readFileSync(path.join(src, f), 'utf8'), [, w, h] = s.match(/width="([\d.]+)" height="([\d.]+)"/)
  const png = path.join(dst, f.replace('.svg', '.png'))
  if (fs.existsSync(png)) fs.unlinkSync(png)
  for (let t = 0; t < 3 && !fs.existsSync(png); t++) { execFileSync(EDGE, ['--headless', `--user-data-dir=${PERFIL}`, '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--screenshot=${png}`, `--window-size=${Math.round(w)},${Math.round(h)}`, 'file:///' + path.join(src, f).replace(/\\/g, '/')], { stdio: 'ignore' }); esperar(png) }
  out.push(`${f.replace('.svg', '.png')}${fs.existsSync(png) ? '' : ' FALHOU'}`)
}
console.log(JSON.stringify({ tipo, png: out }))
