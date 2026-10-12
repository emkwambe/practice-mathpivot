/* Headless test for the new Applications of Integration subject:
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

  // ── 1. Generator: ∫ Applications subject ───────────────
  await page.goto(BASE + '/generator', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  const clickedSubject = await clickButtonWithText('∫ Applications')
  await sleep(400)
  const techButtons = await page.$$eval('button', (bs) => bs.map((b) => b.innerText).filter((t) => /Area Between|Volumes|Arc Length|Surface Area|Work|Center of Mass|Averages/.test(t)).length)
  await clickButtonWithText('Generate Problem')
  await sleep(1500)
  const gen = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      hasKatex: !!document.querySelector('.katex'),
      rawLeak: text.includes('\\text{') || text.includes('\\frac') || text.includes('rac{'),
      paletteButtons: document.querySelectorAll('button[aria-label] .katex').length,
      defIntButton: !!document.querySelector('button[aria-label="definite integral"]'),
      wordProblemShown: /region|curve|revolved|axis|arc|spring|tank|cable|centroid|lamina|dice|average|probability|density|rotating|washer|shell|cone|chain|bucket/i.test(text),
    }
  })
  console.log(`generator subject click: ${clickedSubject} | technique buttons: ${techButtons}`)
  console.log('generator applications:', JSON.stringify(gen))

  // ── 2. Palette insert on new subject ───────────────────
  const inputSel = '#answer-input'
  if (await page.$(inputSel)) {
    await page.click(inputSel)
    await page.click('button[aria-label="definite integral"]')
    const val = await page.$eval(inputSel, (el) => el.value)
    console.log(`palette definite-integral insert: "${val}" (expect "\\int_{}^{} ")`)
  } else {
    console.log('palette insert: SKIPPED (no answer input found)')
  }

  // ── 3. Learn page: Applications of Integration guide ───
  await page.goto(BASE + '/learn', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  await clickButtonWithText('∫ Applications')
  await sleep(1200)
  const learn = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      title: /Applications of Integration Guide/.test(text),
      sections: ['Area Between Curves', 'Volumes of Revolution', 'Arc Length', 'Surface Area of Revolution', 'Work & Physics', 'Center of Mass & Centroids', 'Average Value & Probability'].filter((s) => text.includes(s)).length,
      katexCount: document.querySelectorAll('.katex').length,
    }
  })
  console.log('learn applications:', JSON.stringify(learn))

  // ── 4. Practice setup screen ───────────────────────────
  await page.goto(BASE + '/practice', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  const setup = await page.evaluate(() => {
    const text = document.body.innerText
    return { applicationsButton: text.includes('∫ Applications') }
  })
  if (setup.applicationsButton) {
    await clickButtonWithText('∫ Applications')
    await sleep(600)
    const setupTechs = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase()
      return ['area between', 'volumes', 'arc length'].filter((s) => text.includes(s)).length
    })
    console.log(`practice setup: applications button ✓ | technique cards visible: ${setupTechs}`)
    // Start a session
    await clickButtonWithText('Start')
    await sleep(2000)
    const session = await page.evaluate(() => {
      const text = document.body.innerText
      return {
        problemShown: !!document.querySelector('.katex'),
        rawLeak: text.includes('\\text{') || text.includes('rac{'),
        palette: text.includes('Math Palette'),
        defIntButton: !!document.querySelector('button[aria-label="definite integral"]'),
      }
    })
    console.log('practice session:', JSON.stringify(session))
  } else {
    console.log('practice setup: applications button MISSING')
  }

  // ── 5. Worksheets page ─────────────────────────────────
  await page.goto(BASE + '/worksheets', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  const wsSubject = await clickButtonWithText('∫ Applications')
  await sleep(400)
  await clickButtonWithText('Generate')
  await sleep(1500)
  const ws = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      header: text.includes('Applications of Integration Practice Worksheet'),
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
