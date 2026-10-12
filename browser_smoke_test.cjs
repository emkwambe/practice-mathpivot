/* Headless browser interaction test: exercises the MathPalette end-to-end
 * on the Generator page — KaTeX labels, inserts, undo/redo, subject switch,
 * and 375px mobile overflow behavior.
 */
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

  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !msg.text().includes('404')) errors.push(`[console] ${msg.text().slice(0, 250)}`)
  })
  page.on('pageerror', (err) => errors.push(`[pageerror] ${String(err).slice(0, 250)}`))

  // ── Generator flow ──────────────────────────────────────
  await page.goto(BASE + '/generator', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)

  // Click "Generate Problem"
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.includes('Generate Problem'))
    btn?.click()
  })
  await sleep(1200)

  const paletteVisible = await page.$eval('body', (b) => b.innerText.includes('Math Palette'))
  const katexInPalette = await page.$$eval('button[aria-label] .katex', (els) => els.length)
  console.log(`palette visible: ${paletteVisible} | katex-rendered palette buttons: ${katexInPalette}`)

  // Problem KaTeX rendered (no broken raw LaTeX like "rac{" or "quad" text)
  const problemCheck = await page.evaluate(() => {
    const main = document.querySelector('.font-mono.text-\\[1\\.5rem\\]') || document.body
    const text = document.body.innerText
    return {
      hasKatex: !!document.querySelector('.katex'),
      rawFracLeak: text.includes('\\frac') || text.includes('rac{') || text.includes('quad '),
    }
  })
  console.log('problem render:', JSON.stringify(problemCheck))

  // ── Palette insert tests (integration defaults) ────────
  const inputSel = '#answer-input'
  await page.click(inputSel)

  // 1) integral button
  await page.click('button[aria-label="integral"]')
  let val = await page.$eval(inputSel, (el) => el.value)
  console.log(`after ∫ click: "${val}" (expect "\\int ")`)

  // 2) sine button → \sin() with cursor inside parens
  await page.click('button[aria-label="sine"]')
  val = await page.$eval(inputSel, (el) => el.value)
  const cursor = await page.$eval(inputSel, (el) => el.selectionStart)
  console.log(`after sin click: "${val}" cursor=${cursor} (expect "\\int \\sin()" cursor=${'\\int \\sin('.length})`)

  // 3) undo → back to "\int "
  await page.click('button[aria-label="Undo"]')
  val = await page.$eval(inputSel, (el) => el.value)
  console.log(`after undo: "${val}" (expect "\\int ")`)

  // 4) redo → back to "\int \sin()"
  await page.click('button[aria-label="Redo"]')
  val = await page.$eval(inputSel, (el) => el.value)
  console.log(`after redo: "${val}" (expect "\\int \\sin()")`)

  // 5) live preview renders
  const previewKatex = await page.evaluate(() => {
    const prev = document.querySelector('[dangerouslySetInnerHTML]') // fallback
    return !!document.querySelector('input#answer-input')?.parentElement?.querySelector('.katex')
  })
  console.log(`live preview rendered: ${previewKatex}`)

  // ── Differentiation subject switch ─────────────────────
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.includes('Differentiation'))
    btn?.click()
  })
  await sleep(400)
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.includes('Generate Problem'))
    btn?.click()
  })
  await sleep(1200)
  const diffCheck = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      hasKatex: !!document.querySelector('.katex'),
      rawLeak: text.includes('\\frac') || text.includes('rac{') || text.includes('uad '),
      partialBtn: !!document.querySelector('button[aria-label="partial by partial x"]'),
    }
  })
  console.log('differentiation render:', JSON.stringify(diffCheck))

  // ── Mobile 375px ───────────────────────────────────────
  await page.setViewport({ width: 375, height: 700 })
  await page.goto(BASE + '/generator', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.includes('Generate Problem'))
    btn?.click()
  })
  await sleep(1200)
  const mobile = await page.evaluate(() => {
    const docOverflow = document.documentElement.scrollWidth > window.innerWidth
    const row = document.querySelector('button[aria-label="integral"]')?.parentElement
    return {
      docOverflow,
      paletteRowScrollable: row ? row.scrollWidth > row.clientWidth : null,
      buttonCount: row ? row.children.length : 0,
    }
  })
  console.log('mobile 375px:', JSON.stringify(mobile))

  console.log('--- errors captured ---')
  if (errors.length === 0) console.log('none')
  else errors.slice(0, 15).forEach((e) => console.log(e))

  await browser.close()
})().catch((e) => {
  console.error('SCRIPT FAILED:', e)
  process.exit(1)
})
