const path = require('path');
const puppeteer = require('puppeteer');

module.exports = (options) => {
  const config = require('./getConfig')(options.config);
  const tasks = require('./getTasks')(config);
  const enableOutput = !options.silent;

  let errors = [];

  let puppeteerOptions = Object.assign({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }, config.puppeteer || {});

  (async () => {
    const browser = await puppeteer.launch(puppeteerOptions);
    const page = await browser.newPage();
    page.on('error', err=> {
      console.log('error happen at the page: ', err);
    });

    page.on('pageerror', pageerr=> {
      console.log('pageerror occurred: ', pageerr);
    });
    await Promise.all(
      tasks.map(async ({filePath, url}) => {
        await page.goto(url);
        try {
          await require(path.resolve(filePath))(page);
          enableOutput && console.log(`✅ ${filePath} on ${url}`);
        } catch (e) {
          enableOutput && console.error(`❌ ${filePath} on ${url}`);
          errors.push(e);
        }
      })
    );
    await browser.close();
    if (errors.length) {
      enableOutput && errors.forEach((e) => console.error(e));
      process.exit(1);
    }
  })();
};
