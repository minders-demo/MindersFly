import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' }).catch(e => console.log('GOTO ERR:', e.message));
  await new Promise(r => setTimeout(r, 4000));
  console.log('Title:', await page.title());
  console.log('Body:', await page.evaluate(() => document.body.innerHTML.substring(0, 500)));
  await browser.close();
})();
