import fs from 'node:fs';
const ANCORA = 4400, RANK_ANCORA = 707107, INCL = 1.29, FATOR = 2.5;
const U = { us: 310, gb: 66, ca: 36, au: 25 };
const ANT = { 1000: 1, 5000: 1000, 10000: 5000, 50000: 10000, 100000: 50000, 500000: 100000, 1000000: 500000 };
const out = {};
for (const m of ['202606', '202607', '202608']) {
  for (const l of fs.readFileSync('resultado.txt', 'utf8').split('\n').filter(x => x.startsWith(m))) {
    const p = l.split(' ')[1].replace(':', '');
    const N = +fs.readFileSync(`n-${p}-${m}.txt`, 'utf8').trim();
    for (const par of l.split(' ').slice(2).filter(Boolean)) {
      const [origem, fx] = par.split(','); const faixa = +fx;
      const dom = origem.replace('https://', '').replace('www.', '');
      const op = dom.startsWith('tailoredathlete') ? 'Tailored Athlete' : dom.startsWith('kojofit') ? 'Kojo Fit' : dom.startsWith('nimble') ? 'Nimble Made' : dom;
      const topo = Math.min(faixa, N), rt = Math.sqrt(ANT[faixa] * Math.max(topo, ANT[faixa] + 1));
      const v = ANCORA * (U[p] / U.us) * (RANK_ANCORA / rt) ** INCL;
      const r = (out[m] ??= {})[op] ??= { total: 0, pais: {}, faixas: {} };
      r.faixas[`${p}:${dom}`] = faixa; r.pais[p] = (r.pais[p] || 0) + Math.round(v); r.total += Math.round(v);
    }
  }
}
for (const m in out) for (const op in out[m]) { const r = out[m][op]; r.baixa = Math.round(r.total / FATOR); r.alta = Math.round(r.total * FATOR); r.pct_us = Math.round(100 * (r.pais.us || 0) / r.total); }
console.log(JSON.stringify(out['202608'], null, 1)); console.log(Object.fromEntries(Object.entries(out).map(([m, o]) => [m, Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.total]))])));
fs.writeFileSync('../trafego-crux-2026-09-27.json', JSON.stringify({ metodo: 'CrUX top lists por pais (Chrome), modelo calibrado de estimar.mjs das luminarias; incerteza x/÷2,5; cego ao navegador interno do Instagram/Facebook', meses: out }, null, 2));
