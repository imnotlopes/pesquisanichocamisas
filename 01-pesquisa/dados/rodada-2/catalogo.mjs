import fs from 'node:fs';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const lojas = { 'Tailored Athlete': 'tailoredathlete.com', 'Kojo Fit': 'kojofit.com', SAVID: 'trysavid.com', 'Nimble Made': 'nimble-made.com', Buffery: 'buffery.us' };
const out = {};
for (const [nome, dom] of Object.entries(lojas)) {
  const prods = [];
  let status = 'ok';
  for (let p = 1; p <= 20; p++) {
    try {
      const r = await fetch(`https://${dom}/products.json?limit=250&page=${p}`, { headers: { 'user-agent': UA, accept: 'application/json' }, signal: AbortSignal.timeout(30000) });
      if (!r.ok) { status = `HTTP ${r.status}`; break; }
      const txt = await r.text();
      if (!txt.trim().startsWith('{')) { status = 'nao-json (bloqueio?)'; break; }
      const j = JSON.parse(txt);
      if (!j.products?.length) break;
      prods.push(...j.products);
      if (j.products.length < 250) break;
    } catch (e) { status = 'erro ' + e.message; break; }
  }
  const linhas = prods.map(p => {
    const precos = p.variants.map(v => +v.price).filter(x => x > 0);
    const cmp = p.variants.map(v => +(v.compare_at_price || 0)).filter(x => x > 0);
    return { handle: p.handle, title: p.title, type: p.product_type, created_at: p.created_at?.slice(0, 10), published_at: p.published_at?.slice(0, 10), min: Math.min(...precos), max: Math.max(...precos), compare: cmp.length ? Math.max(...cmp) : null, disponivel: p.variants.some(v => v.available), variantes: p.variants.length };
  });
  const med = a => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : null; };
  const camisas = linhas.filter(l => /shirt/i.test(l.title) && !/t-shirt|tee/i.test(l.title));
  out[nome] = { dominio: dom, status, total_produtos: linhas.length,
    novos_desde_2026_08_28: linhas.filter(l => l.created_at >= '2026-08-28').map(l => ({ title: l.title, created_at: l.created_at, min: l.min, compare: l.compare })),
    mediana_preco: med(linhas.map(l => l.min)), mediana_camisas: med(camisas.map(l => l.min)), n_camisas: camisas.length,
    com_desconto_pct: linhas.length ? Math.round(100 * linhas.filter(l => l.compare && l.compare > l.min).length / linhas.length) : null,
    produtos: linhas };
  console.log(nome, status, linhas.length, 'novos:', out[nome].novos_desde_2026_08_28.length, 'mediana', out[nome].mediana_preco, 'camisas', camisas.length, out[nome].mediana_camisas);
}
fs.writeFileSync('catalogo-2026-09-27.json', JSON.stringify(out, null, 2));
