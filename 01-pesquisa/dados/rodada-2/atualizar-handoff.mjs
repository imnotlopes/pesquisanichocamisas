// Rodada 2 (27/09/2026): leva os achados de rodada-2.json para o handoff-montar-loja.json (V2).
// Só troca campos que a rodada mediu de novo; o resto do contrato (catálogo, páginas, blueprint) fica igual.
// Uso (da pasta 01-pesquisa): node dados/rodada-2/atualizar-handoff.mjs
import fs from 'node:fs';

const ARQ = 'dados/handoff-montar-loja.json';
const h = JSON.parse(fs.readFileSync(ARQ, 'utf8'));

h.research.updated_at = '2026-09-27';
h.research.update_notes = 'Rodada 2: ver paginas/atualizacao.html e dados/rodada-2/rodada-2.json. Rodada 1 arquivada em _rodada-anterior/rodada-1-2026-08-28/.';

h.market.evidence_summary = [
  '5 lojas da rodada 1 reavaliadas em 27/09 (Tailored Athlete, Kojo Fit, SAVID, Nimble Made, Buffery) + 6 entrantes achados por busca de frase exata (Truefords, Trueform, Stretto, Tone Tec, TexTale, James Alden)',
  'Tailored Athlete: 1.575 ativos / 5.729 históricos em 27/09 (era 1.114 / 5.309), ~487 mil visitas/mês estimadas pelo CrUX, 79% EUA',
  'Kojo Fit: 228 ativos / 673 históricos em 27/09 (era 249 / 477), ~68 mil visitas/mês, só 28% EUA',
  'SAVID: 28 ativos / 28 históricos em 27/09 (era 12 / 12), nenhum anúncio desligado; preço por quantidade 44,95 → 29,97 (3+) → 26,97 (5+); garantia subiu para 30 dias',
  'Nimble Made e Buffery: 0 anúncios ativos e 0 no histórico (page_ids 223454095002324 e 109092653951204), 0 no Google Ads',
  'Truefords (dropship, camisa non-iron US$ 67,90 + calça + gravata): 425 ativos / 2.103 históricos com "Say Goodbye To Ironing" + "Buy 2, Get 1 Free"',
  'Frase exata, EUA, ativos (27/09): "stretch dress shirt" 70, "performance dress shirt" 31, "muscle fit dress shirt" 7, "athletic fit dress shirt" 0, "sweat proof dress shirt" 0; os três últimos no topo do autocomplete Google/Bing',
  'Mercado setorial de vestuário de alta performance projetado de US$11,7bi (2026) a US$27,5bi (2035), CAGR ~10% (proxy setorial)',
  'Economia de P&L positiva em cenário conservador (US$8,12/pedido de 1 camisa; US$36,20/pedido "compre 2, leve 3") e base (US$19,02/pedido de 1 camisa)',
];

h.market.limitations = [
  'Tráfego medido (SimilarWeb) não obtido: estimado pelas listas CrUX por país (ago/2026), margem de 2,5x, cego ao navegador interno do Instagram/Facebook',
  'Volume mensal de busca não existe em fonte gratuita: autocomplete dá ordem e presença, não quantidade',
  'Google Trends dos termos de triagem não foi lido (HTTP 429 para acesso automatizado; links multi-país em mercados.html)',
  'Entrantes da rodada 2 sem ficha completa: ativos e preço medidos, faturamento não estimado',
  'Os 2 criativos atribuídos à SAVID na rodada 1 provavelmente são de criador/parceria (snapshot mostra a página "notselimb"); corrigido na galeria',
];

h.offer.bundles = [
  {
    handle: 'long-sleeve-performance-dress-shirt',
    type: 'quantity_break_same_sku',
    status: 'proposed_round_2',
    display: 'three_boxes_on_pdp_middle_preselected',
    per_unit_variant_selection: true,
    tiers: [
      { label: 'Buy 1', quantity: 1, pay_for: 1, price: '69.95' },
      { label: 'Buy 2, Get 1 Free', quantity: 3, pay_for: 2, price: '139.90', badge: 'Most Popular', preselected: true },
      { label: 'Buy 3, Get 2 Free', quantity: 5, pay_for: 3, price: '209.85' },
    ],
    evidence: 'Truefords, Tone Tec e TexTale anunciam "Buy 2, Get 1 Free"; Tone Tec usa 3 caixas com a do meio pré-selecionada; SAVID baixa o preço a partir de 3 peças (27/09/2026)',
    economics_note: 'Pedido de 3: receita 139,90; produto 52,50; frete ~9,00 (premissa); taxa 4,20; margem pré-mídia 74,20 (53%); com CPA 38, sobra 36,20. Custos são estimativa de categoria, sem fornecedor cotado.',
  },
];

