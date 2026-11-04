'use strict'
// Peças dos posts do LinkedIn (1080 × 1350, 4:5). Usa os tokens e as molduras do design system (../../build/lib.js).
const fs = require('fs')
const path = require('path')
const L = require('./lib.js')
const { T, FONT, SITE, esc } = L

const W = 1080, H = 1350, M = 72

// ---------------------------------------------------------------- imagens (tamanho real lido do arquivo, para encaixar sem distorcer)
function imgSize(buf) {
  if (buf.readUInt32BE(0) === 0x89504e47) return [buf.readUInt32BE(16), buf.readUInt32BE(20)]
  if (buf.toString('ascii', 0, 4) === 'RIFF') {
    const k = buf.toString('ascii', 12, 16)
    if (k === 'VP8X') return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)]
    if (k === 'VP8L') { const b = buf.readUInt32LE(21); return [1 + (b & 0x3fff), 1 + ((b >> 14) & 0x3fff)] }
    return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff]
  }
  let i = 2
  while (i < buf.length) {
    const m = buf[i + 1], len = buf.readUInt16BE(i + 2)
    if (m >= 0xc0 && m <= 0xc3) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)]
    i += 2 + len
  }
  throw new Error('tamanho desconhecido')
}
// PNG de 8 bits (RGB, RGBA ou paleta), sem entrelaçamento: devolve um array com "#rrggbb/alfa" por pixel ('' = transparente)
function decodePng(buf) {
  const zlib = require('zlib')
  let o = 8, w, h, ct, pal = [], trns = [], idat = []
  while (o < buf.length) {
    const len = buf.readUInt32BE(o), t = buf.toString('ascii', o + 4, o + 8), d = buf.slice(o + 8, o + 8 + len)
    if (t === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); ct = d[9]; if (d[8] !== 8 || d[12]) throw new Error('PNG não suportado') }
    if (t === 'PLTE') for (let i = 0; i < d.length; i += 3) pal.push([d[i], d[i + 1], d[i + 2]])
    if (t === 'tRNS') trns = [...d]
    if (t === 'IDAT') idat.push(d)
    o += 12 + len
  }
  const bpp = { 2: 3, 3: 1, 6: 4, 0: 1, 4: 2 }[ct], st = w * bpp
  const raw = zlib.inflateSync(Buffer.concat(idat)), px = Buffer.alloc(h * st)
  for (let y = 0; y < h; y++) {
    const f = raw[y * (st + 1)]
    for (let x = 0; x < st; x++) {
      const r = raw[y * (st + 1) + 1 + x], a = x >= bpp ? px[y * st + x - bpp] : 0, u = y ? px[(y - 1) * st + x] : 0, c = y && x >= bpp ? px[(y - 1) * st + x - bpp] : 0
      let v = r
      if (f === 1) v = r + a; else if (f === 2) v = r + u; else if (f === 3) v = r + ((a + u) >> 1)
      else if (f === 4) { const p = a + u - c, pa = Math.abs(p - a), pb = Math.abs(p - u), pc = Math.abs(p - c); v = r + (pa <= pb && pa <= pc ? a : pb <= pc ? u : c) }
      px[y * st + x] = v & 255
    }
  }
  const hex = (r, g, b) => '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
  const out = []
  for (let i = 0; i < w * h; i++) {
    const q = i * bpp
    let rgb, al = 255
    if (ct === 6) { rgb = [px[q], px[q + 1], px[q + 2]]; al = px[q + 3] }
    else if (ct === 2) rgb = [px[q], px[q + 1], px[q + 2]]
    else if (ct === 3) { rgb = pal[px[q]]; al = trns[px[q]] ?? 255 }
    else { rgb = [px[q], px[q], px[q]]; if (ct === 4) al = px[q + 1] }
    out.push(al ? `${hex(...rgb)}/${al}` : '')
  }
  return out
}
const MIME = { '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }

// ---------------------------------------------------------------- largura aproximada do texto (para quebrar linhas)
const EM = { [FONT.display]: 0.56, [FONT.copy]: 0.52, [FONT.game]: 0.4, [FONT.pixel]: 1.0, [FONT.serif]: 0.5 }
function wrap(str, font, size, maxw) {
  const per = Math.max(4, Math.floor(maxw / (size * (EM[font] || 0.55))))
  const out = []
  for (const para of String(str).split('\n')) {
    let line = ''
    for (const w of para.split(' ')) {
      if (!line) line = w
      else if ((line + ' ' + w).length <= per) line += ' ' + w
      else { out.push(line); line = w }
    }
    out.push(line)
  }
  return out
}

// ---------------------------------------------------------------- caixa de ferramentas de um post (coordenadas dentro do post)
function kit(b) {
  const k = {
    W, H, M, T, FONT,
    rect: (...a) => b.rect(...a),
    text: (...a) => b.text(...a),
    group: (n, fn) => b.group(n, fn),
    kick(x, y, s, c = T.secondary) { b.rect(x, y - 16, 16, 16, c); b.text(x + 30, y, s, { f: FONT.pixel, s: 15, c, ls: 1.5 }) },
    // título grande: aceita linhas prontas (array) ou quebra sozinho
    title(x, y, str, o = {}) {
      const s = o.s || 88, f = o.f || FONT.display
      const lines = Array.isArray(str) ? str : wrap(str, f, s, o.maxw || W - 2 * M)
      const lh = o.lh || Math.round(s * 1.06)
      if (o.shadow !== false) b.text(x + 4, y + 5, lines, { f, s, w: o.w || 700, c: o.sc || T.primaryInk, lh, a: o.a })
      b.text(x, y, lines, { f, s, w: o.w || 700, c: o.c || '#ffffff', lh, a: o.a })
      return y + (lines.length - 1) * lh
    },
    para(x, y, str, o = {}) {
      const s = o.s || 28, f = o.f || FONT.copy
      const lines = wrap(str, f, s, o.maxw || W - 2 * M)
      const lh = o.lh || Math.round(s * 1.42)
      b.text(x, y, lines, { f, s, w: o.w, c: o.c || T.soft, lh, a: o.a })
      return y + (lines.length - 1) * lh
    },
    // fala de RPG (VT323 no pergaminho, com rabicho)
    bubble(x, y, w, str, o = {}) {
      const s = o.s || 36, lh = Math.round(s * 1.12), pad = 26
      const lines = wrap(str, FONT.game, s, w - 2 * pad)
      const h = pad * 2 + lines.length * lh - 8
      b.rect(x + 6 - 3, y + 8 - 3, w + 6, h + 6, '#0a0618', { op: 0.5 })
      b.rect(x - 3, y - 3, w + 6, h + 6, T.ink)
      b.rect(x, y, w, h, T.parch)
      const tx = o.tail === 'right' ? x + w - 70 : x + 40
      if (o.tail !== false) { b.rect(tx - 3, y + h, 30, 3, T.ink); b.poly([[tx, y + h], [tx + 24, y + h], [tx + 4, y + h + 20]], T.parch); b.poly([[tx + 24, y + h], [tx + 27, y + h], [tx + 4, y + h + 23], [tx + 2, y + h + 18]], T.ink) }
      b.text(x + pad, y + pad + s * 0.72, lines, { f: FONT.game, s, c: T.ink, lh })
      if (o.who) b.text(x + w - pad, y + pad + 4, o.who, { f: FONT.pixel, s: 10, c: T.quest.rust, a: 'end', ls: 1 })
      return h
    },
    // imagem: encaixa (contain) na caixa w×h, ou escala inteira k para pixel art
    img(file, x, y, o = {}) {
      const p = path.isAbsolute(file) ? file : path.join(SITE, file)
      const buf = fs.readFileSync(p)
      const [iw, ih] = imgSize(buf)
      let w, h
      if (o.k) { w = iw * o.k; h = ih * o.k } else { const s = Math.min(o.w / iw, o.h / ih); w = Math.round(iw * s); h = Math.round(ih * s) }
      let ix = x, iy = y
      if (!o.k && o.center !== false) { ix = x + Math.round((o.w - w) / 2); iy = y + Math.round((o.h - h) / 2) }
      if (o.anchor === 'bottom') iy = y - h
      if (o.anchor === 'center') { ix = x - Math.round(w / 2); iy = y - Math.round(h / 2) }
      const mime = MIME[path.extname(p).toLowerCase()]
      // pixel art ampliada vira retângulos (o desigma suaviza imagem esticada): uma corrida de pixels iguais por retângulo
      if (mime === 'image/png' && o.k >= 2) {
        const px = decodePng(buf)
        let s = ''
        for (let yy = 0; yy < ih; yy++) for (let xx = 0; xx < iw;) {
          const c = px[yy * iw + xx]
          let n = 1
          while (xx + n < iw && px[yy * iw + xx + n] === c) n++
          if (c) { const [hx, a] = c.split('/'); s += `<rect x="${ix + xx * o.k}" y="${iy + yy * o.k}" width="${n * o.k}" height="${o.k}" fill="${hx}"${a !== '255' ? ` fill-opacity="${(a / 255).toFixed(2)}"` : ''}/>` }
          xx += n
        }
        b.add(`<g${o.op != null ? ` opacity="${o.op}"` : ''}>${s}</g>`)
        return { x: ix, y: iy, w, h }
      }
      b.add(`<image x="${ix}" y="${iy}" width="${w}" height="${h}"${mime === 'image/png' ? ' image-rendering="pixelated"' : ''}${o.op != null ? ` opacity="${o.op}"` : ''} href="data:${mime};base64,${buf.toString('base64')}"/>`)
      return { x: ix, y: iy, w, h }
    },
    // moldura RPG do site (--frame) com faixa de cor no topo
    card(x, y, w, h, o = {}) {
      L.frame(b, x, y, w, h, o.fill || T.panel)
      if (o.accent) b.rect(x, y, w, 8, o.accent)
    },
    // moldura da Swamp: preto, borda roxa e cantos
    swampCard(x, y, w, h) {
      b.rect(x + 8, y + 10, w, h, '#000000', { op: 0.55 })
      b.rect(x - 4, y - 4, w + 8, h + 8, T.swamp.purple)
      b.rect(x, y, w, h, T.swamp.pack)
    },
    // etiquetas no tamanho do post (as do lib.js são do tamanho do site, pequenas demais em 1080 px)
    chips(x, y, list, o = {}) {
      let cx = x
      const s = 21, h = 46
      for (const c of list) {
        const w = Math.round(c.length * s * 0.54 + (o.tool ? 40 : 58))
        if (o.tool) { b.rect(cx, y, w, h, '#0a2a22', { op: 0.9, stroke: T.secondaryLo, sw: 2 }); b.text(cx + 20, y + 30, c, { f: FONT.copy, s, w: 500, c: T.secondary }) }
        else if (o.white) { b.rect(cx - 3, y - 3, w + 6, h + 6, T.ink); b.rect(cx, y, w, h, T.parch); b.text(cx + 14, y + 30, '✦', { f: FONT.copy, s: 16, c: T.quest.rust }); b.text(cx + 38, y + 30, c, { f: FONT.display, s, w: 600, c: T.ink }) }
        else { b.rect(cx, y, w, h, T.panel2, { op: 0.85, stroke: o.accent || T.line, sw: 2 }); b.rect(cx + 18, y + 18, 10, 10, o.accent || T.primaryHi); b.text(cx + 40, y + 30, c, { f: FONT.copy, s, w: 500, c: T.soft }) }
        cx += w + 14
      }
      return cx
    },
    plaque: (x, y, s, c) => L.plaque(b, x, y, s, c),
    bar: (...a) => L.bar(b, ...a),
    stars: (seed, n, x, y, w, h) => L.stars(b, seed, n, x, y, w, h),
    logoHex: (x, y, r) => L.logoHex(b, x, y, r),
    poly: (...a) => b.poly(...a),
    line: (...a) => b.line(...a),
    // linha de "status" (bolinha + texto), como a MISSÃO da ficha
    status(x, y, s, c = T.secondary) { b.rect(x, y - 12, 12, 12, c); b.text(x + 24, y, s, { f: FONT.copy, s: 24, w: 600, c }) },
    // brasão OG (cabeçalho do site)
    og(x, y, s = 64) {
      b.rect(x + 4, y + 5, s, s, '#0a0618', { op: 0.5 })
      b.rect(x, y, s, s, T.quest.gold)
      b.rect(x + 6, y + 6, s - 12, s - 12, T.primary)
      b.rect(x + 6, y + 6, s - 12, 4, '#ffffff', { op: 0.35 })
      b.text(x + s / 2, y + s / 2 + s * 0.17, 'OG', { f: FONT.display, s: Math.round(s * 0.44), w: 700, c: '#ffffff', a: 'middle' })
    },
  }
  return k
}

// ---------------------------------------------------------------- moldura comum: céu de estrelas, barra de fase com XP e rodapé com assinatura
function chrome(b, k, p, i, total) {
  const dark = p.theme === 'swamp'
  b.rect(0, 0, W, H, dark ? T.swamp.black : T.ink)
  k.stars(1000 + i * 97, dark ? 30 : 70, 0, 110, W - 8, H - 240)
  b.rect(0, 0, W, 100, dark ? T.swamp.pack : T.deep)
  b.rect(0, 100, W, 4, T.ink)
  b.rect(0, 104, W, 4, T.deep)
  b.rect(0, 104, Math.round(W * i / total), 4, dark ? T.swamp.purple : T.secondary)
  b.rect(M, 42, 18, 18, p.accent)
  b.text(M + 32, 60, `FASE ${String(i).padStart(2, '0')}`, { f: FONT.pixel, s: 16, c: dark ? T.swamp.lilac : T.secondary, ls: 2 })
  b.text(W - M, 60, p.kicker, { f: FONT.pixel, s: 13, c: T.muted, a: 'end', ls: 1 })
  b.rect(0, H - 124, W, 4, dark ? T.swamp.edge : T.line)
  b.rect(0, H - 120, W, 120, dark ? T.swamp.pack : T.deep)
  k.og(M, H - 94, 64)
  b.text(M + 88, H - 62, 'Otavio Guerra', { f: FONT.display, s: 26, w: 700, c: '#ffffff' })
  b.text(M + 88, H - 30, 'Designer Digital · Motion · 3D', { f: FONT.copy, s: 18, c: T.soft })
  b.text(W - M, H - 62, 'portfolio-otavio-guerra', { f: FONT.pixel, s: 12, c: T.muted, a: 'end' })
  b.text(W - M, H - 34, '.vercel.app', { f: FONT.pixel, s: 12, c: dark ? T.swamp.lilac : T.secondary, a: 'end' })
}

// ---------------------------------------------------------------- layouts prontos
const L2 = {
  // projeto: imagem na moldura, título, descrição, etiquetas e uma fala
  project(k, p) {
    const sw = p.theme === 'swamp'
    const x = M + 9, y = 160, w = W - 2 * M - 18, h = p.imgH || 560
    if (sw) k.swampCard(x, y, w, h); else k.card(x, y, w, h, { fill: T.deep })
    k.img(p.img, x + 12, y + 12, { w: w - 24, h: h - 24 })
    let ty = y + h + 96
    if (sw) ty = k.title(M, ty, p.title.toUpperCase(), { f: FONT.serif, s: 64, w: 400, sc: '#000000', c: '#ffffff' })
    else ty = k.title(M, ty, p.title, { s: 64 })
    ty = k.para(M, ty + 56, p.desc, { s: 27, c: T.soft })
    const cy = ty + 34
    const ex = k.chips(M, cy, p.tags, { accent: p.accent })
    if (p.tools) k.chips(ex + 8, cy, p.tools, { tool: true })
    if (p.fala) k.bubble(M, cy + 96, W - 2 * M, p.fala, { s: 32, tail: false, who: p.who || 'OTAVIO' })
  },
  // lista de dicas numeradas dentro de uma janela RPG
  tips(k, p) {
    let y = 210
    k.kick(M, y, p.label, p.accent)
    y = k.title(M, y + 100, p.title, { s: p.ts || 70 }) + 70
    const bx = M + 9, bw = W - 2 * M - 18
    const items = p.items
    const ih = Math.floor((1180 - y - 30) / items.length)
    items.forEach(([h, t], j) => {
      const iy = y + j * ih
      k.card(bx, iy, bw, ih - 34, { fill: T.panel, accent: p.accent })
      k.text(bx + 30, iy + 72, String(j + 1).padStart(2, '0'), { f: FONT.pixel, s: 30, c: p.accent })
      k.text(bx + 120, iy + 70, h, { f: FONT.display, s: 34, w: 700, c: '#ffffff' })
      k.para(bx + 120, iy + 114, t, { s: 24, c: T.soft, maxw: bw - 160, lh: 33 })
    })
  },
}

module.exports = { W, H, M, kit, chrome, L2, wrap, T, FONT, esc }
