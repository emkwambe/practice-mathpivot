// Render one sample of every math6 SVG helper into m6_svg_gallery.html
import { writeFileSync } from 'fs'
import {
  inequalityLineSvg, hopModelSvg, prismNetSvg,
  triangleNetSvg, dotPlotSvg, singleBoxPlotSvg,
} from './src/lib/problems/math6/svg'

const cells: [string, string][] = [
  ['inequality gt (open, right)', inequalityLineSvg('gt', 6)],
  ['inequality le (closed, left)', inequalityLineSvg('le', 5)],
  ['inequality ge (closed, right)', inequalityLineSvg('ge', 7)],
  ['inequality lt (open, left)', inequalityLineSvg('lt', 4)],
  ['hop model 4 + (-7)', hopModelSvg([4, -7])],
  ['hop model 5 + (-6)', hopModelSvg([5, -6])],
  ['prism net 8x3x2 ft', prismNetSvg(8, 3, 2, 'ft')],
  ['square prism net 4x2x2 m', prismNetSvg(4, 2, 2, 'm')],
  ['cube net 3x3x3 cm', prismNetSvg(3, 3, 3, 'cm')],
  ['triangle net 12x10 cm', triangleNetSvg(12, 10, 'cm')],
  ['dot plot', dotPlotSvg('Hours Worked', 'Hours', [0, 1, 2, 1, 3, 4, 4, 2, 3], 0)],
  ['single box plot', singleBoxPlotSvg({ min: 62, q1: 74, med: 84, q3: 92, max: 100 }, 60, 100)],
]

const html = `<!doctype html><html><body style="background:#111;color:#fff;font-family:sans-serif;display:grid;grid-template-columns:repeat(3,360px);gap:24px;padding:24px">
${cells.map(([t, s]) => `<div><div style="font-size:13px;opacity:.7;margin-bottom:6px">${t}</div>${s}</div>`).join('\n')}
</body></html>`
writeFileSync('m6_svg_gallery.html', html)
console.log('wrote m6_svg_gallery.html')
