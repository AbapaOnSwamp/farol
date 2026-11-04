Você vai fazer a tela do desafio Daily UI de hoje. Responda em português do Brasil, frases curtas. Pasta: a raiz deste repositório (leia README.md e config/engine.config.json).

1. Rode `node engine/dailyui/dia.js hoje`. Se for fim de semana, dia 0 ou maior que 100, ou se `workspace/dailyui/legendas/NNN.txt` já existir, encerre dizendo o motivo.
2. Escreva `engine/dailyui/dias/NNN.js` no formato de `engine/dailyui/dias/001.js` (exporta { tema, accent, draw(k), caption }). Leia antes `001.js`, `engine/dailyui/ui.js`, `engine/brand/kit.js` e `engine/brand/lib.js`.
   - Use só os tokens, fontes e peças da marca (lib.js e kit.js). Mostre a tela de verdade (celular com k.phone, ou janela desenhada) e as "DECISÕES DE UX" numeradas (k.pin, k.note).
   - Pense como designer de UI/UX sênior: hierarquia, estados (foco, erro, vazio, carregando), acessibilidade (contraste AA, foco visível, alvos de 44 px), microcopy. Cada dia diferente dos anteriores.
   - Pixel art só da pasta de imagens configurada, em escala inteira (k.img com { k }). Ícones e setas desenhados com rect/poly, nunca com símbolos de texto.
   - Legenda: começa com "Daily UI NNN · <Tema>", 3 a 5 pontos de UX, quantos faltam, 4 a 5 hashtags. Nada inventado sobre clientes ou resultados.
3. Gere e exporte: `node engine/dailyui/dia.js N` e `node engine/exportar-png.js dailyui NNN`. Abra o PNG em `workspace/dailyui/png/`, confira se nada está cortado ou sobreposto e corrija.
4. Desigma (opcional): se as ferramentas mcp__desigma__ estiverem disponíveis e `desigma.project` estiver configurado, importe o SVG do dia e coloque o quadro na página "Daily UI" com `engine/desigma/anexar.js`, sem descartar edições do usuário (guarde o estado do editor antes, como o README explica).
5. Termine dizendo que o post está pronto para aprovação no painel. Não publique nada: aprovação e publicação são feitas pelo usuário no painel.
