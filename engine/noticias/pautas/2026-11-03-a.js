'use strict'
// Pauta 2026-11-03 A · O Figma virou um canvas para agentes. Fonte: figma.com/release-notes (26/10 a 03/11/2026).
const { T, FONT } = require('../../brand/lib.js')
const A = T.island.design

module.exports = {
  titulo: 'O Figma virou um canvas para agentes de IA', accent: A, tema: 'Design + IA',
  fontes: ['https://www.figma.com/release-notes/'],
  slides: [
    k => {
      k.kick(k.M, 230, 'DESIGN + IA', A)
      k.title(k.M, 360, ['O Figma não', 'é mais só', 'onde a gente', 'desenha.'], { s: 108, lh: 112 })
      k.para(k.M, 860, 'Em uma semana, ele virou um lugar onde agentes de IA trabalham junto com você.', { s: 32, maxw: 900, c: T.soft })
      k.bubble(k.M, 1010, k.W - 2 * k.M, 'Arrasta que eu explico o que mudou.', { s: 34, tail: false, who: 'GUIA' })
    },
    k => {
      k.kick(k.M, 190, 'O QUE SAIU', A)
      const ty = k.title(k.M, 290, 'Quatro lançamentos em nove dias', { s: 60 })
      k.cards(ty + 56, [
        ['Modelos de imagem e vídeo no MCP', 'Os modelos do Figma Weave agora podem ser usados de dentro do seu agente externo.'],
        ['Conectores no agente do Figma', 'Google Drive e outros conectores entram no agente e no Make, em todos os planos.'],
        ['Shaders para todo mundo', 'Shaders saem do beta e passam a funcionar dentro das code layers.'],
        ['GitHub direto no arquivo', 'Repositórios conectados agora são clonados no Figma por padrão.'],
      ], { h: 156, gap: 22, labels: ['26/10', '30/10', '02/11', '03/11'] })
    },
    k => {
      k.kick(k.M, 190, 'O PADRÃO', A)
      k.title(k.M, 300, ['Design, código e', 'agente no mesmo', 'arquivo.'], { s: 84 })
      k.para(k.M, 600, 'Com "build this with code", o desenho vira uma code layer: um pedaço de interface que funciona de verdade, ali no canvas.', { s: 30, maxw: 920 })
      k.para(k.M, 760, 'E o agente não fica numa janela separada. Ele lê seus arquivos, puxa dados do Drive e mexe no canvas com você.', { s: 30, maxw: 920 })
      k.bubble(k.M, 980, k.W - 2 * k.M, 'O arquivo deixou de ser um desenho da tela. Virou a tela.', { s: 34, tail: false, who: 'RESUMO' })
    },
    k => {
      k.kick(k.M, 190, 'O QUE MUDA PARA NÓS', A)
      const ty = k.title(k.M, 290, 'Na prática, para quem desenha', { s: 60 })
      k.cards(ty + 60, [
        ['Protótipo vira produto mais cedo', 'Dá para testar interação real sem esperar o time de código.'],
        ['O handoff encurta', 'Menos "isso aqui é 16 ou 18 px?". O código já nasce do arquivo.'],
        ['Organização vira superpoder', 'Agente trabalha melhor em arquivo com componentes, tokens e nomes claros.'],
      ], { h: 200, gap: 28 })
    },
    k => {
      k.kick(k.M, 190, 'O QUE NÃO MUDA', A)
      k.title(k.M, 320, ['O agente acelera.', 'Quem decide', 'ainda é você.'], { s: 92 })
      k.para(k.M, 680, 'Hierarquia, ritmo, o que fica e o que sai da tela: isso continua sendo julgamento de design. A própria Figma reconhece que a IA ainda tropeça quando falta contexto de design.', { s: 30, maxw: 920 })
    },
    k => {
      k.kick(k.M, 190, 'MINHA LEITURA', A)
      k.title(k.M, 290, ['Eu já trabalho', 'assim.'], { s: 96 })
      k.para(k.M, 520, 'Este carrossel saiu do meu design system por código, com um agente montando os slides no meu arquivo.', { s: 30, maxw: 920 })
      k.para(k.M, 660, 'A parte boa: eu gasto o tempo decidindo, não arrastando caixinha. A parte que exige cuidado: um sistema bem organizado. Sem isso, o agente só faz bagunça mais rápido.', { s: 30, maxw: 920 })
      k.img('img/isl_design.png', k.W - k.M - 181, 1190, { w: 181, h: 240, anchor: 'bottom', center: false })
    },
    k => {
      k.kick(k.M, 230, 'SUA VEZ', A)
      k.title(k.M, 370, ['Você deixaria', 'um agente mexer', 'no seu arquivo?'], { s: 96 })
      k.para(k.M, 720, 'Me conta nos comentários: já usa, quer testar ou nem pensar?', { s: 32, maxw: 900 })
      k.fonte(1120, 'Figma, notas de lançamento de 26/10 a 03/11/2026 (figma.com/release-notes)')
    },
  ],
  caption: `O Figma não é mais só onde a gente desenha.

Entre 26/10 e 03/11, a Figma soltou uma sequência de lançamentos que aponta para o mesmo lugar: design, código e agentes de IA no mesmo arquivo.

→ 26/10: os modelos de imagem e vídeo do Figma Weave passaram a funcionar de dentro do seu agente, pelo MCP.
→ 30/10: o agente do Figma ganhou conectores, como o Google Drive, em todos os planos.
→ 02/11: shaders saíram do beta e passaram a funcionar dentro das code layers.
→ 03/11: repositórios do GitHub conectados agora são clonados no Figma por padrão.

Para quem desenha, isso muda o ritmo: protótipo vira produto mais cedo e o handoff encurta. O que não muda é quem decide hierarquia, ritmo e o que fica na tela.

Arrasta o carrossel para a minha leitura completa. E me conta: você deixaria um agente mexer no seu arquivo?

Fonte: notas de lançamento da Figma (figma.com/release-notes).

#figma #design #ia #uxdesign #designsystem`,
}
