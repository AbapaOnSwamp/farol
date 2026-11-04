'use strict'
// Os 30 posts, em ordem: volta → quem sou → começo → música e marcas → universo Swamp → 3D → ofício → portfólio novo → próxima missão.
// Fatos só do site (versao-final/js/data.js e CLAUDE.md). Sem datas nos posts.
const { T, FONT } = require('../brand/kit.js')
const I = T.island
const P = (pasta, n = 1) => `img/projetos/${pasta}/${String(n).padStart(2, '0')}.webp`
const TAGS = '\n\n'

module.exports = [
  // ------------------------------------------------------------------ 01 · volta
  {
    slug: 'estou-de-volta', name: 'Estou de volta', kicker: 'RESPAWN', accent: T.secondary,
    draw(k) {
      // tela de "continuar?"
      k.text(k.W / 2, 250, 'CONTINUAR?', { f: FONT.pixel, s: 40, c: T.quest.gold, a: 'middle', ls: 4 })
      k.text(k.W / 2 - 120, 320, '▶ SIM', { f: FONT.pixel, s: 22, c: T.secondary, a: 'middle' })
      k.text(k.W / 2 + 120, 320, 'NÃO', { f: FONT.pixel, s: 22, c: T.muted, a: 'middle', op: 0.6 })
      k.title(k.W / 2, 560, 'Voltei.', { s: 200, a: 'middle', sc: T.primary })
      k.para(k.W / 2, 660, 'Fiquei um tempo longe daqui, mas o save estava guardado.', { s: 32, a: 'middle', c: T.soft })
      // ilha e barquinho
      k.img('img/isl_throne.png', k.W / 2 - 181 + 60, 1210, { k: 1, anchor: 'bottom', center: false })
      k.img('img/ship.png', 150, 1010, { k: 4 })
      k.img('img/cloud_4.png', 760, 720, { k: 2 })
      k.img('img/cloud_1.png', 90, 760, { k: 2 })
      k.img('img/bird.png', 820, 880, { k: 4 })
      k.img('img/bird.png', 880, 850, { k: 3 })
    },
    caption: `Voltei.

Passei um tempo longe do LinkedIn, mas não parei de criar. Nesse período fiz arte para eventos, identidades visuais, modelos 3D, motion e um portfólio novo em forma de mapa de RPG.

A partir de agora quero usar este espaço para mostrar esse trabalho de perto: os projetos, os bastidores e o que fui aprendendo no caminho.

Se você chegou agora: prazer, sou o Otavio, designer de Itabira (MG).

Bora pra próxima fase?${TAGS}#design #designgrafico #motiondesign #3d #portfolio`,
  },

  // ------------------------------------------------------------------ 02 · ficha
  {
    slug: 'ficha-do-personagem', name: 'Ficha do personagem', kicker: 'APRESENTAÇÃO', accent: I.apresentacao,
    draw(k) {
      const x = k.M + 9, y = 170, w = k.W - 2 * k.M - 18, h = 980
      k.card(x, y, w, h, { fill: T.panel })
      k.rect(x, y, w, 70, T.primary)
      k.text(x + 30, y + 46, 'FICHA DO PERSONAGEM', { f: FONT.pixel, s: 18, c: '#ffffff', ls: 1 })
      k.rect(x + w - 170, y + 16, 140, 38, T.quest.gold)
      k.text(x + w - 100, y + 44, 'NV. 5', { f: FONT.pixel, s: 18, c: T.ink, a: 'middle' })
      // retrato
      k.rect(x + 34, y + 110, 232, 232, T.quest.gold)
      k.rect(x + 42, y + 118, 216, 216, T.sky)
      k.img('img/retrato.png', x + 62, y + 160, { k: 4 })
      k.title(x + 300, y + 200, 'Otavio Guerra', { s: 60 })
      k.text(x + 300, y + 248, 'CRIADOR DO ARQUIPÉLAGO', { f: FONT.pixel, s: 14, c: T.quest.gold, ls: 1 })
      k.para(x + 300, y + 300, 'Da pista para o cartaz, a estampa e a tela.', { s: 26, c: T.secondary, w: 600, maxw: 560 })
      // barras
      const by = y + 420
      k.bar(x + 120, by, w - 170, 0.96, '#ff6f61', '#d94a40', 'DG')
      k.bar(x + 120, by + 52, w - 170, 0.84, T.island.d3, '#1a90d0', '3D')
      k.bar(x + 120, by + 104, w - 170, 0.8, T.island.vfx, '#c22a8e', 'MO')
      k.bar(x + 120, by + 156, w - 170, 0.72, T.secondary, T.secondaryLo, 'WEB')
      // base e classe
      const cy = by + 230
      for (const [j, [t, v]] of [['BASE', 'Itabira · MG'], ['CLASSE', 'Designer Digital · Motion · 3D']].entries()) {
        const cx = x + 34 + j * ((w - 88) / 2 + 20), cw = (w - 88) / 2
        k.rect(cx, cy, cw, 110, T.deep, { stroke: T.line, sw: 2 })
        k.text(cx + 24, cy + 38, t, { f: FONT.pixel, s: 13, c: T.secondary, ls: 1 })
        k.text(cx + 24, cy + 82, v, { f: FONT.copy, s: 26, w: 600, c: '#ffffff' })
      }
      k.rect(x + 34, cy + 136, w - 68, 64, T.secondaryInk, { stroke: T.secondary, sw: 2 })
      k.status(x + 58, cy + 178, 'MISSÃO: aberto a freelas e vagas fixas')
      k.chips(x + 34, cy + 232, ['Illustrator', 'Photoshop', 'Figma', 'After Effects', 'Blender'], { white: true })
    },
    caption: `Ficha do personagem, para quem está chegando agora.

Nome: Otavio Guerra
Base: Itabira, Minas Gerais
Classe: designer digital, motion designer e artista 3D

Meu trabalho se divide em três frentes:
→ Design visual: identidade, tipografia, UI/UX e design systems
→ Motion, 3D e technical art: Blender, Cinema 4D, VFX, GLSL e WebGL
→ Interface e RPG: pixel art, tilemap, game UI e HUDs

O que me prende é construir uma linguagem visual que se sustente em qualquer formato: uma identidade que vira catálogo, modelo 3D, teaser e interface sem perder a cara.

Missão atual: aberto a freelas e vagas fixas.${TAGS}#designer #motiondesign #artista3d #uiux #freelancer`,
  },

  // ------------------------------------------------------------------ 03 · começo
  {
    slug: 'nivel-1', name: 'Todo personagem começa no nível 1', kicker: 'ORIGEM', accent: I.apresentacao,
    draw(k) {
      k.kick(k.M, 210, 'ORIGEM', I.apresentacao)
      k.title(k.M, 330, ['Todo personagem', 'começa no nível 1.'], { s: 84 })
      k.para(k.M, 500, 'Meu portfólio começou no Behance, com poucas peças. Hoje ele virou um arquipélago inteiro.', { s: 30, maxw: 880 })
      // ilhotas crescendo
      const base = 1150
      const steps = [['islet_3.png', 3, 'NV.1'], ['islet_1.png', 4, 'NV.2'], ['islet_0.png', 5, 'NV.3']]
      let x = k.M + 10
      for (const [f, s, l] of steps) {
        const r = k.img('img/' + f, x, base, { k: s, anchor: 'bottom', center: false })
        k.text(x + r.w / 2, base + 44, l, { f: FONT.pixel, s: 14, c: T.muted, a: 'middle' })
        x += r.w + 60
      }
      const r = k.img('img/isl_hero.png', k.W - k.M - 357, base + 10, { k: 1, anchor: 'bottom', center: false })
      k.text(r.x + r.w / 2, base + 44, 'HOJE', { f: FONT.pixel, s: 14, c: T.secondary, a: 'middle' })
      k.line(k.M, base + 4, k.W - k.M, base + 4, T.line, 2, '6 10')
    },
    caption: `Todo personagem começa no nível 1.

O meu primeiro portfólio nasceu no Behance, com poucas peças e muita vontade de mostrar o que eu conseguia fazer.

De lá pra cá vieram artes de evento, identidades de marca, modelos 3D, um teaser animado e um estudo de UI/UX. Cada projeto ensinou uma coisa que o anterior não tinha ensinado.

Se você está começando agora: publique mesmo assim. O nível 1 só fica para trás quando você joga.

O Behance continua lá: behance.net/otavio_og${TAGS}#design #portfolio #behance #carreira #designgrafico`,
  },

  // ------------------------------------------------------------------ 04 · música
  {
    slug: 'da-pista-para-o-cartaz', name: 'Da pista para o cartaz', kicker: 'DESIGN GRÁFICO', accent: I.design,
    draw(k) {
      k.kick(k.M, 210, 'O ATELIÊ DAS CORES', I.design)
      k.title(k.M, 330, ['Da pista', 'para o cartaz.'], { s: 104 })
      k.para(k.M, 520, 'Muito do que faço nasce perto da música: festas, eventos e a cena que vive em volta deles.', { s: 30, maxw: 900 })
      const y = 660, w = 440, h = 440
      k.card(k.M + 9, y, w, h, { fill: T.deep, accent: I.design })
      k.img(P('sonoora-9-anos'), k.M + 9, y + 8, { w, h: h - 8 })
      k.card(k.W - k.M - 9 - w, y, w, h, { fill: T.deep, accent: I.design })
      k.img(P('aruna-pocket', 2), k.W - k.M - 9 - w, y + 8, { w, h: h - 8 })
      k.plaque(k.M + 9, y + h + 34, 'SONOORA 9 ANOS', I.design)
      k.plaque(k.W - k.M - 9 - w, y + h + 34, 'ARUNA POCKET', I.design)
    },
    caption: `Da pista para o cartaz.

Muito do que faço nasce perto da música. Foi desse meio que vieram duas das peças de que mais gosto: a arte do Sonoora 9 Anos e a do Aruna Pocket Edition.

Arte de evento tem uma missão difícil: antes de qualquer informação, ela precisa passar a sensação da festa. Quem bate o olho tem que sentir o som.

Nos próximos posts eu abro cada uma delas.${TAGS}#designgrafico #artedeevento #musica #flyer #cartaz`,
  },

  // ------------------------------------------------------------------ 05 · Sonoora
  {
    slug: 'sonoora-9-anos', name: 'Sonoora 9 Anos', kicker: 'MISSÃO · DESIGN GRÁFICO', accent: I.design, layout: 'project',
    img: P('sonoora-9-anos'), imgH: 600, title: 'Sonoora 9 Anos', desc: 'Arte do evento de aniversário do Sonoora.',
    tags: ['Arte de evento'], tools: ['Illustrator', 'Photoshop'], fala: 'Aniversário pede uma peça que pareça festa antes de qualquer texto.',
    caption: `Missão: Sonoora 9 Anos.

Fiz a arte do evento de aniversário do Sonoora. Nove anos de festa pedem uma peça que pareça celebração antes mesmo de alguém ler o nome.

O centro da composição é a figura, e a tipografia entra para assinar. A arte precisava funcionar como cartaz, como post e como estampa, sem perder força em nenhum deles.

O projeto completo está no Behance: behance.net/otavio_og${TAGS}#designgrafico #artedeevento #musicaeletronica #photoshop #illustrator`,
  },

  // ------------------------------------------------------------------ 06 · Aruna
  {
    slug: 'aruna-pocket-edition', name: 'Aruna Pocket Edition', kicker: 'MISSÃO · DESIGN GRÁFICO', accent: I.design, layout: 'project',
    img: P('aruna-pocket'), title: 'Aruna Pocket Edition', desc: 'Arte do evento Aruna Pocket Edition.',
    tags: ['Arte de evento'], tools: ['Illustrator', 'Photoshop'], fala: 'Edição de bolso, energia inteira.',
    caption: `Missão: Aruna Pocket Edition.

Mais uma arte que nasceu da cena musical. A Pocket Edition é uma versão menor do evento, e a arte tinha que deixar isso claro sem parecer uma versão menor de nada.

Gosto desse tipo de desafio: a mesma marca, uma ocasião diferente, e a peça precisa se encaixar nas duas coisas.

Projeto completo no Behance: behance.net/otavio_og${TAGS}#designgrafico #artedeevento #flyer #musica #design`,
  },

  // ------------------------------------------------------------------ 07 · dicas de evento
  {
    slug: 'arte-de-evento-3-lugares', name: 'Arte de evento em 3 lugares', kicker: 'DICA DE ATELIÊ', accent: I.design, layout: 'tips',
    label: 'DICA DE ATELIÊ', title: 'Arte de evento precisa funcionar em três lugares.', ts: 64,
    items: [
      ['No cartaz', 'Lê de longe. Um elemento manda e o nome do evento aparece em dois segundos.'],
      ['Na tela', 'Story e feed cortam as bordas. O que importa fica no centro e o texto não encosta na margem.'],
      ['Na estampa', 'Menos detalhe e mais contraste. A peça vira camiseta e precisa aguentar ser impressa.'],
    ],
    caption: `Arte de evento não vive num lugar só.

A mesma peça vai para o cartaz, para o story, para o feed e, muitas vezes, para a camiseta. Por isso eu testo em três lugares antes de dar como pronta:

1. No cartaz: lê de longe? Um elemento manda e o nome aparece em dois segundos.
2. Na tela: o essencial está no centro? Story e feed cortam as bordas sem pedir licença.
3. Na estampa: aguenta ser impressa? Menos detalhe e mais contraste.

Se passa nos três, está pronta. Se falha em um, volta pra mesa.

Qual desses você costuma esquecer?${TAGS}#designgrafico #dicasdedesign #artedeevento #socialmedia #estampa`,
  },

  // ------------------------------------------------------------------ 08 · NugRun
  {
    slug: 'nugrun', name: 'NugRun Clothing Store', kicker: 'MISSÃO · IDENTIDADE VISUAL', accent: I.design, layout: 'project',
    img: P('nugrun'), imgH: 600, title: 'NugRun Clothing Store', desc: 'Identidade visual da loja de roupas NugRun.',
    tags: ['Identidade visual', 'Moda'], tools: ['Illustrator', 'Photoshop'], fala: 'Marca de roupa precisa caber na etiqueta e na fachada.',
    caption: `Missão: NugRun Clothing Store.

Fiz a identidade visual da NugRun, uma loja de roupas.

Marca de moda tem um teste a mais: ela aparece na etiqueta, na sacola, no post e na fachada. O símbolo precisa ser simples para caber pequeno e ter personalidade para aguentar grande.

Trabalho muito com marcas de roupa, e é sempre esse equilíbrio que eu procuro.

Projeto completo no Behance: behance.net/otavio_og${TAGS}#identidadevisual #branding #moda #streetwear #designgrafico`,
  },

  // ------------------------------------------------------------------ 09 · Zé do Bacco
  {
    slug: 'ze-do-bacco', name: 'Zé do Bacco', kicker: 'MISSÃO · IDENTIDADE VISUAL', accent: I.design, layout: 'project',
    img: P('ze-do-bacco'), imgH: 600, title: 'Zé do Bacco', desc: 'Identidade visual da marca Zé do Bacco.',
    tags: ['Identidade visual'], tools: ['Illustrator', 'Photoshop'], fala: 'Nome com personalidade pede uma marca à altura.',
    caption: `Missão: Zé do Bacco.

Criei a identidade visual da marca Zé do Bacco.

Quando o nome já tem personalidade, o trabalho do design é não atrapalhar: deixar o nome brilhar e dar a ele um jeito de aparecer que seja reconhecível em qualquer aplicação.

Identidade boa é aquela que você reconhece mesmo sem ler.

Projeto completo no Behance: behance.net/otavio_og${TAGS}#identidadevisual #branding #logo #designgrafico #marca`,
  },

  // ------------------------------------------------------------------ 10 · identidade ≠ logo
  {
    slug: 'identidade-nao-e-logo', name: 'Identidade não é só logo', kicker: 'DICA DE ATELIÊ', accent: I.design, layout: 'tips',
    label: 'DICA DE ATELIÊ', title: 'Identidade visual não é só logo.', ts: 72,
    items: [
      ['O logo assina', 'É a parte mais lembrada, mas sozinho ele não segura uma marca.'],
      ['Cor e tipografia falam', 'São elas que fazem você reconhecer a marca mesmo quando o logo não aparece.'],
      ['As aplicações provam', 'Catálogo, estampa, post e site mostram se o sistema funciona de verdade.'],
    ],
    caption: `Identidade visual não é só logo.

O logo é a assinatura, a parte de que todo mundo lembra. Mas uma marca se sustenta em três camadas:

→ O logo assina.
→ Cor e tipografia falam: é por elas que você reconhece a marca mesmo quando o logo não aparece.
→ As aplicações provam: catálogo, estampa, post e site mostram se o sistema funciona de verdade.

Quando alguém me pede "só um logo", eu sempre pergunto onde ele vai morar. A resposta muda o projeto inteiro.${TAGS}#identidadevisual #branding #designgrafico #logo #designdemarca`,
  },

  // ------------------------------------------------------------------ 11 · tipografia
  {
    slug: 'fonte-e-voz', name: 'Escolher uma fonte é escolher a voz', kicker: 'TIPOGRAFIA', accent: T.primary,
    draw(k) {
      k.kick(k.M, 210, 'TIPOGRAFIA', T.primaryHi)
      k.title(k.M, 330, ['Escolher uma fonte é', 'escolher a voz.'], { s: 76 })
      const rows = [
        [FONT.display, 'Títulos que falam alto', 'Space Grotesk', 52, 700],
        [FONT.copy, 'Texto que deixa ler em paz', 'IBM Plex Sans', 40, 400],
        [FONT.pixel, 'RÓTULOS DE JOGO', 'Press Start 2P', 30, 400],
        [FONT.game, 'Falas de personagem, prometo.', 'VT323', 56, 400],
        [FONT.serif, 'SWAMP CREATIONS', 'DM Serif Display', 54, 400],
      ]
      let y = 570
      for (const [f, s, n, sz, w] of rows) {
        k.rect(k.M, y - 70, k.W - 2 * k.M, 2, T.line)
        k.text(k.M, y, s, { f, s: sz, w, c: '#ffffff' })
        k.text(k.W - k.M, y - 42, n.toUpperCase(), { f: FONT.pixel, s: 11, c: T.secondary, a: 'end' })
        y += 128
      }
    },
    caption: `Escolher uma fonte é escolher a voz.

No meu portfólio, cada família tipográfica tem um trabalho só:

→ Space Grotesk: títulos que falam alto.
→ IBM Plex Sans: o texto corrido, que precisa deixar ler em paz.
→ Press Start 2P: os rótulos de jogo, sempre curtos.
→ VT323: as falas dos personagens.
→ DM Serif Display: a voz da Swamp Creations, uma marca com sotaque próprio.

Cinco fontes podem parecer muito. Funciona porque nenhuma invade o papel da outra. Quando cada uma tem uma função clara, a página inteira fica mais fácil de ler.${TAGS}#tipografia #typography #designgrafico #designsystem #webdesign`,
  },

  // ------------------------------------------------------------------ 12 · universo Swamp
  {
    slug: 'universo-swamp', name: 'Universo Swamp Creations', kicker: 'UNIVERSO DE MARCA', accent: T.swamp.purple, theme: 'swamp',
    draw(k) {
      k.text(k.M, 210, 'UNIVERSO DE MARCA', { f: FONT.pixel, s: 15, c: T.swamp.lilac, ls: 2 })
      k.title(k.M, 330, ['SWAMP', 'CREATIONS'], { f: FONT.serif, s: 110, w: 400, sc: '#000000', lh: 112 })
      k.para(k.M, 530, 'Catálogo de roupas, embalagem em 3D, teaser animado e o estudo de UI/UX da loja: uma marca inteira, do papel à tela.', { s: 28, maxw: 900, c: T.swamp.chrome })
      const cs = [['CAP. 1', 'Catálogo', P('swamp-catalogo', 2)], ['CAP. 2', 'Produto 3D', P('swamp-blister', 2)], ['CAP. 3', 'Teaser', P('swamp-teaser', 2)], ['CAP. 4', 'UI/UX', P('swamp-uiux', 3)]]
      const gw = (k.W - 2 * k.M - 40) / 2, gh = 270
      cs.forEach(([c, t, f], j) => {
        const x = k.M + (j % 2) * (gw + 40), y = 650 + Math.floor(j / 2) * (gh + 30)
        k.swampCard(x, y, gw, gh)
        k.img(f, x + 10, y + 10, { w: gw - 20, h: gh - 66 })
        k.text(x + 18, y + gh - 26, c, { f: FONT.pixel, s: 11, c: T.swamp.lilac })
        k.text(x + gw - 18, y + gh - 22, t, { f: FONT.serif, s: 30, c: '#ffffff', a: 'end' })
      })
    },
    caption: `Swamp Creations: uma marca inteira, do papel à tela.

Esse é o projeto em que mais aprendi sobre consistência. A Swamp é uma marca de roupas, e eu trabalhei nela em quatro frentes:

Cap. 1: o catálogo de roupas
Cap. 2: a embalagem blister, modelada em 3D
Cap. 3: o teaser animado
Cap. 4: o estudo de UI/UX do site e do app

Quatro formatos, quatro ferramentas diferentes, uma cara só.

Nos próximos posts eu abro cada capítulo.${TAGS}#branding #identidadevisual #moda #3d #uiux`,
  },

  // ------------------------------------------------------------------ 13–16 · capítulos Swamp
  {
    slug: 'swamp-catalogo', name: 'Swamp · Catálogo', kicker: 'SWAMP · CAP. 1', accent: T.swamp.purple, theme: 'swamp', layout: 'project',
    img: P('swamp-catalogo'), imgH: 600, title: 'Catálogo PT. 1', desc: 'Catálogo de roupas da coleção Swamp.',
    tags: ['Catálogo', 'Moda'], tools: ['Photoshop', 'InDesign'], fala: 'Cada página é uma vitrine. A roupa é a protagonista.', who: 'CAP. 1',
    caption: `Swamp · Capítulo 1: o catálogo.

O catálogo da coleção Swamp foi onde a marca ganhou ritmo de página: grid, respiro e tipografia para deixar a roupa ser a protagonista.

Em catálogo de moda, o design aparece menos do que parece. O trabalho é organizar para que cada peça tenha seu momento, e o leitor nunca se perca entre uma página e outra.

Projeto completo no Behance: behance.net/otavio_og${TAGS}#catalogo #moda #editorial #designgrafico #indesign`,
  },
  {
    slug: 'swamp-blister', name: 'Swamp · Blister 3D', kicker: 'SWAMP · CAP. 2', accent: T.swamp.purple, theme: 'swamp', layout: 'project',
    img: P('swamp-blister'), imgH: 600, title: 'Swamp Blister', desc: 'Embalagem blister da Swamp, modelada e renderizada em 3D.',
    tags: ['Produto 3D', 'Embalagem'], tools: ['Blender'], fala: 'Uma embalagem que ainda não existe já pode estar na vitrine.', who: 'CAP. 2',
    caption: `Swamp · Capítulo 2: a embalagem em 3D.

Modelei e renderizei em 3D uma embalagem blister para a Swamp, aquela de plástico transparente com cartela atrás.

O 3D resolve um problema prático: dá para mostrar, testar e apresentar uma embalagem antes de ela existir. Luz, material e ângulo ficam sob controle, e a marca já ganha uma peça de vitrine.

Projeto completo no Behance: behance.net/otavio_og${TAGS}#3d #blender #embalagem #packaging #render`,
  },
  {
    slug: 'swamp-teaser', name: 'Swamp · Teaser', kicker: 'SWAMP · CAP. 3', accent: T.swamp.purple, theme: 'swamp', layout: 'project',
    img: P('swamp-teaser'), title: 'Teaser', desc: 'Vídeo teaser da marca, com modelos 3D, tipografia e ritmo.',
    tags: ['Motion', '3D'], tools: ['After Effects', 'Premiere Pro', 'Photoshop'], fala: 'Teaser bom não conta tudo. Faz querer ver o resto.', who: 'CAP. 3',
    caption: `Swamp · Capítulo 3: o teaser.

Aqui o universo da marca ganhou movimento. O teaser junta os modelos 3D, a tipografia da Swamp e o ritmo da edição.

Teaser bom não conta tudo: ele mostra o suficiente para dar vontade de ver o resto. Por isso o corte é tão importante quanto a imagem.

Estudo de caso completo no Behance: behance.net/otavio_og${TAGS}#motiondesign #aftereffects #3d #teaser #videomarketing`,
  },
  {
    slug: 'swamp-uiux', name: 'Swamp · UI/UX', kicker: 'SWAMP · CAP. 4', accent: T.swamp.purple, theme: 'swamp', layout: 'project',
    img: P('swamp-uiux', 3), imgH: 600, title: 'UI/UX', desc: 'Estudo de UI/UX do site e do app da marca de roupas Swamp Creations.',
    tags: ['UI/UX', 'E-commerce'], tools: ['Figma', 'Photoshop'], fala: 'A loja tinha que ter a mesma cara do catálogo.', who: 'CAP. 4',
    caption: `Swamp · Capítulo 4: o site e o app.

O último capítulo foi levar a marca para a tela: um estudo de UI/UX do site e do app da loja.

Comecei pela pesquisa e pelo fluxo de navegação, passei pelos wireframes e cheguei no layout final. A regra era simples: quem conhece o catálogo tem que reconhecer a loja de primeira.

Ferramentas do projeto: Photoshop, Illustrator, After Effects, Blender e Figma.

Estudo de caso completo no Behance: behance.net/otavio_og${TAGS}#uiux #uidesign #ecommerce #figma #ux`,
  },

  // ------------------------------------------------------------------ 17 · lição de consistência
  {
    slug: 'licao-consistencia', name: 'O que a Swamp me ensinou', kicker: 'DIÁRIO DE BORDO', accent: T.swamp.purple, layout: 'tips',
    label: 'DIÁRIO DE BORDO', title: 'O que a Swamp me ensinou sobre consistência.', ts: 62,
    items: [
      ['Universo antes da peça', 'Defina cor, tipo e atitude primeiro. Depois cada peça só obedece.'],
      ['Cada formato é um capítulo', 'Catálogo, 3D, vídeo e site contam partes diferentes da mesma história.'],
      ['O formato muda, a cara não', 'Se precisar escolher, mude a técnica e preserve a marca.'],
    ],
    caption: `O que a Swamp Creations me ensinou sobre consistência.

Trabalhar a mesma marca em catálogo, 3D, vídeo e site deixou três lições:

1. Universo antes da peça. Quando cor, tipografia e atitude estão definidas, cada peça nova só precisa obedecer.
2. Cada formato é um capítulo. O catálogo não precisa fazer o trabalho do teaser. Cada um conta uma parte da história.
3. O formato muda, a cara não. Se precisar escolher, mude a técnica e preserve a marca.

Consistência não é repetir a mesma imagem em todo lugar. É ser reconhecível em qualquer lugar.${TAGS}#branding #consistencia #designdemarca #designgrafico #criatividade`,
  },

  // ------------------------------------------------------------------ 18–20 · 3D
  {
    slug: 'mushroom-world', name: 'Mushroom World', kicker: 'MISSÃO · 3D', accent: I.d3, layout: 'project',
    img: P('mushroom-world'), title: 'Mushroom World', desc: 'Estudo de cenário 3D: um mundo inteiro de cogumelos.',
    tags: ['Cenário', 'Estudo'], tools: ['Blender'], fala: 'Gosto de objetos com cara de desenho animado.',
    caption: `Missão: Mushroom World.

Um estudo de cenário 3D: um mundo inteiro de cogumelos.

Gosto de 3D com cara de desenho animado: formas redondas, cores fortes e uma luz que parece de história infantil. Cenário é onde dá para treinar tudo de uma vez: modelagem, materiais, iluminação e composição.

Estudo completo no Behance: behance.net/otavio_og${TAGS}#3d #blender #cenario3d #render #stylized`,
  },
  {
    slug: 'cartoon-donut', name: 'Cartoon Donut', kicker: 'MISSÃO · 3D', accent: I.d3, layout: 'project',
    img: P('cartoon-donut', 3), imgH: 460, title: 'Cartoon Donut', desc: 'Estudo de modelagem e materiais em estilo cartoon.',
    tags: ['Estudo', 'Materiais'], tools: ['Blender'], fala: 'Começar pela rosquinha é quase um rito de passagem.',
    caption: `Missão: Cartoon Donut.

Quem estuda Blender sabe: a rosquinha é quase um rito de passagem. Eu quis levar o exercício para o meu estilo, com materiais de desenho animado.

O que parece simples esconde muita coisa: a cobertura que escorre, o brilho do açúcar, a sombra que deixa tudo fofo. Estudos pequenos assim são onde eu testo materiais antes de usar num projeto de verdade.

Estudo completo no Behance: behance.net/otavio_og${TAGS}#blender #3d #blenderdonut #materiais #stylized`,
  },
  {
    slug: 'logos-3d', name: 'Logos em 3D', kicker: 'MISSÃO · 3D', accent: I.d3,
    draw(k) {
      k.kick(k.M, 210, 'O OBSERVATÓRIO DE CRISTAL', I.d3)
      k.title(k.M, 330, ['Logos que saltam', 'da tela.'], { s: 88 })
      const w = k.W - 2 * k.M - 18, h = 290
      const items = [['mud-crawlers', 'Mud Crawlers'], ['powerchord', 'Powerchord']]
      items.forEach(([f, t], j) => {
        const y = 470 + j * (h + 90)
        k.card(k.M + 9, y, w, h, { fill: T.deep, accent: I.d3 })
        k.img(P(f), k.M + 9, y + 8, { w, h: h - 8 })
        k.plaque(k.M + 9, y + h + 20, t.toUpperCase() + ' · LOGO 3D', I.d3)
      })
    },
    caption: `Logos que saltam da tela.

Fiz renders 3D dos logos da Mud Crawlers e da Powerchord.

Levar um logo para o 3D é dar peso a ele: luz, material e volume fazem a marca parecer um objeto que você poderia pegar. É ótimo para abertura de vídeo, capa de rede social e peças de lançamento.

O cuidado é não perder a leitura. O logo em 3D ainda tem que ser o mesmo logo.

Os dois estão no Behance: behance.net/otavio_og${TAGS}#3d #logo3d #blender #branding #motiondesign`,
  },

  // ------------------------------------------------------------------ 21 · por que 3D
  {
    slug: 'por-que-3d', name: 'Por que aprender 3D', kicker: 'DICA DE OBSERVATÓRIO', accent: I.d3, layout: 'tips',
    label: 'DICA DE OBSERVATÓRIO', title: 'Por que um designer digital deveria aprender 3D.', ts: 62,
    items: [
      ['Volume vende a ideia', 'Um logo ou produto em 3D mostra o que a imagem plana só sugere.'],
      ['Você controla a luz', 'Material, ângulo e iluminação deixam de depender de foto ou banco de imagem.'],
      ['Um modelo, várias peças', 'O mesmo arquivo vira render, mockup, capa e cena de teaser.'],
    ],
    caption: `Por que um designer digital deveria aprender 3D?

Comecei no 2D e o 3D entrou aos poucos. Hoje eu não abro mão dele por três motivos:

1. Volume vende a ideia. Um logo ou um produto em 3D mostra o que a imagem plana só sugere.
2. Você controla a luz. Material, ângulo e iluminação deixam de depender de foto ou banco de imagem.
3. Um modelo, várias peças. O mesmo arquivo vira render, mockup, capa e cena de teaser.

Não precisa virar artista 3D em tempo integral. Já ajuda muito saber o suficiente para tirar uma ideia do papel.${TAGS}#3d #blender #designgrafico #carreira #aprendizado`,
  },

  // ------------------------------------------------------------------ 22 · motion com significado
  {
    slug: 'movimento-tem-significado', name: 'Movimento tem significado', kicker: 'O ESTÚDIO DE ANIMAÇÃO', accent: I.vfx,
    draw(k) {
      k.kick(k.M, 210, 'O ESTÚDIO DE ANIMAÇÃO', I.vfx)
      k.title(k.M, 330, ['Movimento tem', 'significado.'], { s: 96 })
      k.para(k.M, 520, 'Antes de animar, eu pergunto: o que esse movimento está dizendo?', { s: 30, maxw: 900 })
      const curves = [
        ['STEPS', 'Pixel anda em passos', i => Math.floor(i * 8) / 8],
        ['QUIQUE', 'O que pipoca, quica', i => 1 - Math.abs(Math.cos(i * Math.PI * 2.5)) * (1 - i)],
        ['SUAVE', 'Texto só desliza', i => 1 - (1 - i) ** 3],
      ]
      const bw = (k.W - 2 * k.M - 2 * 30) / 3, bh = 380, y = 640
      curves.forEach(([n, d, f], j) => {
        const x = k.M + j * (bw + 30)
        k.card(x + 9, y, bw - 18, bh, { fill: T.deep, accent: I.vfx })
        const gx = x + 40, gy = y + 60, gw = bw - 98, gh = 200
        k.rect(gx, gy + gh, gw, 2, T.line)
        k.rect(gx, gy, 2, gh, T.line)
        for (let s = 0; s <= 24; s++) { const t = s / 24; const v = f(t); k.rect(Math.round(gx + t * gw) - 4, Math.round(gy + gh - v * gh) - 4, 8, 8, I.vfx) }
        k.text(x + 40, y + bh - 80, n, { f: FONT.pixel, s: 16, c: '#ffffff' })
        k.text(x + 40, y + bh - 40, d, { f: FONT.copy, s: 20, c: T.soft })
      })
      k.bubble(k.M, 1080, k.W - 2 * k.M, 'Fundo fica parado. Só o primeiro plano se mexe.', { s: 32, tail: false, who: 'REGRA' })
    },
    caption: `Movimento tem significado.

Antes de animar qualquer coisa, eu faço uma pergunta: o que esse movimento está dizendo?

No meu portfólio, cada tipo de coisa tem um jeito próprio de se mexer:
→ A pixel art anda em passos, quadro a quadro, como num jogo.
→ O que pipoca na tela quica.
→ O texto só desliza, para não atrapalhar a leitura.

E o fundo fica parado. Se tudo se mexe, nada chama atenção.

Animação boa não é a que tem mais efeito. É a que ajuda a entender.${TAGS}#motiondesign #animacao #gsap #uxdesign #microinteracoes`,
  },

  // ------------------------------------------------------------------ 23 · arsenal
  {
    slug: 'arsenal', name: 'Ferramenta não é habilidade', kicker: 'ARSENAL', accent: T.secondary,
    draw(k) {
      k.kick(k.M, 210, 'ARSENAL', T.secondary)
      k.title(k.M, 330, ['Ferramenta não', 'é habilidade.'], { s: 96 })
      k.para(k.M, 520, 'O inventário ajuda. Quem decide o que fazer com ele é você.', { s: 30, maxw: 900 })
      const tools = [
        ['Illustrator', I.design], ['Photoshop', I.design], ['InDesign', I.design], ['Figma', I.web],
        ['After Effects', I.vfx], ['Premiere Pro', I.vfx], ['DaVinci Resolve', I.vfx], ['HTML e CSS', I.web],
        ['Blender', I.d3], ['Cinema 4D', I.d3], ['Substance', I.d3], ['ZBrush', I.d3],
      ]
      const cols = 4, sw = (k.W - 2 * k.M - (cols - 1) * 22) / cols, sh = 150
      tools.forEach(([t, c], j) => {
        const x = k.M + (j % cols) * (sw + 22), y = 640 + Math.floor(j / cols) * (sh + 22)
        k.rect(x - 3, y - 3, sw + 6, sh + 6, T.ink)
        k.rect(x, y, sw, sh, T.panel2)
        k.rect(x, y, sw, 4, '#ffffff', { op: 0.12 })
        k.rect(x + 18, y + 22, 34, 34, c)
        k.rect(x + 18, y + 22, 34, 6, '#ffffff', { op: 0.35 })
        k.para(x + 18, y + 104, t, { s: 22, w: 600, c: '#ffffff', maxw: sw - 30, lh: 28 })
      })
    },
    caption: `Ferramenta não é habilidade.

Meu inventário hoje tem Illustrator, Photoshop, InDesign, Figma, After Effects, Premiere, DaVinci Resolve, Blender, Cinema 4D, Substance, ZBrush, HTML e CSS.

Mas nenhuma dessas ferramentas decide nada sozinha. Elas executam. Quem escolhe o grid, a cor, o ritmo do corte e a luz do render é quem está usando.

Aprender ferramenta nova é ótimo. Aprender a pensar a peça é o que faz a diferença entre elas.

Qual ferramenta mudou o seu jeito de trabalhar?${TAGS}#design #ferramentas #blender #aftereffects #figma`,
  },

  // ------------------------------------------------------------------ 24 · portfólio novo
  {
    slug: 'portfolio-rpg', name: 'Meu portfólio virou um mapa de RPG', kicker: 'A ESTAÇÃO DA REDE', accent: I.web,
    draw(k) {
      k.kick(k.M, 210, 'BASTIDORES', I.web)
      k.title(k.M, 330, ['Meu portfólio virou', 'um mapa de RPG.'], { s: 80 })
      const x = k.M + 9, y = 470, w = k.W - 2 * k.M - 18, h = 560
      k.card(x, y, w, h, { fill: T.card.browser })
      k.rect(x, y, w, 46, T.card.browserBar)
      for (const [j, c] of ['#ff6f61', '#ffc640', '#26eda0'].entries()) k.rect(x + 20 + j * 24, y + 17, 12, 12, c)
      k.rect(x + 110, y + 10, w - 130, 26, T.card.browser)
      k.text(x + 126, y + 29, 'portfolio-otavio-guerra.vercel.app', { f: FONT.pixel, s: 11, c: T.card.browserUrl })
      k.img('img/og-card.jpg', x + 10, y + 56, { w: w - 20, h: h - 66 })
      k.bubble(k.M, 1080, k.W - 2 * k.M, 'Cada ilha guarda uma parte do meu trabalho. Clica e explora.', { s: 32, tail: false, who: 'GUIA' })
    },
    caption: `Meu portfólio virou um mapa de RPG.

Em vez de uma página com uma lista de projetos, o site abre num arquipélago em pixel art. Cada ilha guarda uma parte do meu trabalho:

→ O Ateliê das Cores: design gráfico
→ O Estúdio de Animação: VFX e motion
→ O Observatório de Cristal: 3D
→ A Estação da Rede: web design

Você clica numa ilha, abre a janela dela e vê os projetos. Rolando a página, a viagem continua pelas seções.

Quis que o próprio site fosse um projeto, e não só a vitrine dos outros.

Visita lá e me conta qual ilha você abriu primeiro: portfolio-otavio-guerra.vercel.app${TAGS}#webdesign #portfolio #pixelart #gamedesign #ux`,
  },

  // ------------------------------------------------------------------ 25 · pixel art nítida
  {
    slug: 'nada-borra', name: 'Tudo é pixel, nada borra', kicker: 'BASTIDORES', accent: I.web,
    draw(k) {
      k.kick(k.M, 210, 'BASTIDORES · PIXEL ART', I.web)
      k.title(k.M, 330, ['Tudo é pixel,', 'nada borra.'], { s: 96 })
      k.para(k.M, 520, 'Pixel art só aumenta em múltiplos inteiros. Com 1,5×, alguns pixels ficam maiores que outros.', { s: 28, maxw: 920 })
      const base = 1140
      const r1 = k.img('img/islet_2.png', k.M + 20, base, { k: 3, anchor: 'bottom', center: false })
      k.text(r1.x + r1.w / 2, base + 44, '3×', { f: FONT.pixel, s: 18, c: T.muted, a: 'middle' })
      const r2 = k.img('img/islet_2.png', r1.x + r1.w + 60, base, { k: 6, anchor: 'bottom', center: false })
      k.text(r2.x + r2.w / 2, base + 44, '6×', { f: FONT.pixel, s: 18, c: T.muted, a: 'middle' })
      const r3 = k.img('img/islet_2.png', r2.x + r2.w + 60, base, { k: 10, anchor: 'bottom', center: false })
      k.text(r3.x + r3.w / 2, base + 44, '10×', { f: FONT.pixel, s: 18, c: T.secondary, a: 'middle' })
      k.line(k.M, base + 4, k.W - k.M, base + 4, T.line, 2, '6 10')
    },
    caption: `Tudo é pixel, nada borra.

Uma regra que levei a sério no meu portfólio: pixel art só aumenta em múltiplos inteiros. 1×, 2×, 3×, 4×.

Parece detalhe, mas não é. Se você aumenta uma arte 1,5×, o navegador precisa inventar meio pixel, e aí alguns pixels ficam maiores que outros. A arte fica torta sem que ninguém saiba dizer por quê.

Por isso o site calcula a escala em números inteiros, desliga a suavização das imagens e posiciona as animações sempre em pixel inteiro.

O público não vê a regra. Vê só que tudo está nítido.${TAGS}#pixelart #webdesign #frontend #css #gamedev`,
  },

  // ------------------------------------------------------------------ 26 · design system
  {
    slug: 'roxo-manda-menta-confirma', name: 'Roxo manda, menta confirma', kicker: 'DESIGN SYSTEM', accent: T.primary,
    draw(k) {
      k.kick(k.M, 210, 'DESIGN SYSTEM', T.primaryHi)
      k.title(k.M, 330, ['Roxo manda,', 'menta confirma.'], { s: 96 })
      k.para(k.M, 520, 'A regra 60 · 30 · 10 do portfólio: 60% tinta, 30% roxo e 10% menta. Cada ilha tem a sua cor, usada só como acento.', { s: 28, maxw: 920 })
      const y = 680, w = k.W - 2 * k.M, h = 120
      k.rect(k.M - 3, y - 3, w + 6, h + 6, T.rim)
      k.rect(k.M, y, w * 0.6, h, T.ink)
      k.rect(k.M + w * 0.6, y, w * 0.3, h, T.primary)
      k.rect(k.M + w * 0.9, y, w * 0.1, h, T.secondary)
      k.text(k.M + 24, y + h + 50, '60 TINTA', { f: FONT.pixel, s: 13, c: T.muted })
      k.text(k.M + w * 0.6 + 16, y + h + 50, '30 ROXO', { f: FONT.pixel, s: 13, c: T.primaryHi })
      k.text(k.M + w, y + h + 50, '10', { f: FONT.pixel, s: 13, c: T.secondary, a: 'end' })
      const isl = [['Design', I.design], ['Motion', I.vfx], ['3D', I.d3], ['Web', I.web], ['Sobre', I.apresentacao], ['Contato', I.contato]]
      const sw = (w - 5 * 18) / 6
      isl.forEach(([n, c], j) => {
        const x = k.M + j * (sw + 18), sy = 920
        k.rect(x - 3, sy - 3, sw + 6, 150 + 6, T.ink)
        k.rect(x, sy, sw, 150, c)
        k.rect(x, sy, sw, 6, '#ffffff', { op: 0.35 })
        k.text(x + sw / 2, sy + 196, n, { f: FONT.display, s: 22, w: 700, c: '#ffffff', a: 'middle' })
        k.text(x + sw / 2, sy + 226, c.toUpperCase(), { f: FONT.game, s: 24, c: T.muted, a: 'middle' })
      })
    },
    caption: `Roxo manda, menta confirma.

Antes de desenhar as telas do portfólio, montei um design system: cores, tipografia, grade, componentes e regras de movimento, tudo documentado.

A regra de cor é a 60 · 30 · 10:
→ 60% tinta (o fundo quase preto, #1A1230)
→ 30% roxo (#9246F9), que é quem manda
→ 10% menta (#26EDA0), que confirma: botões, links e o que pede ação

Cada ilha ainda tem a sua própria cor, mas só como acento. É o que deixa um site cheio de cor sem virar bagunça.

Design system não é burocracia. É o que deixa você criar rápido sem perder a cara.${TAGS}#designsystem #uidesign #cores #webdesign #ux`,
  },

  // ------------------------------------------------------------------ 27 · o site é um jogo
  {
    slug: 'o-site-e-um-jogo', name: 'O site é um jogo', kicker: 'BASTIDORES', accent: I.web,
    draw(k) {
      k.kick(k.M, 210, 'BASTIDORES · GAME UI', I.web)
      k.title(k.M, 330, ['Rolar a página', 'é viajar.'], { s: 96 })
      const rows = [['Seções', 'são fases', I.apresentacao], ['Projetos', 'são missões', I.design], ['Contatos', 'são NPCs', I.contato], ['Rolar', 'é avançar na viagem', I.web]]
      rows.forEach(([a, b2, c], j) => {
        const y = 470 + j * 128
        k.card(k.M + 9, y, k.W - 2 * k.M - 18, 96, { fill: T.panel })
        k.rect(k.M + 9, y, 12, 96, c)
        k.text(k.M + 50, y + 63, a, { f: FONT.display, s: 40, w: 700, c: '#ffffff' })
        k.text(k.M + 320, y + 63, '→ ' + b2, { f: FONT.game, s: 44, c })
      })
      k.img('img/isl_design.png', k.M, 1205, { w: 190, h: 190, anchor: 'bottom', center: false })
      k.img('img/isl_vfx.png', k.M + 246, 1205, { w: 190, h: 190, anchor: 'bottom', center: false })
      k.img('img/isl_d3.png', k.M + 492, 1205, { w: 190, h: 190, anchor: 'bottom', center: false })
      k.img('img/isl_web.png', k.M + 738, 1205, { w: 190, h: 190, anchor: 'bottom', center: false })
    },
    caption: `Rolar a página é viajar.

No meu portfólio, o site inteiro funciona como um jogo:
→ As seções são fases.
→ Os projetos são missões.
→ Os contatos são NPCs que te ajudam.
→ Rolar a página é avançar na viagem, e o cabeçalho mostra a fase e o XP.

A metáfora não está ali só para enfeitar. Ela dá um motivo para continuar rolando, e quem visita entende rápido onde está e o que vem depois.

Gamificação funciona melhor quando explica alguma coisa, não quando só decora.${TAGS}#gamedesign #gameui #webdesign #ux #storytelling`,
  },

  // ------------------------------------------------------------------ 28 · acessibilidade
  {
    slug: 'animacao-sabe-parar', name: 'Animação boa sabe a hora de parar', kicker: 'ACESSIBILIDADE', accent: I.web, layout: 'tips',
    label: 'ACESSIBILIDADE', title: 'Animação boa sabe a hora de parar.', ts: 70,
    items: [
      ['Respeite o sistema', 'Se a pessoa pediu menos movimento no aparelho, o site obedece.'],
      ['Dê o botão de desligar', 'Uma opção no site desliga todas as animações de uma vez.'],
      ['Contraste não é opcional', 'Texto legível em qualquer fundo, com contraste AA medido.'],
    ],
    caption: `Animação boa sabe a hora de parar.

Meu portfólio tem muita animação: rolagem, ilhas, partículas, janelas que abrem. Justamente por isso, ele precisa saber quando não animar:

1. Respeitar o sistema. Se a pessoa pediu menos movimento nas configurações do aparelho, o site obedece.
2. Dar o botão de desligar. Existe uma opção no próprio site que desliga todas as animações.
3. Contraste não é opcional. Os textos passam no teste de contraste AA, até no fundo de pergaminho.

Para algumas pessoas, movimento demais causa enjoo de verdade. Acessibilidade é o que deixa todo mundo jogar.${TAGS}#acessibilidade #a11y #webdesign #ux #motiondesign`,
  },

  // ------------------------------------------------------------------ 29 · processo
  {
    slug: 'como-trabalho', name: 'Como eu trabalho', kicker: 'QUADRO DE MISSÕES', accent: I.contato,
    draw(k) {
      k.kick(k.M, 210, 'QUADRO DE MISSÕES', I.contato)
      k.title(k.M, 330, ['Como uma missão', 'vira projeto.'], { s: 90 })
      const steps = [['Briefing', 'Você descreve a missão: objetivo, público e referências.'], ['Proposta', 'Eu devolvo escopo, etapas, prazo e orçamento.'], ['Produção', 'Prévias a cada etapa, com rodadas de ajuste.'], ['Entrega', 'Arquivos finais organizados e suporte pós-entrega.']]
      const x = k.M + 9, w = k.W - 2 * k.M - 18
      k.card(x, 480, w, 680, { fill: T.quest.paper })
      k.rect(x, 480, w, 10, T.quest.wood)
      steps.forEach(([t, d], j) => {
        const y = 540 + j * 155
        k.rect(x + 36, y, 70, 70, T.quest.wax)
        k.text(x + 71, y + 48, String(j + 1), { f: FONT.pixel, s: 26, c: '#ffffff', a: 'middle' })
        k.text(x + 136, y + 34, t, { f: FONT.display, s: 38, w: 700, c: T.ink })
        k.para(x + 136, y + 76, d, { s: 24, c: T.quest.frame, maxw: w - 180, lh: 32 })
        if (j < 3) k.rect(x + 69, y + 82, 4, 60, T.quest.rust)
      })
    },
    caption: `Como uma missão vira projeto.

Meu processo tem quatro etapas, sempre nessa ordem:

1. Briefing: você descreve a missão. Objetivo, público e referências.
2. Proposta: eu devolvo escopo, etapas, prazo e orçamento.
3. Produção: você recebe prévias a cada etapa, com rodadas de ajuste.
4. Entrega: arquivos finais organizados e suporte depois da entrega.

Processo claro protege os dois lados. Você sabe o que vai receber e quando. Eu sei exatamente o que precisa ser feito.

Tem uma missão em mente? O formulário de briefing está no meu site.${TAGS}#freelancer #processocriativo #designgrafico #briefing #cliente`,
  },

  // ------------------------------------------------------------------ 30 · próxima missão
  {
    slug: 'proxima-missao', name: 'Próxima missão', kicker: 'CONTATO', accent: I.contato,
    draw(k) {
      k.kick(k.M, 210, 'PRÓXIMA FASE', I.contato)
      k.title(k.M, 330, ['Próxima missão:', 'a sua?'], { s: 104 })
      k.para(k.M, 530, 'Aberto a freelas e vagas fixas em design gráfico, motion, 3D e web.', { s: 30, maxw: 900 })
      const cards = [['E-MAIL', 'otavioguerra@proton.me', T.island.d3], ['BEHANCE', 'behance.net/otavio_og', I.design], ['PORTFÓLIO', 'portfolio-otavio-guerra.vercel.app', T.secondary]]
      cards.forEach(([t, v, c], j) => {
        const y = 640 + j * 150, x = k.M + 9, w = k.W - 2 * k.M - 18
        k.rect(x, y, w, 120, T.card.glass)
        k.rect(x, y, 10, 120, c)
        k.rect(x + 40, y + 36, 48, 48, c)
        k.rect(x + 40, y + 36, 48, 8, '#ffffff', { op: 0.35 })
        k.text(x + 116, y + 50, t, { f: FONT.pixel, s: 13, c })
        k.text(x + 116, y + 92, v, { f: FONT.copy, s: 30, w: 600, c: '#ffffff' })
      })
      k.bubble(k.M, 1100, k.W - 2 * k.M, 'Fim da viagem. Ou o começo.', { s: 34, tail: false, who: 'GUIA' })
    },
    caption: `Fim da série. Ou o começo.

Nesses 30 posts contei de onde vim, mostrei os projetos de que mais me orgulho e abri os bastidores do meu portfólio novo.

Agora a próxima fase depende de você: estou aberto a freelas e vagas fixas em design gráfico, motion, 3D e web.

Se tem um projeto, uma vaga ou só quer trocar uma ideia:
→ E-mail: otavioguerra@proton.me
→ Behance: behance.net/otavio_og
→ Portfólio: portfolio-otavio-guerra.vercel.app

Obrigado por ter acompanhado até aqui. A gente se vê na próxima missão.${TAGS}#design #freelancer #vagas #motiondesign #3d`,
  },
]
