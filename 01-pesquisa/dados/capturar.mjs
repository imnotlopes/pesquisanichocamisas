// Captura benchmark visual V4: home + PDP, desktop (1280x900) e mobile (390x844)
// Uso: node capturar.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'C:\\Users\\Familia\\Desktop\\Pesquisa de Mercado\\Pesquisa Camisas Sociais Performance\\01-pesquisa\\capturas-concorrentes';
fs.mkdirSync(OUT, { recursive: true });

const COOKIE_SELECTORS = [
  'button:has-text("Accept")', '#onetrust-accept-btn-handler', 'button:has-text("Got it")',
  'button:has-text("I agree")', '[aria-label*="ccept"]', 'button:has-text("Allow all")'
];

const lojas = [
  { slug: 'tailored-athlete', home: 'https://tailoredathlete.com/', pdp: 'https://tailoredathlete.com/products/dress-shirt-in-white' },
  { slug: 'kojo-fit', home: 'https://www.kojofit.com/', pdp: 'https://www.kojofit.com/products/white-muscle-fit-bamboo-dress-shirt-long-sleeve-mens' },
  { slug: 'nimble-made', home: 'https://www.nimble-made.com/', pdp: 'https://www.nimble-made.com/products/white-broadcloth-weave' },
  { slug: 'savid', home: 'https://trysavid.com/', pdp: null },
];

async function dismissCookie(page) {
  for (const s of COOKIE_SELECTORS) {
    try {
      const b = page.locator(s).first();
      if (await b.isVisible({ timeout: 500 })) { await b.click({ timeout: 1500 }); await page.waitForTimeout(500); break; }
    } catch (e) {}
  }
}

async function scrollLoad(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight + 2000; y += 700) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 220));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(800);
}

async function shot(context, url, file, label) {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);
    await dismissCookie(page);
    await scrollLoad(page);
    await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 78 });
    const kb = Math.round(fs.statSync(file).size / 1024);
    console.log(`  OK ${label} (${kb} KB)`);
    return page;
  } catch (e) {
    console.log(`  FALHA ${label}: ${String(e.message).slice(0, 100)}`);
    return page;
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', locale: 'en-US' });
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', locale: 'en-US', isMobile: true });

  for (const l of lojas) {
    console.log(`\n== ${l.slug}`);
    const pDesktopHome = await shot(desktop, l.home, path.join(OUT, `${l.slug}-home-desktop.jpg`), 'home desktop');
    await shot(mobile, l.home, path.join(OUT, `${l.slug}-home-mobile.jpg`), 'home mobile');

    let pdpUrl = l.pdp;
    if (!pdpUrl) {
      // SAVID: descobrir link do produto navegando pelo menu
      try {
        const link = await pDesktopHome.locator('a', { hasText: /shirt/i }).first();
        pdpUrl = await link.getAttribute('href');
        if (pdpUrl && pdpUrl.startsWith('/')) pdpUrl = new URL(pdpUrl, l.home).toString();
      } catch (e) {}
    }
    await pDesktopHome.close();

    if (pdpUrl) {
      console.log(`  pdp: ${pdpUrl}`);
      await shot(desktop, pdpUrl, path.join(OUT, `${l.slug}-pdp-desktop.jpg`), 'pdp desktop');
      await shot(mobile, pdpUrl, path.join(OUT, `${l.slug}-pdp-mobile.jpg`), 'pdp mobile');
    } else {
      console.log('  sem PDP identificada');
    }
  }

  await browser.close();
  console.log('\nCapturas em:', OUT);
})();
