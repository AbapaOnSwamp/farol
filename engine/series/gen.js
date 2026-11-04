'use strict'
// Gera linkedin/posts.svg (os posts em grade, cada um num grupo "Post NN · nome") e linkedin/legendas.md.
// Uso: node gen.js [quantos]   (sem número: todos)
const fs = require('fs')
const path = require('path')
const { Board, T, FONT } = require('../brand/lib.js')
const { W, H, kit, chrome, L2 } = require('../brand/kit.js')
const POSTS = require('./posts.js')

// a Press Start 2P não tem acentos: nos rótulos pixel, "MISSÃO" vira "MISSAO"
const text0 = Board.prototype.text
Board.prototype.text = function (x, y, str, o = {}) {
  if (o.f === FONT.pixel) { const strip = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, ''); str = Array.isArray(str) ? str.map(strip) : strip(str) }
  return text0.call(this, x, y, str, o)
}

const OUT = require('../config.js').ws('series')
const n = Math.min(POSTS.length, +process.argv[2] || POSTS.length)
const COLS = 6, GAP = 160, TOP = 120
const rows = Math.ceil(POSTS.length / COLS)
const CW = COLS * W + (COLS + 1) * GAP, CH = rows * (H + TOP) + (rows + 1) * GAP

const b = new Board('posts', CW, CH, T.deep)
POSTS.slice(0, n).forEach((p, j) => {
  const i = j + 1, x = GAP + (j % COLS) * (W + GAP), y = GAP + TOP + Math.floor(j / COLS) * (H + TOP + GAP)
  const nn = String(i).padStart(2, '0')
  b.add(`<g id="Rótulo ${nn}" data-name="Rótulo ${nn}" transform="translate(${x} ${y - 40})">`)
  b.text(0, 0, `${nn} · ${p.name}`, { f: FONT.pixel, s: 22, c: T.muted })
  b.add('</g>')
  b.add(`<g id="Post ${nn} · ${p.name}" data-name="Post ${nn} · ${p.name}" transform="translate(${x} ${y})">`)
  const k = kit(b)
  chrome(b, k, p, i, POSTS.length)
  if (p.layout) L2[p.layout](k, p); else p.draw(k, p)
  b.add('</g>')
  // cada post também sai sozinho (svg/), para exportar fora do editor
  const one = new Board(`${nn}-${p.slug}`, W, H, T.ink)
  const k1 = kit(one)
  chrome(one, k1, p, i, POSTS.length)
  if (p.layout) L2[p.layout](k1, p); else p.draw(k1, p)
  one.save(path.join(OUT, 'svg'))
})
fs.writeFileSync(path.join(OUT, 'posts.svg'), b.svg(), 'utf8')

const md = ['# LinkedIn · 30 posts', '', 'Ordem de publicação de cima para baixo. As imagens estão em `png/` com o mesmo número.', '']
POSTS.forEach((p, j) => { const nn = String(j + 1).padStart(2, '0'); md.push(`## ${nn} · ${p.name}`, '', `Imagem: \`png/${nn}-${p.slug}.png\``, '', p.caption, '', '---', '') })
fs.writeFileSync(path.join(OUT, 'legendas.md'), md.join('\n'), 'utf8')
// uma legenda por post (o painel e o proximo-post.js leem daqui)
fs.mkdirSync(path.join(OUT, 'legendas'), { recursive: true })
POSTS.forEach((p, j) => fs.writeFileSync(path.join(OUT, 'legendas', `${String(j + 1).padStart(2, '0')}-${p.slug}.txt`), p.caption.trim() + '\n', 'utf8'))
console.log(`ok: ${n} posts, ${CW}x${CH}, ${Math.round(fs.statSync(path.join(OUT, 'posts.svg')).size / 1048576 * 10) / 10} MB`)
