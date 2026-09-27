// Rodada 2 (27/09/2026): home + PDP, desktop (1280x900) e celular (390x844), das 5 lojas da
// rodada 1 + os 2 entrantes dropship que passaram a disputar o ângulo "sem ferro" (Truefords, Tone Tec).
// Também mede o peso transferido de cada página e registra se caiu em verificação anti-bot.
// Uso (da pasta 01-pesquisa): NODE_PATH=<skill>/node_modules node dados/rodada-2/capturar-rodada-2.mjs
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(AQUI, '..', '..', 'capturas-concorrentes', 'rodada-2');
fs.mkdirSync(OUT, { recursive: true });

const lojas = [
  { slug: 'tailored-athlete', home: 'https://tailoredathlete.com/', pdp: 'https://tailoredathlete.com/products/dress-shirt-in-navy-blue' },
  { slug: 'kojo-fit', home: 'https://kojofit.com/', pdp: 'https://www.kojofit.com/products/white-muscle-fit-bamboo-dress-shirt-long-sleeve-mens' },
  { slug: 'savid', home: 'https://trysavid.com/', pdp: 'https://trysavid.com/products/flex-weave-shirt' },
  { slug: 'nimble-made', home: 'https://nimble-made.com/', pdp: 'https://nimble-made.com/products/white-broadcloth-weave' },
  { slug: 'buffery', home: 'https://buffery.us/', pdp: 'https://buffery.us/products/flex-dress-shirt' },
  { slug: 'truefords', home: 'https://truefords.com/', pdp: 'https://truefords.com/products/truefords-non-iron-shirt' },
  { slug: 'tone-tec', home: 'https://trytonetec.com/', pdp: 'https://trytonetec.com/products/executive' },
];
const COOKIE = ['button:has-text("Accept")', '#onetrust-accept-btn-handler', 'button:has-text("Got it")', 'button:has-text("I agree")', 'button:has-text("Allow all")'];

async function shot(ctx, url, file) {
  const page = await ctx.newPage();
  let bytes = 0;
  page.on('response', async r => { try { const l = +(r.headers()['content-length'] || 0); bytes += l || (await r.body()).length; } catch {} });
  const r = { url, arquivo: path.basename(file) };
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3000);
    for (const s of COOKIE) { try { const b = page.locator(s).first(); if (await b.isVisible({ timeout: 400 })) { await b.click({ timeout: 1500 }); break; } } catch {} }
    const txt = await page.evaluate(() => document.body.innerText.slice(0, 3000));
    r.bloqueio = /verify you are human|just a moment|checking your browser|connection needs to be verified/i.test(txt);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight + 2000; y += 700) { window.scrollTo(0, y); await new Promise(x => setTimeout(x, 220)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 72 });
    r.ok = true; r.peso_mb = +(bytes / 1048576).toFixed(1);
  } catch (e) { r.ok = false; r.erro = String(e.message).slice(0, 120); }
  await page.close();
  console.log(JSON.stringify(r));
  return r;
}

const browser = await chromium.launch({ headless: true });
const desk = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'en-US', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' });
const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-US', isMobile: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
const res = [];
const SO = process.argv.find(a => a.startsWith('--so='))?.slice(5);
for (const l of lojas.filter(x => !SO || x.slug === SO)) {
  for (const [tipo, url] of [['home', l.home], ['pdp', l.pdp]]) {
    res.push({ loja: l.slug, tipo, disp: 'desktop', ...(await shot(desk, url, path.join(OUT, `${l.slug}-${tipo}-desktop.jpg`))) });
    res.push({ loja: l.slug, tipo, disp: 'celular', ...(await shot(mob, url, path.join(OUT, `${l.slug}-${tipo}-mobile.jpg`))) });
  }
}
await browser.close();
if (!SO) fs.writeFileSync(path.join(AQUI, 'capturas-rodada-2.json'), JSON.stringify({ data: '2026-09-27', capturas: res }, null, 2));