h.creative_strategy.angles = [
  'Caimento para quem treina (athletic fit): "athletic fit dress shirt" no topo do autocomplete e com 0 anúncio usando a frase em 27/09',
  'Não marca suor do treino à reunião (sweat-proof / moisture-wicking): mesma situação, 0 anúncio usando a frase',
  'Transição treino→trabalho (a tese da ATHLOS; Tone Tec chega perto com "From 9AM to After-Hours")',
  'Não amassa / não precisa passar: continua verdade, mas virou o ângulo mais disputado (Truefords 425 anúncios, Tone Tec, TexTale, James Alden) — usar como terceiro benefício, não como gancho',
];
h.creative_strategy.reference_gallery = [
  { titulo: 'Flex Weave Dress Shirts (UGC de criador)', loja: 'SAVID', link: 'https://www.facebook.com/ads/library/?id=1994899938090531', arquivo_local: 'paginas/criativos/r2-savid-1994899938090531.mp4' },
  { titulo: 'The Dress Shirt Guys Keep Coming Back For', loja: 'Trueform', link: 'https://www.facebook.com/ads/library/?id=1691874042025228', arquivo_local: 'paginas/criativos/r2-trueform-1691874042025228.mp4' },
  { titulo: 'Final Hours: Buy 2 Get 1 FREE', loja: 'Tone Tec', link: 'https://www.facebook.com/ads/library/?id=1952400408726981', arquivo_local: 'paginas/criativos/r2-tone-tec-1952400408726981.jpg' },
  { titulo: 'Tailored Without Going To The Tailor', loja: 'Tailored Athlete', link: 'https://www.facebook.com/ads/library/?id=2262785581136925', arquivo_local: 'paginas/criativos/r2-tailored-athlete-2262785581136925.mp4' },
  { titulo: 'You Looked Twice', loja: 'Kojo Fit', link: 'https://www.facebook.com/ads/library/?id=1063596439727330', arquivo_local: 'paginas/criativos/kojo-fit-1063596439727330.mp4' },
];
h.creative_strategy.production_notes = '12 criativos baixados em 28/08 (paginas/criativos/manifesto.json) e 8 em 27/09 (manifesto-rodada-2.json). Em 27/09 só 2 dos 12 de agosto seguiam no ar. Formatos que se sustentam: criador falando para a câmera (SAVID, TexTale, Tailored Athlete com nome do criador no título), demonstração simples (camisas dobradas, mala de viagem, manequim) e imagem estática com 3 chamadas (Tone Tec, no ar desde 31/05). Produzir após aprovação de amostra física.';

const novas = [
  'Adotar a oferta "compre 2, leve 3" na PDP da camisa principal (recomendado; ver offer.bundles)',
  'Garantia: manter 14 dias ou subir para 30 (SAVID e Truefords passaram a 30; Tailored Athlete 35)',
  'Data do teste: outubro de 2026, antes da Black Friday; se a amostra atrasar, adiar para depois de novembro',
];
h.decisions_required = [...h.decisions_required.filter(d => !novas.includes(d)), ...novas];

h.validation.problems = h.validation.problems.filter(p => !/Tailored Athlete bloqueada/.test(p));
h.validation.warnings = h.validation.warnings.filter(w => !/Nimble Made, Buffery\) não obtida/.test(w));
h.validation.warnings.push('Rodada 2 (27/09): PDP da Tailored Athlete capturada sem bloqueio em capturas-concorrentes/rodada-2/; benchmark-visual.html passou a usá-la');

fs.writeFileSync(ARQ, JSON.stringify(h, null, 2));
console.log('handoff atualizado:', h.decisions_required.length, 'decisões pendentes');
