import fs from 'node:fs';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';
const doms = ['trueformwear.com','truefords.com','textale.tech','iviory.com','owndreamshirts.com','trytonetec.com','itsimperium.com','eunoiacopenhagen.com','wearbreeze.co','oakandweston.com','gotieless.com','twillory.com','jamesalden.com','wearstretto.com'];
const out = {};
for (const d of doms) {
  const r = { dominio: d };
  try {
    const x = await fetch(`https://${d}/products.json?limit=250`, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(25000) });
    const t = await x.text();
    if (t.trim().startsWith('{')) {
      const p = JSON.parse(t).products;
      r.shopify = true; r.n = p.length;
      r.produtos = p.slice(0, 8).map(q => ({ t: q.title, preco: +q.variants[0].price, cmp: q.variants[0].compare_at_price ? +q.variants[0].compare_at_price : null, criado: q.created_at.slice(0, 10), vendor: q.vendor }));
      r.mais_antigo = p.map(q => q.created_at.slice(0, 10)).sort()[0];
    } else r.shopify = `nao (${x.status})`;
    const h = await (await fetch(`https://${d}/`, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(25000) })).text();
    r.title = (h.match(/<title[^>]*>([^<]*)/) || [])[1]?.trim().slice(0, 120);
    r.apps = ['loox','judge.me','okendo','stamped','yotpo','reviews.io','ali','dsers','zendrop','cjdropshipping','autods','trustpilot'].filter(a => h.toLowerCase().includes(a));
  } catch (e) { r.erro = e.message.slice(0, 80); }
  try { const w = await (await fetch(`https://rdap.org/domain/${d}`, { signal: AbortSignal.timeout(20000) })).json(); r.registro = (w.events || []).find(e => e.eventAction === 'registration')?.eventDate?.slice(0, 10); } catch (e) { r.registro = 'nao obtido'; }
  out[d] = r; console.log(JSON.stringify(r).slice(0, 900));
}
fs.writeFileSync('novos-entrantes-catalogo.json', JSON.stringify(out, null, 2));
