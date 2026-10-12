/* Reproduce the long-text MC choice overflow on Statistics and inspect layout. */
const path = require('path')
const puppeteer = require(path.join(
  process.env.APPDATA,
  'npm/node_modules/pa11y/node_modules/puppeteer-core'
))

const BASE = 'http://localhost:3000'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'shell',
    args: ['--no-sandbox', '--disable-gpu'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })

  await page.goto(BASE + '/generator', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  await page.select('select[aria-label="Course"]', 'math3-eoc')
  await sleep(600)
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.trim() === 'Statistics')
    btn?.click()
  })
  await sleep(500)

  let inspected = false
  for (let i = 0; i < 25 && !inspected; i++) {
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.includes('Generate Problem'))
      btn?.click()
    })
    await sleep(900)
    const info = await page.evaluate(() => {
      // find MC choice cards: buttons whose first span text is a letter A-D
      const cards = [...document.querySelectorAll('button')].filter((b) =>
        /^[ABCD]$/.test(b.querySelector('span')?.innerText?.trim() || '')
      )
      if (cards.length < 4) return null
      const long = cards.filter((c) => (c.innerText || '').length > 60)
      if (long.length === 0) return null
      return long.slice(0, 2).map((c) => {
        const r = c.getBoundingClientRect()
        const span = c.querySelector('span:last-child')
        const sr = span?.getBoundingClientRect()
        const cs = getComputedStyle(span || c)
        return {
          cardW: Math.round(r.width),
          spanW: sr ? Math.round(sr.width) : null,
          spanScrollW: span ? span.scrollWidth : null,
          whiteSpace: cs.whiteSpace,
          overflowWrap: cs.overflowWrap,
          display: cs.display,
          text: (c.innerText || '').slice(0, 50),
        }
      })
    })
    if (info) {
      inspected = true
      console.log(JSON.stringify(info, null, 2))
      await page.screenshot({ path: 'm3_overflow_debug.png' })
    }
  }
  if (!inspected) console.log('no long-text MC found in 25 tries')
  await browser.close()
})().catch((e) => {
  console.error('SCRIPT FAILED:', e)
  process.exit(1)
})
