// Rodada 2 (27/09/2026): (a) confere se os 12 criativos de 28/08 seguem ativos;
// (b) baixa os criativos vencedores dos concorrentes novos. Mesma técnica da rodada 1:
// snapshot público da Biblioteca (sem login), maior img scontent ou <video>.
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const OUT = path.join(__dirname, '..', '..', 'paginas', 'criativos');
const antigos = JSON.parse(fs.readFileSync(path.join(OUT, 'manifesto.json'), 'utf8'));
const novos = [
  { id: '1616778116788673', loja: 'Truefords', titulo: 'Say Goodbye To Ironing !', inicio: '2026-09-07' },
  { id: '1098764939281688', loja: 'Truefords', titulo: 'Say Goodbye To Ironing (7am / noon / 6pm)', inicio: '2026-09-04' },
  { id: '1952400408726981', loja: 'Tone Tec', titulo: 'Final Hours: Buy 2 Get 1 FREE', inicio: '2026-05-31' },
  { id: '1440426037252259', loja: 'Stretto', titulo: 'Dress Pants That Actually Feel Good', inicio: '2026-04-17' },
  { id: '1691874042025228', loja: 'Trueform', titulo: 'The Dress Shirt Guys Keep Coming Back For', inicio: '2026-07-08' },
  { id: '2844178522610790', loja: 'TexTale', titulo: 'Sharp Without the Effort', inicio: '2026-08-26' },
  { id: '1994899938090531', loja: 'SAVID', titulo: 'Flex Weave Dress Shirts', inicio: '2026-09-09' },
  { id: '2262785581136925', loja: 'Tailored Athlete', titulo: 'Tailored Without Going To The Tailor (DCO)', inicio: '2026-08-27' },
];
(async () => {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, locale: 'en-US' });
  const pg = await ctx.newPage();
  const status = [];
  for (const a of antigos) {
    try {
      await pg.goto(`https://www.facebook.com/ads/library/?id=${a.id}`, { waitUntil: 'domcontentloaded', timeout: 40000 }); await pg.waitForTimeout(3500);
      const t = await pg.evaluate(() => document.body.innerText);
      // A página abre com o filtro "Active ads" ligado. Anúncio ativo abre o detalhe com
      // "Active | Library ID: <id>"; anúncio que saiu do ar cai em "No ads match" (medido em 27/09).
      const st = new RegExp(`\\bActive\\s*\\n?\\s*Library ID: ${a.id}`).test(t) ? 'ativo'
        : new RegExp(`Inactive\\s*\\n?\\s*Library ID: ${a.id}`).test(t) || /No ads match/.test(t) ? 'fora do ar' : 'indefinido';
      const desde = (t.match(/Started running on ([A-Z][a-z]{2} \d{1,2}, \d{4})/) || [])[1] || null;
      status.push({ id: a.id, loja: a.loja, titulo: a.titulo, status: st, desde }); console.log('status', a.loja, a.id, st, desde);
    } catch (e) { status.push({ id: a.id, loja: a.loja, titulo: a.titulo, status: 'erro', erro: e.message.slice(0, 80) }); }
  }
  const man = [];
  for (const a of process.argv.includes('--so-status') ? [] : novos) {
    try {
      await pg.goto(`https://www.facebook.com/ads/library/?id=${a.id}`, { waitUntil: 'domcontentloaded', timeout: 40000 }); await pg.waitForTimeout(3500);
      const info = await pg.evaluate(() => {
        const v = document.querySelector('video'); if (v && (v.src || v.querySelector('source')?.src)) return { type: 'video', src: v.src || v.querySelector('source').src, poster: v.poster };
        const s = [...document.querySelectorAll('img[src*="scontent"]')].map(i => ({ src: i.src, w: i.naturalWidth, h: i.naturalHeight })).filter(x => x.w).sort((x, y) => y.w * y.h - x.w * x.h);
        return s[0] && (s[0].w >= 300 || s[0].h >= 300) ? { type: 'image', ...s[0] } : null;
      });
      if (!info) { man.push({ ...a, status: 'failed' }); console.log('FALHOU', a.loja); continue; }
      const slug = a.loja.toLowerCase().replace(/\s+/g, '-');
      const file = `r2-${slug}-${a.id}.${info.type === 'video' ? 'mp4' : 'jpg'}`;
      fs.writeFileSync(path.join(OUT, file), await (await ctx.request.get(info.src)).body());
      let poster = null;
      if (info.type === 'video' && info.poster) { poster = file.replace('.mp4', '-cover.jpg'); fs.writeFileSync(path.join(OUT, poster), await (await ctx.request.get(info.poster)).body()); }
      man.push({ ...a, status: 'ok', type: info.type, file, cover: poster, ad_url: `https://www.facebook.com/ads/library/?id=${a.id}` }); console.log('OK', a.loja, file);
    } catch (e) { man.push({ ...a, status: 'error', reason: e.message.slice(0, 120) }); console.log('ERRO', a.loja, e.message.slice(0, 80)); }
  }
  fs.writeFileSync(path.join(__dirname, 'status-criativos-rodada-1.json'), JSON.stringify({ data: '2026-09-27', criativos: status }, null, 2));
  if (man.length) fs.writeFileSync(path.join(OUT, 'manifesto-rodada-2.json'), JSON.stringify(man, null, 2));
  await b.close();
})();
