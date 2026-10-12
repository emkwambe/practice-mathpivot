/* Probe v2: verify the CORRECT choice is accepted (via Correct-stat increment)
 * and capture a real dot-pattern item. */
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
  await page.setViewport({ width: 1280, height: 1000 })

  const clickBtn = (text) =>
    page.evaluate((t) => {
      const btn = [...document.querySelectorAll('button')].find((b) => b.innerText.includes(t))
      if (btn) { btn.click(); return true }
      return false
    }, text)

  const correctCount = () =>
    page.evaluate(() => {
      const m = document.body.innerText.match(/(\d+)\s*\n?\s*Correct/)
      return m ? parseInt(m[1]) : -1
    })

  await page.goto('http://localhost:3000/generator', { waitUntil: 'networkidle2', timeout: 30000 })
  await sleep(800)
  await page.select('select[aria-label="Course"]', 'math1-eoc')
  await sleep(600)

  // ── Inequality graph: click choices until Correct stat increments ──
  await clickBtn('Linear Equations')
  await sleep(400)
  let found = false
  for (let i = 0; i < 60 && !found; i++) {
    await clickBtn('Generate Problem')
    await sleep(600)
    found = await page.evaluate(() => !!document.querySelector('svg[aria-label="graph"]'))
  }
  console.log('graph item found:', found)
  if (found) {
    const before = await correctCount()
    let verdict = 'no choice accepted'
    for (const letter of ['A', 'B', 'C', 'D']) {
      await page.evaluate((L) => {
        const card = [...document.querySelectorAll('button')].find(
          (b) => b.querySelector('svg[aria-label="graph"]') && b.querySelector('span')?.innerText?.trim() === L
        )
        card?.click()
      }, letter)
      await sleep(800)
      const after = await correctCount()
      if (after === before + 1) { verdict = `${letter} accepted as CORRECT (stats ${before} -> ${after})`; break }
      await clickBtn('Try Again')
      await sleep(500)
    }
    console.log('verdict:', verdict)
    await page.screenshot({ path: 'probe_graph_correct.png' })
  }

  // ── Dot pattern: detect via aria-label ──
  await clickBtn('Functions')
  await sleep(400)
  let dots = false
  for (let i = 0; i < 60 && !dots; i++) {
    await clickBtn('Generate Problem')
    await sleep(600)
    dots = await page.evaluate(() => !!document.querySelector('svg[aria-label="dot pattern figures 1 to 3"]'))
  }
  console.log('dot-pattern item found:', dots)
  if (dots) await page.screenshot({ path: 'probe_dot_item.png' })

  await browser.close()
})().catch((e) => { console.error('FAILED:', e); process.exit(1) })
