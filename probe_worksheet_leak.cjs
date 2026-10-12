/* Probe: find raw LaTeX leak source on Worksheets page for M1 EOC */
const path = require('path')
const puppeteer = require(path.join(
  process.env.APPDATA,
  'npm/node_modules/pa11y/node_modules/puppeteer-core'
))
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

;(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'shell', args: ['--no-sandbox', '--disable-gpu'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push('[console] ' + m.text().slice(0, 300)) })

  await page.goto('http://localhost:3000/worksheets', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  await page.evaluate(() => { [...document.querySelectorAll('button')].find((b) => b.innerText.includes('M1 EOC'))?.click() })
  await sleep(400)
  await page.evaluate(() => { [...document.querySelectorAll('button')].find((b) => b.innerText.includes('Generate'))?.click() })
  await sleep(2500)

  const leak = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const hits = []
    let node
    while ((node = walker.nextNode())) {
      const t = node.textContent || ''
      if (t.includes('\\text{') || t.includes('rac{') || t.includes('\\frac') || t.includes('\\sqrt')) {
        const el = node.parentElement
        hits.push({
          text: t.slice(0, 120),
          cls: (el?.className || '').toString().slice(0, 80),
          ancestor: (el?.closest('[class]')?.className || '').toString().slice(0, 100),
        })
      }
    }
    return hits.slice(0, 20)
  })
  console.log('LEAK NODES:', JSON.stringify(leak, null, 2))
  console.log('ERRORS:', errors.length ? errors.slice(0, 10) : 'none')
  await browser.close()
})().catch((e) => { console.error('FAILED:', e); process.exit(1) })
