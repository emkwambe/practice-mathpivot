/* Find which visible text node leaks raw LaTeX on /generator and /worksheets for math7-eog */
const path = require('path')
const puppeteer = require(path.join(process.env.APPDATA, 'npm/node_modules/pa11y/node_modules/puppeteer-core'))
const BASE = 'http://localhost:3000'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

;(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'shell', args: ['--no-sandbox', '--disable-gpu'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })

  const clickButtonWithText = (text) =>
    page.evaluate((t) => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.includes(t))
      if (btn) { btn.click(); return true }
      return false
    }, text)

  const dumpLeaks = () =>
    page.evaluate(() => {
      const pats = ['\\text{', 'rac{', '\\begin', '\\frac', '\\sqrt']
      const out = []
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      let node
      while ((node = walker.nextNode())) {
        if (node.parentElement?.closest('.katex-mathml')) continue
        const t = node.textContent || ''
        if (pats.some((p) => t.includes(p))) {
          const el = node.parentElement
          out.push({ text: t.slice(0, 140), tag: el?.tagName, cls: (el?.className || '').toString().slice(0, 80) })
        }
      }
      return out
    })

  for (const route of ['/generator', '/worksheets']) {
    await page.goto(BASE + route, { waitUntil: 'networkidle2', timeout: 30000 })
    await sleep(800)
    await page.select('select[aria-label="Course"]', 'math7-eog')
    await sleep(600)
    for (let i = 0; i < 12; i++) {
      await clickButtonWithText(route === '/generator' ? 'Generate Problem' : 'Generate')
      await sleep(900)
      const leaks = await dumpLeaks()
      if (leaks.length) {
        console.log(`LEAKS on ${route} iter ${i}:`)
        leaks.slice(0, 6).forEach((l) => console.log(JSON.stringify(l)))
        break
      }
      if (i === 11) console.log(`${route}: no leaks in 12 iterations`)
    }
  }
  await browser.close()
})().catch((e) => { console.error('SCRIPT FAILED:', e); process.exit(1) })
