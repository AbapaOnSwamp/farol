'use strict'
// Peças de interface do Daily UI (1080 × 1350), na identidade do Arquipélago. Estende o kit dos posts.
const L = require('../brand/lib.js')
const { W, H, M, kit, wrap } = require('../brand/kit.js')
const { T, FONT } = L

const TOTAL = 100

function ui(b) {
  const k = kit(b)
  return Object.assign(k, {
    // moldura comum do desafio: barra com número e progresso dos 100, título do tema e rodapé com assinatura
    chromeDaily(n, tema, accent = T.secondary) {
      b.rect(0, 0, W, H, T.ink)
      k.stars(500 + n * 31, 60, 0, 110, W - 8, H - 240)
      b.rect(0, 0, W, 100, T.deep)
      b.rect(0, 100, W, 4, T.ink)
      b.rect(0, 104, W, 4, T.deep)
      b.rect(0, 104, Math.round(W * n / TOTAL), 4, accent)
      b.rect(M, 42, 18, 18, accent)
      b.text(M + 32, 60, `DAILY UI ${String(n).padStart(3, '0')}`, { f: FONT.pixel, s: 16, c: T.secondary, ls: 2 })
      b.text(W - M, 60, `${n}/${TOTAL}`, { f: FONT.pixel, s: 13, c: T.muted, a: 'end', ls: 1 })
      b.rect(0, H - 124, W, 4, T.line)
      b.rect(0, H - 120, W, 120, T.deep)
      k.og(M, H - 94, 64)
      b.text(M + 88, H - 62, 'Otavio Guerra', { f: FONT.display, s: 26, w: 700, c: '#ffffff' })
      b.text(M + 88, H - 30, 'UI/UX · Designer Digital · Motion · 3D', { f: FONT.copy, s: 18, c: T.soft })
      b.text(W - M, H - 62, '#dailyui', { f: FONT.pixel, s: 12, c: T.muted, a: 'end' })
      b.text(W - M, H - 34, tema.toLowerCase(), { f: FONT.pixel, s: 12, c: accent, a: 'end' })
    },
    // celular: moldura do site (--frame) com barra de status; devolve a área útil da tela
    phone(x, y, w, h, o = {}) {
      L.frame(b, x, y, w, h, o.bg || T.deep)
      b.text(x + 22, y + 30, '9:41', { f: FONT.pixel, s: 11, c: T.soft })
      b.rect(x + w - 70, y + 20, 28, 12, T.soft); b.rect(x + w - 42, y + 24, 3, 4, T.soft)
      b.rect(x + w - 92, y + 22, 4, 10, T.soft); b.rect(x + w - 86, y + 19, 4, 13, T.soft)
      b.rect(x + w / 2 - 50, y + h - 18, 100, 5, T.muted, { op: 0.6 })
      return { x: x + 24, y: y + 54, w: w - 48, h: h - 80 }
    },
    // campo de formulário: rótulo pixel sempre visível, caixa com borda; estados: normal, focus, error, ok
    field(x, y, w, label, value, o = {}) {
      const st = o.state || 'normal', h = 56
      b.text(x, y, label, { f: FONT.pixel, s: 10, c: st === 'error' ? T.danger : st === 'focus' ? T.secondary : T.muted, ls: 0.5 })
      const by = y + 12
      if (st === 'focus') b.rect(x - 5, by - 5, w + 10, h + 10, T.secondary, { op: 0.22 })
      b.rect(x, by, w, h, T.ink)
      b.rect(x, by, w, h, 'none', { stroke: st === 'focus' ? T.secondary : st === 'error' ? T.danger : T.line, sw: st === 'normal' ? 2 : 3 })
      b.text(x + 18, by + 36, value, { f: o.pw ? FONT.display : FONT.copy, s: o.pw ? 22 : 19, w: 500, c: o.ph ? T.muted : '#ffffff', ls: o.pw ? 3 : 0 })
      if (st === 'focus' && !o.pw) { const cx = x + 18 + (o.caret != null ? o.caret : Math.round(value.length * 19 * 0.52)) + 2; b.rect(cx, by + 16, 2, 26, T.secondary) }
      if (o.icon) b.text(x + w - 20, by + 36, o.icon, { f: FONT.copy, s: 18, c: T.muted, a: 'end' })
      if (o.hint) b.text(x, by + h + 24, o.hint, { f: FONT.copy, s: 14, c: st === 'error' ? T.danger : T.muted })
      return by + h
    },
    // botão grande (cartucho do site): kind primary | mint | ghost
    btn(x, y, w, label, o = {}) {
      const h = o.h || 58, kind = o.kind || 'mint'
      const base = { primary: T.primary, mint: T.secondary, ghost: T.ink }[kind]
      const lo = { primary: T.primaryLo, mint: T.secondaryLo, ghost: T.ink }[kind]
      b.rect(x + 4, y + 6, w, h, '#0a0618', { op: 0.6 })
      b.rect(x - 3, y - 3, w + 6, h + 6, T.ink)
      b.rect(x, y, w, h, base)
      if (kind === 'ghost') b.rect(x + 1, y + 1, w - 2, h - 2, 'none', { stroke: T.muted, sw: 2 })
      else { b.rect(x, y, w, 3, '#ffffff', { op: 0.38 }); b.rect(x, y + h - 5, w, 5, lo) }
      b.text(x + w / 2, y + h / 2 + 7, label, { f: FONT.display, s: o.s || 20, w: 700, c: kind === 'mint' ? T.ink : '#ffffff', a: 'middle' })
    },
    // marcador numerado que liga a tela às notas de UX
    pin(x, y, n, c = T.quest.gold) {
      b.rect(x - 15, y - 15, 30, 30, T.ink)
      b.rect(x - 12, y - 12, 24, 24, c)
      b.text(x, y + 6, String(n), { f: FONT.pixel, s: 12, c: T.ink, a: 'middle' })
    },
    // nota de UX: número, título e texto
    note(x, y, w, n, title, txt, c = T.quest.gold) {
      k.pin(x + 15, y + 2, n, c)
      b.text(x + 44, y + 10, title, { f: FONT.display, s: 24, w: 700, c: '#ffffff' })
      return k.para(x + 44, y + 44, txt, { s: 18, c: T.soft, maxw: w - 44, lh: 26 })
    },
    check(x, y, on, label) {
      b.rect(x, y, 22, 22, T.ink); b.rect(x, y, 22, 22, 'none', { stroke: on ? T.secondary : T.line, sw: 2 })
      if (on) { b.rect(x + 5, y + 11, 4, 4, T.secondary); b.rect(x + 9, y + 14, 4, 4, T.secondary); b.rect(x + 13, y + 6, 4, 8, T.secondary) }
      b.text(x + 34, y + 17, label, { f: FONT.copy, s: 15, c: T.soft })
    },
  })
}

module.exports = { ui, W, H, M, T, FONT, wrap, TOTAL }
