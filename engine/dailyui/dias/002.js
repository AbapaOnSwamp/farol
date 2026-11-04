'use strict'
// Daily UI 002 · Credit Card Checkout — pagamento na Loja do Porto (desktop), com as decisões de UX numa grade abaixo.
const { T, FONT } = require('../../brand/lib.js')

// ícones desenhados com retângulos (nada de símbolo em texto)
function lock(k, x, y, c = T.secondary) {
  k.rect(x + 3, y, 8, 3, c); k.rect(x + 1, y + 2, 3, 6, c); k.rect(x + 10, y + 2, 3, 6, c)
  k.rect(x, y + 7, 14, 10, c); k.rect(x + 6, y + 10, 2, 4, T.ink)
}
function tick(k, x, y, c = T.ink) { k.rect(x, y + 5, 3, 3, c); k.rect(x + 3, y + 8, 3, 3, c); k.rect(x + 6, y + 5, 3, 3, c); k.rect(x + 9, y + 2, 3, 3, c); k.rect(x + 12, y - 1, 3, 3, c) }
function alert(k, x, y) { k.rect(x, y, 20, 20, T.danger); k.rect(x + 8, y + 4, 4, 8, T.ink); k.rect(x + 8, y + 14, 4, 3, T.ink) }

module.exports = {
  tema: 'Credit Card Checkout', accent: T.quest.gold,
  draw(k) {
    k.kick(k.M, 164, 'DESAFIO 002', T.quest.gold)
    k.title(k.M, 228, 'Credit Card Checkout', { s: 60 })
    k.para(k.M, 270, 'A última fase da compra na Loja do Porto. Pagar sem susto.', { s: 21, maxw: 940 })

    // ---------------------------------------------------------------- janela do navegador
    const bx = k.M + 9, by = 300, bw = k.W - 2 * k.M - 18, bh = 526
    k.card(bx, by, bw, bh, { fill: T.deep })
    k.rect(bx, by, bw, 46, T.panel)
    ;[T.danger, T.quest.gold, T.secondary].forEach((c, i) => k.rect(bx + 20 + i * 22, by + 17, 12, 12, c))
    k.rect(bx + 104, by + 9, bw - 124, 28, T.ink)
    lock(k, bx + 116, by + 14, T.secondary)
    k.text(bx + 142, by + 29, 'loja.arquipelago.app/pagamento', { f: FONT.copy, s: 14, c: T.soft })

    // coluna do formulário
    const x0 = bx + 34, w0 = 510
    k.text(x0, by + 96, 'Pagamento', { f: FONT.display, s: 32, w: 700, c: '#ffffff' })
    k.text(x0, by + 126, 'O tesouro já está no barco. Só falta isto.', { f: FONT.game, s: 24, c: T.soft })

    let y = by + 164
    const f1 = y
    y = k.field(x0, y, w0, 'NÚMERO DO CARTÃO', '4921 8830 1274 5521', { state: 'focus', caret: 200 })
    // bandeira detectada: mini cartão desenhado dentro do campo
    k.rect(x0 + w0 - 70, y - 42, 50, 32, T.primary); k.rect(x0 + w0 - 70, y - 34, 50, 6, T.primaryInk); k.rect(x0 + w0 - 62, y - 22, 12, 8, T.quest.gold)
    y += 24
    const f2 = y, hw = (w0 - 24) / 2
    k.field(x0, y, hw, 'VALIDADE', '13/27', { state: 'error' })
    y = k.field(x0 + hw + 24, y, hw, 'CVV', '•••', { pw: true })
    alert(k, x0, y + 12)
    k.text(x0 + 30, y + 28, 'O mês vai de 01 a 12.', { f: FONT.copy, s: 15, w: 600, c: T.danger })
    k.text(x0 + hw + 24, y + 28, '3 números no verso', { f: FONT.copy, s: 15, c: T.muted })
    y += 62
    y = k.field(x0, y, w0, 'NOME IMPRESSO NO CARTÃO', 'OTAVIO GUERRA') + 24
    k.check(x0, y, true, 'Cobrança no mesmo endereço da entrega')

    // coluna do resumo
    const x1 = bx + 590, w1 = bw - 590 - 34
    k.text(x1, by + 84, 'FASE 3 DE 3', { f: FONT.pixel, s: 10, c: T.quest.gold, ls: 1 })
    const steps = ['Sacola', 'Entrega', 'Pagar']
    const sx = i => x1 + Math.round(i * (w1 - 22) / 2)
    k.rect(sx(0) + 11, by + 105, sx(2) - sx(0), 4, T.secondary)
    steps.forEach((t, i) => {
      const cur = i === 2
      k.rect(sx(i) - 3, by + 93, 28, 28, T.ink)
      k.rect(sx(i), by + 96, 22, 22, cur ? T.quest.gold : T.secondary)
      if (!cur) tick(k, sx(i) + 3, by + 103)
      k.text(sx(i) + 11, by + 144, t, { f: FONT.copy, s: 15, w: cur ? 700 : 500, c: cur ? '#ffffff' : T.soft, a: i === 0 ? 'start' : i === 2 ? 'end' : 'middle' })
    })
    const cy = by + 166, ch = 228
    k.card(x1, cy, w1, ch, { fill: T.panel })
    k.text(x1 + 20, cy + 32, 'SUA SACOLA', { f: FONT.pixel, s: 10, c: T.muted, ls: 0.5 })
    k.rect(x1 + 20, cy + 48, 86, 78, T.ink)
    k.img('img/islet_2.png', x1 + 24, cy + 52, { k: 2 })
    k.text(x1 + 122, cy + 72, 'Bilhete Ilha 3D', { f: FONT.copy, s: 16, w: 600, c: '#ffffff' })
    k.text(x1 + 122, cy + 96, 'ida e volta', { f: FONT.copy, s: 14, c: T.muted })
    k.text(x1 + 122, cy + 120, 'R$ 49,00', { f: FONT.copy, s: 16, w: 600, c: T.soft })
    k.rect(x1 + 20, cy + 144, w1 - 40, 2, T.line)
    k.text(x1 + 20, cy + 168, 'Taxa do porto', { f: FONT.copy, s: 15, c: T.soft })
    k.text(x1 + w1 - 20, cy + 168, 'R$ 5,90', { f: FONT.copy, s: 15, c: T.soft, a: 'end' })
    k.text(x1 + 20, cy + 212, 'Total', { f: FONT.display, s: 22, w: 700, c: '#ffffff' })
    k.text(x1 + w1 - 20, cy + 212, 'R$ 54,90', { f: FONT.display, s: 26, w: 700, c: T.secondary, a: 'end' })
    const pyb = cy + ch + 20
    k.btn(x1, pyb, w1, 'Pagar R$ 54,90')
    lock(k, x1, pyb + 80, T.secondary)
    k.text(x1 + 24, pyb + 94, 'Nada é cobrado antes deste clique.', { f: FONT.copy, s: 14, c: T.soft })

    // marcadores na tela
    k.pin(x0 + w0 + 2, f1 + 12, 1)
    k.pin(x0 + hw + 2, f2 + 12, 2)
    k.pin(x1 + w1 + 2, pyb, 3)
    k.pin(x1 + w1 + 2, by + 80, 4)
    k.pin(x1 - 18, pyb + 89, 5)

    // ---------------------------------------------------------------- decisões de UX (grade 2 × 3)
    const gy = 872, gx = k.M, cw = (k.W - 2 * k.M - 48) / 2, rh = 104
    k.text(gx, gy, 'DECISÕES DE UX', { f: FONT.pixel, s: 13, c: T.quest.gold, ls: 1 })
    const notes = [
      ['Número em blocos', 'Espaço a cada 4 dígitos e bandeira detectada sozinha. Nada de menu.'],
      ['Erro que ensina', 'Aparece ao sair do campo e diz como corrigir. Cor, ícone e texto juntos.'],
      ['Valor no botão', '"Pagar R$ 54,90": o jogador sabe o preço antes do último clique.'],
      ['Mapa da missão', 'Três fases à vista. Voltar para a sacola não apaga o que foi digitado.'],
      ['Confiança perto da ação', 'Cadeado e uma frase curta logo abaixo do botão, não no rodapé.'],
    ]
    notes.forEach(([t, d], j) => k.note(gx + (j % 2) * (cw + 48), gy + 40 + Math.floor(j / 2) * rh, cw, j + 1, t, d))

    // 6ª célula: estados do botão de pagar
    const ex = gx + cw + 48, ey = gy + 40 + 2 * rh - 6
    k.text(ex, ey + 8, 'ESTADOS DO BOTÃO', { f: FONT.pixel, s: 10, c: T.muted, ls: 0.5 })
    const bw3 = Math.floor((cw - 32) / 3)
    k.btn(ex, ey + 28, bw3, 'Pagar', { h: 40, s: 15 })
    k.btn(ex + bw3 + 16, ey + 28, bw3, 'Pagando', { h: 40, s: 15, kind: 'primary' })
    for (let i = 0; i < 3; i++) k.rect(ex + bw3 + 16 + bw3 - 30 + i * 7, ey + 50, 4, 4, '#ffffff', { op: 0.4 + i * 0.3 })
    k.btn(ex + 2 * (bw3 + 16), ey + 28, bw3, 'Pago', { h: 40, s: 15 })
    tick(k, ex + 2 * (bw3 + 16) + 18, ey + 42)
  },
  caption: `Daily UI 002 · Credit Card Checkout

Segunda missão: a tela de pagamento da Loja do Porto, a última fase antes do tesouro ir para o barco. Pagar é o momento em que a pessoa mais desconfia, então cada detalhe tem que tirar um susto.

1. Número em blocos: espaço a cada 4 dígitos e a bandeira aparece sozinha.
2. Erro que ensina: diz como corrigir, com cor, ícone e texto juntos.
3. Valor no botão: "Pagar R$ 54,90", sem surpresa no último clique.
4. Mapa da missão: as três fases à vista, e voltar não apaga nada.
5. Confiança perto da ação: o cadeado fica junto do botão, não escondido no rodapé.

Checkout bom é aquele em que a pessoa só pensa no que comprou.

Faltam 98. Próxima fase amanhã.

#dailyui #dailyui002 #uidesign #uxdesign #checkout`,
}
