/* Headless test for the new Differential Equations subject:
 * Generator flow, palette suggested tab, Learn page, Practice setup, Worksheets.
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

  const clickButtonWithText = (text) =>
    page.evaluate((t) => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.includes(t))
      if (btn) { btn.click(); return true }
      return false
    }, text)

  // ── 1. Generator: y′ DiffEq subject ────────────────────
  await page.goto(BASE + '/generator', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  const clickedSubject = await clickButtonWithText('y′ DiffEq')
  await sleep(400)
  const techButtons = await page.$$eval('button', (bs) => bs.map((b) => b.innerText).filter((t) => /Separable|Linear First|Homogeneous|Exact|Second-Order|Undetermined|Variation|Laplace/.test(t)).length)
  await clickButtonWithText('Generate Problem')
  await sleep(1500)
  const gen = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      hasKatex: !!document.querySelector('.katex'),
      rawLeak: text.includes('\\text{') || text.includes('\\frac') || text.includes('rac{'),
      paletteButtons: document.querySelectorAll('button[aria-label] .katex').length,
      eMinusButton: !!document.querySelector('button[aria-label="e to the minus x"]'),
      diffEqShown: /dy|y′|y'|initial value|particular|transform|exact|solution/i.test(text),
    }
  })
  console.log(`generator subject click: ${clickedSubject} | technique buttons: ${techButtons}`)
  console.log('generator diffeq:', JSON.stringify(gen))

  // ── 2. Palette insert on new subject ───────────────────
  const inputSel = '#answer-input'
  if (await page.$(inputSel)) {
    await page.click(inputSel)
    await page.click('button[aria-label="e to the minus x"]')
    const val = await page.$eval(inputSel, (el) => el.value)
    console.log(`palette e^-x insert: "${val}" (expect "e^{-x}")`)
  } else {
    console.log('palette insert: SKIPPED (no answer input found)')
  }

  // ── 3. Learn page: Differential Equations guide ────────
  await page.goto(BASE + '/learn', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  await clickButtonWithText('y′ DiffEq')
  await sleep(1200)
  const learn = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      title: /Differential Equations Guide/.test(text),
      sections: ['Separable Equations', 'Linear First-Order', 'Homogeneous Equations', 'Exact Equations', 'Second-Order Constant Coefficients', 'Undetermined Coefficients', 'Variation of Parameters', 'Laplace Transforms'].filter((s) => text.includes(s)).length,
      katexCount: document.querySelectorAll('.katex').length,
    }
  })
  console.log('learn diffeq:', JSON.stringify(learn))

  // ── 4. Practice setup screen ───────────────────────────
  await page.goto(BASE + '/practice', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  const setup = await page.evaluate(() => {
    const text = document.body.innerText
    return { diffeqButton: text.includes('y′ DiffEq') }
  })
  if (setup.diffeqButton) {
    await clickButtonWithText('y′ DiffEq')
    await sleep(600)
    const setupTechs = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase()
      return ['separable', 'linear first', 'laplace'].filter((s) => text.includes(s)).length
    })
    console.log(`practice setup: diffeq button ✓ | technique cards visible: ${setupTechs}`)
    await clickButtonWithText('Start')
    await sleep(2000)
    const session = await page.evaluate(() => {
      const text = document.body.innerText
      return {
        problemShown: !!document.querySelector('.katex'),
        rawLeak: text.includes('\\text{') || text.includes('rac{'),
        palette: text.includes('Math Palette'),
        eMinusButton: !!document.querySelector('button[aria-label="e to the minus x"]'),
      }
    })
    console.log('practice session:', JSON.stringify(session))
  } else {
    console.log('practice setup: diffeq button MISSING')
  }

  // ── 5. Worksheets page ─────────────────────────────────
  await page.goto(BASE + '/worksheets', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  const wsSubject = await clickButtonWithText('y′ DiffEq')
  await sleep(400)
  await clickButtonWithText('Generate')
  await sleep(1500)
  const ws = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      header: text.includes('Differential Equations Practice Worksheet'),
      katexCount: document.querySelectorAll('.katex').length,
      rawLeak: text.includes('\\text{') || text.includes('rac{'),
    }
  })
  console.log(`worksheets: subject click ${wsSubject} |`, JSON.stringify(ws))

  console.log('--- errors captured ---')
  if (errors.length === 0) console.log('none')
  else errors.slice(0, 15).forEach((e) => console.log(e))

  await browser.close()
})().catch((e) => {
  console.error('SCRIPT FAILED:', e)
  process.exit(1)
})
