/* Verify worksheet preview math is visible (black on white) after the CSS fix. */
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
  await page.setViewport({ width: 1100, height: 1000, deviceScaleFactor: 1 })

  const errors = []
  page.on('pageerror', (err) => errors.push(String(err).slice(0, 200)))

  const clickButtonWithText = (text) =>
    page.evaluate((t) => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.includes(t))
      if (btn) { btn.click(); return true }
      return false
    }, text)

  await page.goto(BASE + '/worksheets', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  await clickButtonWithText('Generate')
  await sleep(2000)

  const check = await page.evaluate(() => {
    const preview = document.querySelector('.bg-white')
    if (!preview) return { previewFound: false }
    const katexEl = preview.querySelector('.katex')
    if (!katexEl) return { previewFound: true, katexFound: false }
    const color = getComputedStyle(katexEl).color
    const rect = katexEl.getBoundingClientRect()
    return {
      previewFound: true,
      katexFound: true,
      katexColor: color,
      katexVisibleSize: rect.width > 2 && rect.height > 2,
      katexCount: preview.querySelectorAll('.katex').length,
    }
  })
  console.log('preview check:', JSON.stringify(check))

  // Screenshot the preview card for visual confirmation
  const previewEl = await page.$('.bg-white')
  if (previewEl) {
    await previewEl.screenshot({ path: 'worksheet_preview_after_fix.png' })
    console.log('screenshot saved: worksheet_preview_after_fix.png')
  }

  console.log('pageerrors:', errors.length === 0 ? 'none' : errors.join(' | '))
  await browser.close()
})().catch((e) => { console.error('SCRIPT FAILED:', e); process.exit(1) })
