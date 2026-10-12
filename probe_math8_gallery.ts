// Render one sample of every math8 SVG helper into m8_svg_gallery.html
import { writeFileSync } from 'fs'
import {
  scatterplotSvg, polygonPlaneSvg, paramPlotSvg,
  transversalSvg, exteriorAngleSvg, qualitativeGraphSvg,
} from './src/lib/problems/math8/svg'
import { mulberry32 } from './src/lib/problems/math1/rng'

const rng = mulberry32(42)
const scatter = (kind: 'pos' | 'neg' | 'none'): [number, number][] => {
  const pts: [number, number][] = []
  const used = new Set<string>()
  while (pts.length < 12) {
    const x = Math.floor(rng() * 11) - 5
    const y = kind === 'pos'
      ? Math.max(-5, Math.min(5, Math.round(x + (rng() * 4 - 2))))
      : kind === 'neg'
        ? Math.max(-5, Math.min(5, Math.round(-x + (rng() * 4 - 2))))
        : Math.floor(rng() * 11) - 5
    const key = `${x},${y}`
    if (!used.has(key)) { used.add(key); pts.push([x, y]) }
  }
  return pts
}

const cells: [string, string][] = [
  ['scatter pos', scatterplotSvg(scatter('pos'))],
  ['scatter neg', scatterplotSvg(scatter('neg'))],
  ['scatter none', scatterplotSvg(scatter('none'))],
  ['polygon plane', polygonPlaneSvg([
    { label: 'P', x: -3, y: -4 }, { label: 'Q', x: -5, y: 4 }, { label: 'R', x: 2, y: -2 },
  ])],
  ['paramPlot circle', paramPlotSvg((t) => 3 * Math.cos(t), (t) => 3 * Math.sin(t), 0, 2 * Math.PI)],
  ['paramPlot sideways parabola', paramPlotSvg((t) => (t * t) / 2 - 2, (t) => t, -4, 4)],
  ['transversal', transversalSvg('(2x + 8)°', '(4x − 126)°')],
  ['exteriorAngle', exteriorAngleSvg('(4x + 15)°', '(2x + 6)°', '(8x − 9)°')],
  ['qualitative good', qualitativeGraphSvg([[0, 0], [1.5, 3], [3, 3], [6, 5]])],
]

const html = `<!doctype html><html><body style="background:#111;color:#fff;font-family:sans-serif;display:grid;grid-template-columns:repeat(3,340px);gap:24px;padding:24px">
${cells.map(([t, s]) => `<div><div style="font-size:13px;opacity:.7;margin-bottom:6px">${t}</div>${s}</div>`).join('\n')}
</body></html>`
writeFileSync('m8_svg_gallery.html', html)
console.log('wrote m8_svg_gallery.html')
