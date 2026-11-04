'use strict'
// Daily UI 001 · Sign Up — cadastro de um app de RPG ("Crie seu personagem"), com as decisões de UX ao lado.
const { T, FONT } = require('../../brand/lib.js')

module.exports = {
  tema: 'Sign Up', accent: T.secondary,
  draw(k) {
    k.kick(k.M, 172, 'DESAFIO 001', T.secondary)
    k.title(k.M, 250, 'Sign Up', { s: 76 })
    k.para(k.M, 296, 'Cadastro de um app de RPG: criar a conta é criar o personagem.', { s: 22, maxw: 940 })

    // ---------------------------------------------------------------- tela
    const s = k.phone(k.M + 9, 350, 450, 850)
    const x = s.x, w = s.w
    let y = s.y + 20
    k.img('img/ship.png', x, y, { k: 2 })
    k.text(x + 92, y + 30, 'NOVO JOGO', { f: FONT.pixel, s: 11, c: T.secondary, ls: 1 })
    k.text(x + 92, y + 58, 'Passo 1 de 2', { f: FONT.copy, s: 14, c: T.muted })
    y += 108
    k.text(x, y, 'Crie seu personagem', { f: FONT.display, s: 32, w: 700, c: '#ffffff' })
    k.text(x, y + 32, 'Leva 30 segundos. Prometo.', { f: FONT.game, s: 24, c: T.soft })
    y += 74
    y = k.field(x, y, w, 'NOME DO PERSONAGEM', 'Otavio') + 24
    y = k.field(x, y, w, 'E-MAIL', 'otavio@proton.me', { state: 'focus' }) + 24
    const ey = y
    y = k.field(x, y, w, 'SENHA', '••••••••••', { pw: true, icon: 'ver' }) + 12
    // força da senha em barra de XP
    for (let i = 0; i < 4; i++) k.rect(x + i * ((w - 18) / 4 + 6), y, (w - 18) / 4, 8, i < 3 ? T.secondary : T.panel2)
    k.text(x, y + 30, 'Senha forte · nível 3 de 4', { f: FONT.copy, s: 14, c: T.secondary })
    y += 56
    // classe em chips
    k.text(x, y, 'CLASSE', { f: FONT.pixel, s: 10, c: T.muted, ls: 0.5 })
    const cls = [['Design', T.island.design], ['Motion', T.island.vfx], ['3D', T.island.d3], ['Web', T.island.web]]
    let cx = x, cy = y + 14
    cls.forEach(([t, c], j) => {
      const cw = Math.round((w - 3 * 10) / 4)
      const on = j === 0
      k.rect(cx, cy, cw, 44, on ? c : T.ink, { stroke: on ? c : T.line, sw: 2 })
      k.text(cx + cw / 2, cy + 28, t, { f: FONT.copy, s: 16, w: 600, c: on ? T.ink : T.soft, a: 'middle' })
      cx += cw + 10
    })
    y = cy + 70
    k.check(x, y, true, 'Aceito os termos e a política de privacidade')
    y += 44
    k.btn(x, y, w, 'Começar a jornada  ▶')
    k.text(x + w / 2, y + 88, 'Já tem conta?  Entrar', { f: FONT.copy, s: 16, w: 600, c: T.secondary, a: 'middle' })

    // marcadores na tela
    k.pin(s.x + s.w + 46, s.y + 241, 1)
    k.pin(s.x + s.w + 46, ey - 52, 2)
    k.pin(s.x + s.w + 46, ey + 82, 3)
    k.pin(s.x + s.w + 46, ey + 180, 4)
    k.pin(s.x + s.w + 46, y + 30, 5)

    // ---------------------------------------------------------------- decisões de UX
    const nx = 590, nw = k.W - k.M - nx
    k.text(nx, 380, 'DECISÕES DE UX', { f: FONT.pixel, s: 13, c: T.quest.gold, ls: 1 })
    let ny = 440
    const notes = [
      ['Rótulo sempre à vista', 'O nome do campo fica em cima, não dentro. Ao digitar, você não esquece o que estava preenchendo.'],
      ['Foco que se vê', 'Borda menta de 3 px e halo: dá para saber onde está mesmo navegando só pelo teclado.'],
      ['Senha com resposta', 'Em vez de uma lista de regras escondida, a força aparece na hora, numa barra de XP.'],
      ['Tocar, não digitar', 'A classe vem em quatro chips. Uma escolha, um toque, nada de menu suspenso.'],
      ['Um botão manda', 'Só uma ação primária na tela. "Entrar" fica como link, para quem já tem conta.'],
    ]
    notes.forEach(([t, d], j) => { ny = k.note(nx, ny, nw, j + 1, t, d) + 54 })
  },
  caption: `Daily UI 001 · Sign Up

Comecei hoje o desafio do Daily UI: 100 telas, uma por dia útil. E vou fazer tudo dentro do universo do meu portfólio, o Arquipélago.

Na primeira missão, o cadastro de um app de RPG, criar a conta é criar o personagem. As decisões que guiaram a tela:

1. Rótulo sempre à vista: o nome do campo fica em cima, não dentro dele.
2. Foco que se vê: borda menta de 3 px, para quem navega pelo teclado também.
3. Senha com resposta: a força aparece na hora, numa barra de XP.
4. Tocar, não digitar: a classe vem em chips, um toque e pronto.
5. Um botão manda: só uma ação primária na tela.

Cadastro bom é aquele que você nem percebe que preencheu.

Faltam 99. Bora?

#dailyui #dailyui001 #uidesign #uxdesign #signup`,
}
