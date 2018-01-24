const path = require('path');
const puppeteer = require('puppeteer');
const Queue = require('promise-queue');

module.exports = (options) => {
  const config = require('./getConfig')(options.config);
  const tasks = require('./getTasks')(config);
  const enableOutput = !options.silent;

  let errors = [];

  let puppeteerOptions = Object.assign({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }, config.puppeteer || {});

  const maxConcurrent = config.concurrent || 5;
  const maxQueue = Infinity;

  const queue = new Queue(maxConcurrent, maxQueue);

  (async () => {
    const browser = await puppeteer.launch(puppeteerOptions);

    await Promise.all(
      tasks.map(
        async ({filePath, url}) => {
          await queue.add(async () => {
            const page = await browser.newPage();
            page.on('error', err=> {
              console.log(`⚠️  ${filePath} on ${url} error happen at the page: `, err);
            });

            page.on('pageerror', pageerr=> {
              console.log(`⚠️  ${filePath} on ${url} pageerror occurred: `, pageerr);
            });
            try {
              await page.goto(url, {timeout: 60 * 1000, waitUntil: 'domcontentloaded'});
              await require(path.resolve(filePath))(page);
              enableOutput && console.log(`✅  ${filePath} on ${url}`);
            } catch (e) {
              enableOutput && console.error(`❌  ${filePath} on ${url}`);
              enableOutput && console.error(e);
              errors.push(e);
            }
            await page.close();
          });
        }
      )
    );
    await browser.close();
    if (errors.length) {
      process.exit(1);
    }
  })();
};
