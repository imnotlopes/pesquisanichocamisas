import fs from 'node:fs';
const sementes = ['athletic fit dress shirt', 'performance dress shirt', 'wrinkle free stretch shirt', 'moisture wicking dress shirt', 'muscle fit dress shirt', 'non iron dress shirt', 'stretch dress shirt men', 'dress shirt for muscular guys', 'dress shirt that doesnt wrinkle', 'sweat proof dress shirt'];
const mods = ['', ' for', ' best', ' vs', ' big'];
const res = {};
for (const s of sementes) {
  const set = [];
  for (const m of mods) {
    const q = s + m;
    for (const [fonte, url] of [['google', `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${encodeURIComponent(q)}`], ['bing', `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(q)}&market=en-US`]]) {
      try { const r = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0' } }); const j = JSON.parse(await r.text()); j[1].forEach((t, i) => set.push({ t: t.toLowerCase(), fonte, pos: i + 1, q })); } catch (e) { set.push({ erro: fonte + ' ' + q + ' ' + e.message }); }
      await new Promise(r => setTimeout(r, 300));
    }
  }
  res[s] = set;
}
const todos = {};
for (const [s, arr] of Object.entries(res)) for (const x of arr) if (x.t) { const k = x.t; (todos[k] ??= { termo: k, semente: s, fontes: new Set(), melhor_pos: 99, vezes: 0 }); todos[k].fontes.add(x.fonte); todos[k].melhor_pos = Math.min(todos[k].melhor_pos, x.pos); todos[k].vezes++; }
const lista = Object.values(todos).map(x => ({ ...x, fontes: [...x.fontes] })).sort((a, b) => b.fontes.length - a.fontes.length || a.melhor_pos - b.melhor_pos || b.vezes - a.vezes);
fs.writeFileSync('autocomplete-2026-09-27.json', JSON.stringify({ data: '2026-09-27', sementes, termos: lista, erros: Object.values(res).flat().filter(x => x.erro) }, null, 2));
console.log(lista.length, 'termos'); lista.slice(0, 70).forEach(x => console.log(x.fontes.join('+').padEnd(12), x.melhor_pos, x.vezes, x.termo));
console.log('erros', Object.values(res).flat().filter(x => x.erro).length);
