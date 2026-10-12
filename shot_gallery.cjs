const path = require('path')
const puppeteer = require(path.join(process.env.APPDATA, 'npm/node_modules/pa11y/node_modules/puppeteer-core'))
;(async () => {
  const b = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'shell',
    args: ['--no-sandbox'],
  })
  const p = await b.newPage()
  await p.setViewport({ width: 1100, height: 900 })
  await p.goto('file:///C:/Users/HP/Documents/mathpivot-practice/m7_svg_gallery.html')
  await new Promise((r) => setTimeout(r, 500))
  await p.screenshot({ path: 'm7_svg_gallery.png', fullPage: true })
  await b.close()
  console.log('shot ok')
})().catch((e) => { console.error(e); process.exit(1) })
