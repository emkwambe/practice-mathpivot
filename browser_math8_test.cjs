/* Headless test for the Math 8 EOG subject:
 * Generator MC/GR/VIS flows, Practice session, Worksheets with choices.
 * Also screenshots visual (SVG) items for manual rendering review.
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

  // Course picker is a native <select aria-label="Course"> — pick by course id
  const selectCourse = async (courseId) => {
    try {
      const selected = await page.select('select[aria-label="Course"]', courseId)
      return selected.includes(courseId)
    } catch {
      return false
    }
  }

  // Visible-text leak check: ignore KaTeX's visually-hidden MathML accessibility layer
  const LEAK_PATTERNS = ['\\text{', 'rac{', '\\begin', '\\frac', '\\sqrt']
  const visibleLeak = () =>
    page.evaluate((pats) => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      let node
      while ((node = walker.nextNode())) {
        if (node.parentElement?.closest('.katex-mathml')) continue
        const t = node.textContent || ''
        if (pats.some((p) => t.includes(p))) return true
      }
      return false
    }, LEAK_PATTERNS)

  // ── 1. Generator: M8 EOG subject ───────────────────────
  await page.goto(BASE + '/generator', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  const clickedSubject = await selectCourse('math8-eog')
  await sleep(600)
  const techButtons = await page.$$eval('button', (bs) => bs.map((b) => b.innerText).filter((t) => /Functions|Expressions|Geometry|Statistics|Number|Mixed/.test(t)).length)

  // generate problems to hit MC / GR / VIS item types; screenshot VIS items
  let mcSeen = 0, grSeen = 0, visSeen = 0, rawLeak = false
  let shots = 0
  for (let i = 0; i < 40 && (shots < 5 || i < 14); i++) {
    await clickButtonWithText('Generate Problem')
    await sleep(700)
    const info = await page.evaluate(() => {
      const choiceCards = [...document.querySelectorAll('button')].filter((b) => /^[ABCD]$/.test(b.querySelector('span')?.innerText?.trim() || '')).length
      const grInput = !!document.querySelector('#answer-input')
      const hasSvg = !!document.querySelector('main svg, [class*=problem] svg, svg')
      return {
        isMC: choiceCards >= 4,
        isGR: grInput,
        hasKatex: !!document.querySelector('.katex'),
        hasSvg,
      }
    })
    if (info.isMC) mcSeen++
    else if (info.isGR) grSeen++
    if (info.hasSvg) {
      visSeen++
      if (shots < 5) {
        shots++
        await page.screenshot({ path: `m8_vis_${shots}.png` })
      }
    }
    if (await visibleLeak()) rawLeak = true
  }
  console.log(`generator subject click: ${clickedSubject} | technique buttons: ${techButtons}`)
  console.log(`generator items: MC=${mcSeen} GR=${grSeen} VIS=${visSeen} rawLeak=${rawLeak} screenshots=${shots}`)

  // ── 2. MC click-to-answer produces feedback ────────────
  let mcFeedback = 'n/a'
  for (let i = 0; i < 10 && mcFeedback === 'n/a'; i++) {
    await clickButtonWithText('Generate Problem')
    await sleep(700)
    const isMC = await page.evaluate(() => {
      return [...document.querySelectorAll('button')].filter((b) => /^[ABCD]$/.test(b.querySelector('span')?.innerText?.trim() || '')).length >= 4
    })
    if (isMC) {
      await page.evaluate(() => {
        const card = [...document.querySelectorAll('button')].find((b) => b.querySelector('span')?.innerText?.trim() === 'A')
        card?.click()
      })
      await sleep(800)
      mcFeedback = await page.evaluate(() => {
        const text = document.body.innerText
        return /correct|incorrect|try again|solution/i.test(text) ? 'feedback shown' : 'NO FEEDBACK'
      })
    }
  }
  console.log(`MC click feedback: ${mcFeedback}`)

  // ── 3. Practice setup + session ────────────────────────
  await page.goto(BASE + '/practice', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  const setupOk = await page.evaluate(() => !!document.querySelector('select[aria-label="Course"] option[value="math8-eog"]'))
  if (setupOk) {
    await selectCourse('math8-eog')
    await sleep(600)
    const setupTechs = await page.evaluate(() => {
      const text = document.body.innerText.toLowerCase()
      return ['functions', 'expressions', 'statistics'].filter((s) => text.includes(s)).length
    })
    console.log(`practice setup: Math 8 EOG course ✓ | technique cards: ${setupTechs}`)
    await clickButtonWithText('Start')
    await sleep(2500)
    const session = await page.evaluate(() => {
      const choiceCards = [...document.querySelectorAll('button')].filter((b) => /^[ABCD]$/.test(b.querySelector('span')?.innerText?.trim() || '')).length
      return {
        problemShown: !!document.querySelector('.katex'),
        mcCards: choiceCards,
      }
    })
    const sessionLeak = await visibleLeak()
    console.log('practice session:', JSON.stringify({ ...session, rawLeak: sessionLeak }))
  } else {
    console.log('practice setup: Math 8 EOG course MISSING')
  }

  // ── 4. Worksheets page ─────────────────────────────────
  await page.goto(BASE + '/worksheets', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  const wsSubject = await selectCourse('math8-eog')
  await sleep(600)
  await clickButtonWithText('Generate')
  await sleep(2000)
  const ws = await page.evaluate(() => {
    const text = document.body.innerText
    return {
      header: text.includes('Math 8 EOG Practice Worksheet'),
      katexCount: document.querySelectorAll('.katex').length,
      hasChoiceLetters: /A\./.test(text) && /B\./.test(text),
    }
  })
  const wsLeak = await visibleLeak()
  console.log(`worksheets: subject click ${wsSubject} |`, JSON.stringify({ ...ws, rawLeak: wsLeak }))

  console.log('--- errors captured ---')
  if (errors.length === 0) console.log('none')
  else errors.slice(0, 15).forEach((e) => console.log(e))

  await browser.close()
})().catch((e) => {
  console.error('SCRIPT FAILED:', e)
  process.exit(1)
})
