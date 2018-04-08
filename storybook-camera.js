const puppeteer = require('puppeteer');
const connect = require('connect');
const serveStatic = require('serve-static');
const fs = require('fs');
const del = require('del');
const config = JSON.parse(fs.readFileSync('./storybook-camera.json', 'utf8'));
const HOST = `http://localhost${config.port}`;

console.log(`Remove ${config.outdir} if exists`)
del.sync([config.outdir]);
console.log(`Create ${config.outdir} directory`)
fs.mkdirSync(config.outdir)

console.log('Start storybook server');
const app = connect();
app.use(serveStatic(config.storydir));
server = app.listen(config.port);

(async () => {
  console.log('Open browser')
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const kind of Object.keys(config.storiesByKind)) {
    console.log(`--------- ${kind} ----------`)
    for (const story of config.storiesByKind[kind]) {
      page.setViewport({width: story.width || config.viewport.width || 1, height: story.height || config.viewport.height || 1})
      const res = await page.goto(`${HOST}/iframe.html?selectedKind=${kind}&selectedStory=${story.story}`, {waitUntil: 'networkidle0'})
      const status = res.status()
      if (status < 400) {
        await page.screenshot({
          path: `${config.outdir}/${kind}-${story.title || story.story}.png`, fullPage: true
        })
      }
      console.log(`  >>> ${status}: ${story.title || story.story}`)
    }
  }

  console.log('Close browser');
  await browser.close();

  console.log('Stop storybook server');
  server.close();
})();
