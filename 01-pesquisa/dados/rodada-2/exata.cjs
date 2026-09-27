const { chromium } = require('playwright'); const fs = require('fs');
const termos = ['athletic fit dress shirt','performance dress shirt','muscle fit dress shirt','wrinkle free dress shirt','non iron dress shirt','no ironing','stretch dress shirt','moisture wicking dress shirt','sweat proof dress shirt','dress shirts for muscular','wrinkle free stretch','athletic fit shirt','dress shirt','stretch chino','performance polo'];
(async () => {
  const b = await chromium.launch({ headless: true });
  const pg = await (await b.newContext({ locale: 'en-US', viewport: { width: 1280, height: 2000 } })).newPage();
  const out = [];
  for (const t of termos) {
    const u = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&is_targeted_country=false&media_type=all&q=${encodeURIComponent('"' + t + '"')}&search_type=keyword_exact_phrase`;
    try {
      await pg.goto(u, { waitUntil: 'domcontentloaded', timeout: 45000 }); await pg.waitForTimeout(6000);
      for (let i = 0; i < 4; i++) { await pg.mouse.wheel(0, 3000); await pg.waitForTimeout(1500); }
      const txt = await pg.evaluate(() => document.body.innerText);
      const m = txt.match(/~?\s?([\d,.]+K?)\s+results?/i);
      const linhas = txt.split('\n').map(s => s.trim());
      const anunciantes = {};
      linhas.forEach((l, i) => { if (/^Sponsored$/i.test(l) && linhas[i - 1]) { const n = linhas[i - 1]; anunciantes[n] = (anunciantes[n] || 0) + 1; } });
      const r = { termo: t, resultados: m ? m[1] : (/No ads match/i.test(txt) ? '0' : null), anunciantes_amostra: Object.entries(anunciantes).sort((a, b) => b[1] - a[1]).slice(0, 15) };
      out.push(r); console.log(t, '=>', r.resultados, JSON.stringify(r.anunciantes_amostra.slice(0, 10)));
    } catch (e) { console.log(t, 'erro', e.message.slice(0, 80)); out.push({ termo: t, erro: e.message.slice(0, 120) }); }
    await pg.waitForTimeout(2000);
  }
  fs.writeFileSync('termos-frase-exata-2026-09-27.json', JSON.stringify({ data: '2026-09-27', fonte: 'Biblioteca de Anuncios publica, frase exata, EUA, ativos', termos: out }, null, 2));
  await b.close();
})();
