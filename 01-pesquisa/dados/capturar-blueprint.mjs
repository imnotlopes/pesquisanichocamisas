import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'C:\\Users\\Familia\\Desktop\\Pesquisa de Mercado\\Pesquisa Camisas Sociais Performance\\01-pesquisa\\capturas-blueprint';
fs.mkdirSync(OUT, { recursive: true });
const PAGINAS = 'C:\\Users\\Familia\\Desktop\\Pesquisa de Mercado\\Pesquisa Camisas Sociais Performance\\01-pesquisa\\paginas';

async function shot(context, url, file) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 82 });
  console.log('OK', file);
  await page.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const desktop = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });

  const home = 'file:///' + path.join(PAGINAS, 'mockup-home.html').replace(/\\/g, '/');
  const pdp = 'file:///' + path.join(PAGINAS, 'mockup-pdp.html').replace(/\\/g, '/');

  await shot(desktop, home, path.join(OUT, 'athlos-home-desktop.jpg'));
  await shot(mobile, home, path.join(OUT, 'athlos-home-mobile.jpg'));
  await shot(desktop, pdp, path.join(OUT, 'athlos-pdp-desktop.jpg'));
  await shot(mobile, pdp, path.join(OUT, 'athlos-pdp-mobile.jpg'));

  await browser.close();
})();
