/* Probe Math 3 VIS factories: for each technique with visual items,
 * generate until an inline SVG (polyline/circle/rect — our svg.ts output,
 * not lucide icons) appears in the problem area, then screenshot.
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
  { technique: 'Exponentials & Logs', file: 'm3_svg_exp.png' },
  { technique: 'Functions & Transformations', file: 'm3_svg_func.png' },
  { technique: 'Geometry', file: 'm3_svg_geo.png' },
  { technique: 'Statistics', file: 'm3_svg_stats.png' },
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
      return svgs.some((s) => s.innerHTML.includes('<polyline') || s.innerHTML.includes('<circle') || s.innerHTML.includes('<rect'))
    })

  for (const t of TARGETS) {
    // click the technique pill
    const clicked = await page.evaluate((name) => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.trim().startsWith(name.split(' ')[0]) && b.innerText.includes(name.split(' ')[0]))
      if (btn) { btn.click(); return true }
      return false
    }, t.technique)
    await sleep(500)
    let found = false
    for (let i = 0; i < 30 && !found; i++) {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.includes('Generate Problem'))
        btn?.click()
      })
      await sleep(600)
      found = await hasRealSvg()
    }
    if (found) {
      await page.screenshot({ path: t.file })
      console.log(`${t.technique}: VIS found -> ${t.file} (technique click: ${clicked})`)
    } else {
      console.log(`${t.technique}: NO VIS in 30 tries (technique click: ${clicked})`)
    }
  }

  console.log('pageerrors:', errors.length === 0 ? 'none' : errors.join(' | '))
  await browser.close()
})().catch((e) => {
  console.error('SCRIPT FAILED:', e)
  process.exit(1)
})
