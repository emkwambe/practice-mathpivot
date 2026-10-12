// Render one sample of every math7 SVG helper into m7_svg_gallery.html
import { writeFileSync } from 'fs'
import {
  boxPlotSvg, lineGraphSvg, angleSplitSvg, perpendicularSvg,
  spinnerSvg, sectorSvg, rectAngleSvg, prismSvg,
} from './src/lib/problems/math7/svg'

const cells: [string, string][] = [
  ['boxPlot', boxPlotSvg({ label: 'Class A', min: 2, q1: 5, med: 7, q3: 9, max: 12 }, { label: 'Class B', min: 4, q1: 6, med: 8, q3: 10, max: 14 })],
  ['lineGraph (marked)', lineGraphSvg({ xLabel: 'w', yLabel: 'S', xMax: 10, yMax: 40, mark: { x: 4, y: 16 } })],
  ['angleSplit', angleSplitSvg('x°', '(3x + 10)°')],
  ['perpendicular', perpendicularSvg('½(x + 12)°')],
  ['spinner colors', spinnerSvg(['Red', 'Blue', 'Green', 'Yellow'])],
  ['spinner numbers', spinnerSvg(['1', '2', '3', '4', '5', '6'])],
  ['sector', sectorSvg(90, 'r = 8')],
  ['rectAngle', rectAngleSvg({ a: '25°', b: '22°', target: '?°' })],
  ['prism', prismSvg('8 cm', '5 cm', '3 cm')],
]

const html = `<!doctype html><html><body style="background:#111;color:#fff;font-family:sans-serif;display:grid;grid-template-columns:repeat(3,340px);gap:24px;padding:24px">
${cells.map(([t, s]) => `<div><div style="font-size:13px;opacity:.7;margin-bottom:6px">${t}</div>${s}</div>`).join('\n')}
</body></html>`
writeFileSync('m7_svg_gallery.html', html)
console.log('wrote m7_svg_gallery.html')
