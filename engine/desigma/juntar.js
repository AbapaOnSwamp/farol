'use strict'
// Junta vários .desigma num só, um por página (o MCP do desigma não cria páginas; mesma ideia de ../../build/merge-pages.js).
// Uso: node juntar.js saida.desigma "Nome da página 1=arquivo1.desigma" "Nome da página 2=arquivo2.desigma" ...
const fs = require('fs')
const [out, ...pares] = process.argv.slice(2)
const fontes = pares.map(s => { const i = s.indexOf('='); return [s.slice(0, i), s.slice(i + 1)] })

let R = null
for (const [nome, arq] of fontes) {
  const B = JSON.parse(fs.readFileSync(arq, 'utf8'))
  // primeiro arquivo é a base; com nome vazia ("=arquivo") ele mantém todas as suas páginas como estão
  if (!R) { R = B; if (nome) { R.nodes[R.pages[0]].name = nome; R.pages = [R.pages[0]] } continue }
  const off = Math.max(R.next_id || 0, ...Object.keys(R.nodes).map(Number))
  const map = id => (id == null ? id : id + off)
  for (const n of Object.values(B.nodes)) {
    const m = JSON.parse(JSON.stringify(n))
    m.id = map(n.id); m.parent = map(n.parent); m.children = (n.children || []).map(map)
    if (n.source_id != null) m.source_id = map(n.source_id)
    R.nodes[m.id] = m
  }
  const pg = map(B.pages[0])
  R.nodes[pg].name = nome
  // arquivo com várias páginas: tudo entra nesta página só, com os quadros lado a lado
  let x = Math.max(0, ...R.nodes[pg].children.map(c => R.nodes[c].transform.tx + R.nodes[c].size.x)) + 400
  for (const other of B.pages.slice(1).map(map)) {
    for (const c of R.nodes[other].children) { R.nodes[c].parent = pg; R.nodes[c].transform.tx += x; R.nodes[pg].children.push(c); x += R.nodes[c].size.x + 400 }
    delete R.nodes[other]
  }
  R.pages.push(pg)
  R.next_id = off + (B.next_id || Object.keys(B.nodes).length) + 1
  Object.assign(R.images, B.images)
}
R.name = 'LinkedIn e Behance'

// confere: toda referência de pai/filho existe
let bad = 0
for (const n of Object.values(R.nodes)) { if (n.parent != null && !R.nodes[n.parent]) bad++; for (const c of n.children || []) if (!R.nodes[c]) bad++ }
if (bad) { console.error('referências quebradas:', bad); process.exit(1) }
fs.writeFileSync(out, JSON.stringify(R), 'utf8')
console.log('ok', out, '| páginas:', R.pages.map(id => R.nodes[id].name).join(' · '), '| nós:', Object.keys(R.nodes).length, '| MB:', (fs.statSync(out).size / 1048576).toFixed(0))
