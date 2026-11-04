'use strict'
// Pauta 2026-11-04 B · A Canva se reorganizou (1.271 pessoas, 22% da empresa) e o recado para quem desenha.
// Fontes: Canva, comunicado de Melanie Perkins (03/11/2026); The Information (jul/2026, previsão de crescimento e custo de IA), repercutido por Startup Daily e Forbes Australia.
const { T, FONT } = require('../../brand/lib.js')
const A = T.island.design

module.exports = {
  titulo: 'A Canva se reorganizou', accent: A, tema: 'Design · Mercado',
  fontes: ['https://www.canva.com/newsroom/news/canva-team-update/', 'https://www.forbes.com.au/news/innovation/canva-layoffs-impact-1200-employees/', 'https://www.startupdaily.net/?p=139035'],
  slides: [
    k => {
      k.kick(k.M, 230, 'DESIGN · MERCADO', A)
      k.title(k.M, 360, ['A Canva', 'se reorganizou.'], { s: 124, lh: 128 })
      k.para(k.M, 660, '1.271 pessoas afetadas, 22% da empresa. E o jeito como ela quer trabalhar agora diz muito sobre o nosso trabalho.', { s: 34, maxw: 900 })
      k.bubble(k.M, 1010, k.W - 2 * k.M, 'Arrasta: o fato, o outro lado e a minha leitura.', { s: 32, tail: false, who: 'GUIA' })
    },
    k => {
      k.kick(k.M, 190, 'O QUE ACONTECEU', A)
      k.stat(k.M, 340, '22%', 'da Canva foi afetada: 1.271 pessoas. A CEO, Melanie Perkins, anunciou em 3/11 e chamou de o momento mais difícil em 13 anos de empresa.')
      k.stat(k.M, 760, '6 meses', 'de salário, no mínimo, para quem sai. A pessoa fica com o MacBook e pode pedir US$ 10 mil para começar algo próprio.')
    },
    k => {
      k.kick(k.M, 190, 'O QUE MUDA LÁ DENTRO', A)
      const ty = k.title(k.M, 290, 'Três mudanças no jeito de trabalhar', { s: 60 })
      k.cards(ty + 60, [
        ['Um time só de produto', 'Produto, Growth e Plataforma viram uma organização só, com menos repasse de trabalho.'],
        ['Menos especialidade estreita', 'Funções mais amplas, donas do trabalho do começo ao fim. E menos camadas de gestão.'],
        ['Mais gente junta', 'Sydney vira a base dos times de produto, e as camadas de gestão diminuem.'],
      ], { h: 200, gap: 28 })
    },
    k => {
      k.kick(k.M, 190, 'O OUTRO LADO', A)
      k.title(k.M, 300, ['O que o comunicado', 'não diz.'], { s: 88 })
      k.cards(500, [
        ['A palavra IA não aparece', 'O motivo oficial: o crescimento desacelerou pela primeira vez em uma década.'],
        ['Mas a IA está na conta', 'Este ano, a previsão de crescimento caiu de 30% para cerca de 20%, com o custo de IA pesando na conta.'],
        ['Nem todo mundo sai', 'Parte das 1.271 pessoas muda de função ou de cidade. A Canva não disse quantas são demissões.'],
      ], { h: 186, gap: 24 })
    },
    k => {
      k.kick(k.M, 190, 'O QUE MUDA PARA NÓS', A)
      const ty = k.title(k.M, 290, 'O recado para quem desenha', { s: 60 })
      k.cards(ty + 60, [
        ['Perfil em T ganha força', 'Uma especialidade funda, mas sabendo andar pelo processo inteiro.'],
        ['Menos repasse, mais dono', 'Quem pega um problema e leva até o fim vale mais do que quem entrega só uma parte.'],
        ['Ferramenta não é carreira', 'Se até a Canva sente a pressão da IA, o valor fica no critério, não no software.'],
      ], { h: 200, gap: 28 })
    },
    k => {
      k.kick(k.M, 190, 'MINHA LEITURA', A)
      k.title(k.M, 300, ['Generalista não é', 'saber pouco de tudo.'], { s: 80 })
      k.para(k.M, 520, 'Meu portfólio é um mapa de RPG com ilhas de design, 3D, VFX e web. E este carrossel sai de um design system que eu fiz por código.', { s: 30, maxw: 920 })
      k.para(k.M, 700, 'O que eu leio na notícia: o mercado quer gente que liga as pontas, não só quem domina uma etapa. Sem esquecer que, por trás do número, são 1.271 pessoas.', { s: 30, maxw: 920 })
      k.img('img/isl_design.png', k.W - k.M - 181, 1190, { w: 181, h: 240, anchor: 'bottom', center: false })
    },
    k => {
      k.kick(k.M, 230, 'SUA VEZ', A)
      k.title(k.M, 370, ['Especialista ou', 'generalista: o que', 'pesa mais hoje?'], { s: 88 })
      k.para(k.M, 700, 'Me conta nos comentários como isso está no seu time.', { s: 32, maxw: 900 })
      k.fonte(1080, 'Canva, comunicado de Melanie Perkins (03/11/2026); The Information, via Startup Daily e Forbes Australia')
    },
  ],
  caption: `A Canva se reorganizou. E o recado vale para todo designer.

Na terça (3/11), a CEO Melanie Perkins anunciou mudanças que afetam 1.271 pessoas, 22% da empresa:

→ Demissões, trocas de função e mudanças para Sydney. A Canva não disse quantas são demissões.
→ Produto, Growth e Plataforma viram uma organização só.
→ Menos especialidades estreitas e menos camadas: funções mais amplas, donas do trabalho do começo ao fim.
→ Quem sai recebe no mínimo 6 meses de salário, fica com o MacBook e pode pedir US$ 10 mil para começar algo próprio.

O outro lado: o comunicado não fala em IA. O motivo oficial é o crescimento mais lento em uma década. Mas, este ano, a previsão de crescimento já tinha caído de 30% para cerca de 20%, com o custo de IA pesando na conta.

Minha leitura de designer: o mercado está pedindo gente que liga as pontas. Perfil em T, dono do problema, com critério que não depende de uma ferramenta. Sem esquecer que, por trás do número, são 1.271 pessoas.

E no seu time: especialista ou generalista, o que pesa mais hoje?

Fontes: comunicado de Melanie Perkins no newsroom da Canva (03/11/2026); The Information, via Startup Daily e Forbes Australia.

#design #canva #carreira #uxdesign #ia`,
}
