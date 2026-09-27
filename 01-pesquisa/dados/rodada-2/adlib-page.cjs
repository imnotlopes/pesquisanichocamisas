const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ headless: true });
  const pg = await (await b.newContext({ locale: 'en-US' })).newPage();
  for (const [n, id] of [['Nimble Made', '223454095002324'], ['Buffery', '109092653951204'], ['SAVID (controle)', '1106485389219410']]) {
    for (const st of ['active', 'all']) {
      const u = `https://www.facebook.com/ads/library/?active_status=${st}&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=${id}`;
      await pg.goto(u, { waitUntil: 'domcontentloaded', timeout: 45000 }); await pg.waitForTimeout(7000);
      const t = await pg.evaluate(() => document.body.innerText);
      const m = t.match(/~?\s?[\d,]+ results?|No ads match|no ads/i);
      console.log(n, st, m ? m[0] : '(sem texto de contagem)', '|', (t.match(/Library ID/g) || []).length, 'cards');
    }
  }
  await b.close();
})();
