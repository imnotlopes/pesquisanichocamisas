// Extrai criativos reais (imagem) da Meta Ads Library via snapshot público, sem login.
// Técnica: img[src*="scontent"], pega a maior por área (naturalWidth*naturalHeight),
// descarta as 2 menores (foto de perfil ~148x148 e ícone ~60x60).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'C:\\Users\\Familia\\Desktop\\Pesquisa de Mercado\\Pesquisa Camisas Sociais Performance\\01-pesquisa\\paginas\\criativos';
fs.mkdirSync(OUT, { recursive: true });

const ads = [
  { id: '3614483035369000', loja: 'SAVID', titulo: 'No Ironing. No Wrinkles.' },
  { id: '1229268512678500', loja: 'SAVID', titulo: 'No Ironing. No Wrinkles. (v2)' },
  { id: '1063596439727330', loja: 'Kojo Fit', titulo: 'You Looked Twice' },
  { id: '3674745586006224', loja: 'Kojo Fit', titulo: "5 Inches. That's All You Need" },
  { id: '1035956156091816', loja: 'Kojo Fit', titulo: 'Fit, Style, Comfort. Have It All' },
  { id: '2137018913856071', loja: 'Kojo Fit', titulo: 'Summer Compliment Generator' },
  { id: '1102222968827480', loja: 'Kojo Fit', titulo: 'Dress Code: Hot' },
  { id: '1055879734023243', loja: 'Tailored Athlete', titulo: 'Tailored Without Going To The Tailor' },
  { id: '927031596569440', loja: 'Tailored Athlete', titulo: 'Confidence You Can Wear' },
  { id: '2060304798189416', loja: 'Tailored Athlete', titulo: 'Josh Mair' },
  { id: '1072320415252516', loja: 'Tailored Athlete', titulo: 'Love at First Fit' },
  { id: '2106156463611035', loja: 'Tailored Athlete', titulo: 'New Collection. Same Perfect Fit.' },
];

async function extrair(page, adId) {
  const url = `https://www.facebook.com/ads/library/?id=${adId}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2500);
  const info = await page.evaluate(() => {
    const video = document.querySelector('video');
    if (video) {
      const src = video.src || video.querySelector('source')?.src;
      if (src) return { type: 'video', src };
    }
    const imgs = [...document.querySelectorAll('img[src*="scontent"]')];
    const sized = imgs.map(img => ({ src: img.src, area: (img.naturalWidth || 0) * (img.naturalHeight || 0), w: img.naturalWidth, h: img.naturalHeight }))
      .filter(x => x.area > 0)
      .sort((a, b) => b.area - a.area);
    if (!sized.length) return null;
    const best = sized[0];
    if (best.w < 300 && best.h < 300) return { type: 'too_small', src: best.src, w: best.w, h: best.h };
    return { type: 'image', src: best.src, w: best.w, h: best.h };
  });
  return info;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, locale: 'en-US' });
  const page = await context.newPage();
  const manifest = [];

  for (const ad of ads) {
    process.stdout.write(`${ad.loja} — ${ad.titulo} (${ad.id}) ... `);
    try {
      const info = await extrair(page, ad.id);
      if (!info || info.type === 'too_small') {
        console.log('FALHOU (sem criativo real, só thumb pequeno)');
        manifest.push({ ...ad, status: 'failed', reason: 'no real creative found (only small thumbnail)' });
        continue;
      }
      const ext = info.type === 'video' ? 'mp4' : 'jpg';
      const filename = `${ad.loja.toLowerCase().replace(/\s+/g, '-')}-${ad.id}.${ext}`;
      const resp = await context.request.get(info.src);
      const buf = await resp.body();
      fs.writeFileSync(path.join(OUT, filename), buf);
      console.log(`OK (${info.type}, ${(buf.length / 1024).toFixed(0)}KB)`);
      manifest.push({ ...ad, status: 'ok', type: info.type, file: filename, width: info.w, height: info.h, ad_url: `https://www.facebook.com/ads/library/?id=${ad.id}` });
    } catch (e) {
      console.log('ERRO', String(e.message).slice(0, 80));
      manifest.push({ ...ad, status: 'error', reason: String(e.message).slice(0, 150) });
    }
  }

  fs.writeFileSync(path.join(OUT, 'manifesto.json'), JSON.stringify(manifest, null, 2));
  await browser.close();
  console.log('\nManifesto salvo em', path.join(OUT, 'manifesto.json'));
})();
