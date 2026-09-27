const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({ locale: 'en-US', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36' });
  const pg = await ctx.newPage();
  for (const p of ['nimblemade', 'buffery.us']) {
    try {
      await pg.goto('https://www.facebook.com/' + p, { waitUntil: 'domcontentloaded', timeout: 40000 });
      await pg.waitForTimeout(4000);
      const html = await pg.content();
      const ids = [...new Set((html.match(/"(?:pageID|page_id|delegate_page_id|userID|profile_owner|associated_page_id)":"?(\d{6,})/g) || []))].slice(0, 10);
      console.log(p, pg.url(), html.length, ids, (html.match(/<title>[^<]*/) || [''])[0]);
    } catch (e) { console.log(p, 'erro', e.message.slice(0, 100)); }
  }
  // typeahead da Biblioteca
  for (const q of ['Nimble Made', 'Buffery']) {
    try {
      await pg.goto('https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&media_type=all', { waitUntil: 'domcontentloaded', timeout: 40000 });
      await pg.waitForTimeout(4000);
      const inp = pg.locator('input[type="search"], input[placeholder*="Search"]').first();
      await inp.click({ timeout: 10000 }); await inp.type(q, { delay: 80 }); await pg.waitForTimeout(5000);
      const txt = await pg.evaluate(() => [...document.querySelectorAll('[role="option"], li[role="option"], div[role="listbox"] *')].map(e => e.innerText).filter(Boolean).slice(0, 20));
      const links = await pg.evaluate(() => [...document.querySelectorAll('a[href*="view_all_page_id"]')].map(a => a.href));
      console.log('TYPEAHEAD', q, JSON.stringify([...new Set(txt)].slice(0, 12)), links.slice(0, 5));
      await pg.screenshot({ path: 'typeahead-' + q.replace(/\s/g, '') + '.png' });
    } catch (e) { console.log('typeahead', q, 'erro', e.message.slice(0, 120)); }
  }
  await b.close();
})();
