/* Strict Math 3 VIS probe: our svg.ts output has many child elements
 * (grid lines, points, bars); lucide icons have <= 4. Screenshot each target.
 */
const path = require('path')
const puppeteer = require(path.join(
  process.env.APPDATA,
  'npm/node_modules/pa11y/node_modules/puppeteer-core'
))

const BASE = 'http://localhost:3000'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const TARGETS = [
  { technique: 'Functions & Transformations', file: 'm3_vis_func_strict.png' },
  { technique: 'Geometry', file: 'm3_vis_geo_strict.png' },
]

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'shell',
    args: ['--no-sandbox', '--disable-gpu'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  const errors = []
  page.on('pageerror', (err) => errors.push(String(err).slice(0, 200)))

  await page.goto(BASE + '/generator', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  await page.select('select[aria-label="Course"]', 'math3-eoc')
  await sleep(600)

  const hasRealSvg = () =>
    page.evaluate(() => {
      const svgs = [...document.querySelectorAll('svg')]
      return svgs.some((s) => s.querySelectorAll('*').length > 8)
    })

  for (const t of TARGETS) {
    await page.evaluate((name) => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.trim().startsWith(name.split(' ')[0]))
      btn?.click()
    }, t.technique)
    await sleep(500)
    let found = false
    for (let i = 0; i < 40 && !found; i++) {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.includes('Generate Problem'))
        btn?.click()
      })
      await sleep(600)
      found = await hasRealSvg()
    }
    if (found) {
      await page.screenshot({ path: t.file })
      console.log(`${t.technique}: VIS found -> ${t.file}`)
    } else {
      console.log(`${t.technique}: NO VIS in 40 tries`)
    }
  }
  console.log('pageerrors:', errors.length === 0 ? 'none' : errors.join(' | '))
  await browser.close()
})().catch((e) => {
  console.error('SCRIPT FAILED:', e)
  process.exit(1)
})
