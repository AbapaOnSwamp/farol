'use strict'
// Coloca o quadro de um dia na página "Daily UI" do projeto (cria a página se faltar; refazer o mesmo dia substitui o quadro).
// O desigma importa o SVG do dia e salva um .desigma temporário; este script move o quadro dele para o projeto.
// Uso: node anexar.js <projeto.desigma> <dia.desigma> <posição> "<nome do quadro>" [página] [colunas] [largura] [altura]
//   Daily UI (padrão): página "Daily UI", 5 colunas de 1080 × 1350. Carrossel: "Notícias" 1 8280 1350 (uma faixa por linha).
const fs = require('fs')
const [proj, dia, nStr, nome, pag, cols, larg, alt] = process.argv.slice(2)
const n = +nStr
const PAGINA = pag || 'Daily UI', COLS = +cols || 5, W = +larg || 1080, H = +alt || 1350, GAP = 160

const R = JSON.parse(fs.readFileSync(proj, 'utf8'))
const B = JSON.parse(fs.readFileSync(dia, 'utf8'))
const novoId = () => (R.next_id = Math.max(R.next_id || 0, ...Object.keys(R.nodes).map(Number)) + 1)

// página
let pg = R.pages.find(id => R.nodes[id].name === PAGINA)
if (!pg) {
  const modelo = R.nodes[R.pages[0]]
  pg = novoId()
  R.nodes[pg] = { ...JSON.parse(JSON.stringify(modelo)), id: pg, name: PAGINA, children: [], parent: null, source_id: null }
  R.pages.push(pg)
}
// remove um quadro antigo do mesmo dia
const drop = id => { for (const c of R.nodes[id].children || []) drop(c); delete R.nodes[id] }
for (const c of [...R.nodes[pg].children]) if (R.nodes[c].name === nome) { drop(c); R.nodes[pg].children = R.nodes[pg].children.filter(x => x !== c) }

// copia o quadro do dia com ids novos
const raiz = B.nodes[B.nodes[B.pages[0]].children[0]]
const off = Math.max(R.next_id || 0, ...Object.keys(R.nodes).map(Number))
const map = id => (id == null ? id : id + off)
const sub = []
const walk = id => { sub.push(id); for (const c of B.nodes[id].children || []) walk(c) }
walk(raiz.id)
for (const id of sub) {
  const m = JSON.parse(JSON.stringify(B.nodes[id]))
  m.id = map(id); m.parent = id === raiz.id ? pg : map(m.parent); m.children = (m.children || []).map(map)
  if (m.source_id != null) m.source_id = map(m.source_id)
  R.nodes[m.id] = m
}
const q = R.nodes[map(raiz.id)]
q.name = nome
q.transform.tx = GAP + ((n - 1) % COLS) * (W + GAP)
q.transform.ty = GAP + Math.floor((n - 1) / COLS) * (H + GAP)
R.nodes[pg].children.push(q.id)
R.nodes[pg].children.sort((a, b) => R.nodes[a].name.localeCompare(R.nodes[b].name))
R.next_id = off + Math.max(...sub) + 1
Object.assign(R.images, B.images)

let bad = 0
for (const x of Object.values(R.nodes)) { if (x.parent != null && !R.nodes[x.parent]) bad++; for (const c of x.children || []) if (!R.nodes[c]) bad++ }
if (bad) { console.error('referências quebradas:', bad); process.exit(1) }
const tmp = proj + '.tmp'
fs.writeFileSync(tmp, JSON.stringify(R), 'utf8')
fs.renameSync(tmp, proj)
console.log(JSON.stringify({ ok: true, pagina: PAGINA, quadro: nome, quadros: R.nodes[pg].children.length, paginas: R.pages.map(id => R.nodes[id].name) }))
