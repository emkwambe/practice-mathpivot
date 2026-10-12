// Inline-SVG builders for Math 8 EOG visual item types:
//  - scatterplotSvg: integer-point scatterplot (association / best-fit items)
//  - polygonPlaneSvg: labeled polygon on a 4-quadrant coordinate plane (transformations)
//  - paramPlotSvg: parametric mini-plot (function vs not-a-function curves)
//  - transversalSvg: parallel lines + transversal with expression angles
//  - exteriorAngleSvg: triangle with exterior angle, expression labels
//  - qualitativeGraphSvg: piecewise-linear story graphs (F.5)
// All SVGs use currentColor so they render white on the dark UI and black in print.

const T = (x: number, y: number, s: string | number, size = 12, anchor = 'middle', opacity = 1) =>
  `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" font-size="${size}" font-family="inherit" fill="currentColor" fill-opacity="${opacity}">${s}</text>`;

const L = (x1: number, y1: number, x2: number, y2: number, w = 1.8, dash = '', opacity = 1) =>
  `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''} stroke-opacity="${opacity}"/>`;

/** Shared 4-quadrant plane scaffold; returns svg parts + converters. */
function plane(xMin: number, xMax: number, yMin: number, yMax: number, S: number, ticks = true) {
  const X = (x: number) => ((x - xMin) / (xMax - xMin)) * S;
  const Y = (y: number) => S - ((y - yMin) / (yMax - yMin)) * S;
  let out = '';
  for (let gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx++) out += L(X(gx), 0, X(gx), S, 1, '', 0.12);
  for (let gy = Math.ceil(yMin); gy <= Math.floor(yMax); gy++) out += L(0, Y(gy), S, Y(gy), 1, '', 0.12);
  if (yMin < 0 && yMax > 0) out += L(0, Y(0), S, Y(0), 1.5, '', 0.6);
  if (xMin < 0 && xMax > 0) out += L(X(0), 0, X(0), S, 1.5, '', 0.6);
  if (ticks) {
    for (let gx = Math.ceil(xMin); gx <= Math.floor(xMax); gx++) if (gx !== 0) out += T(X(gx), Math.min(Y(0) + 13, S - 2), gx, 9.5, 'middle', 0.6);
    for (let gy = Math.ceil(yMin); gy <= Math.floor(yMax); gy++) if (gy !== 0) out += T(X(0) + (xMin < 0 ? -4 : 8), Y(gy) + 3, gy, 9.5, xMin < 0 ? 'end' : 'start', 0.6);
  }
  return { X, Y, out };
}

const wrap = (inner: string, S: number, max: number, label: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="100%" ` +
  `style="max-width:${max}px;display:block" role="img" aria-label="${label}">${inner}</svg>`;

// ── Scatterplot ──────────────────────────────────────────────────────────

export function scatterplotSvg(points: [number, number][], range = 6): string {
  const S = 220;
  const p = plane(-range, range, -range, range, S, true);
  const dots = points
    .map(([x, y]) => `<circle cx="${p.X(x).toFixed(1)}" cy="${p.Y(y).toFixed(1)}" r="3.2" fill="currentColor"/>`)
    .join('');
  return wrap(p.out + dots, S, 240, 'scatterplot');
}

// ── Labeled polygon on a coordinate plane ────────────────────────────────

export interface PlanePoint { label?: string; x: number; y: number }

export function polygonPlaneSvg(verts: PlanePoint[], opts: { range?: number; dashed?: PlanePoint[] } = {}): string {
  const range = opts.range ?? 7;
  const S = 240;
  const p = plane(-range, range, -range, range, S, true);
  let out = p.out;
  if (opts.dashed && opts.dashed.length >= 2) {
    const d = opts.dashed.map((v, i) => `${i === 0 ? 'M' : 'L'}${p.X(v.x).toFixed(1)},${p.Y(v.y).toFixed(1)}`).join(' ') + ' Z';
    out += `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="5 4" stroke-opacity="0.45"/>`;
  }
  const d = verts.map((v, i) => `${i === 0 ? 'M' : 'L'}${p.X(v.x).toFixed(1)},${p.Y(v.y).toFixed(1)}`).join(' ') + ' Z';
  out += `<path d="${d}" fill="currentColor" fill-opacity="0.12" stroke="currentColor" stroke-width="2"/>`;
  for (const v of verts) {
    out += `<circle cx="${p.X(v.x).toFixed(1)}" cy="${p.Y(v.y).toFixed(1)}" r="3.2" fill="currentColor"/>`;
    if (v.label) {
      const dx = v.x >= 0 ? 10 : -10;
      const dy = v.y >= 0 ? -6 : 14;
      out += T(p.X(v.x) + dx, p.Y(v.y) + dy, v.label, 13, 'middle');
    }
  }
  return wrap(out, S, 260, 'coordinate plane polygon');
}

// ── Parametric mini-plot (function vs not-a-function) ────────────────────

export function paramPlotSvg(
  fx: (t: number) => number,
  fy: (t: number) => number,
  tMin: number,
  tMax: number,
  range = 5,
): string {
  const S = 180;
  const p = plane(-range, range, -range, range, S, false);
  const N = 140;
  let d = '';
  let pen = false;
  for (let i = 0; i <= N; i++) {
    const t = tMin + ((tMax - tMin) * i) / N;
    const x = fx(t);
    const y = fy(t);
    if (isFinite(x) && isFinite(y) && Math.abs(x) <= range + 0.5 && Math.abs(y) <= range + 0.5) {
      d += `${pen ? ' L' : 'M'}${p.X(x).toFixed(1)},${p.Y(y).toFixed(1)}`;
      pen = true;
    } else pen = false;
  }
  return wrap(p.out + `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`, S, 190, 'graph');
}

// ── Parallel lines + transversal ─────────────────────────────────────────

export function transversalSvg(exprA: string, exprB: string): string {
  const W = 260;
  const H = 220;
  const y1 = 70;
  const y2 = 150;
  // transversal from bottom-left to top-right
  const tx = (y: number) => 60 + ((190 - y) / 160) * 110;
  let out = L(20, y1, 240, y1, 2) + L(20, y2, 240, y2, 2);
  out += L(tx(190), 190, tx(30), 30, 2);
  // angle arcs: above top line right of transversal; below bottom line left of transversal
  out += `<path d="M${tx(y1) + 20},${y1} A20,20 0 0 0 ${tx(y1) + 8},${y1 - 18}" fill="none" stroke="currentColor" stroke-width="1.3"/>`;
  out += `<path d="M${tx(y2) - 20},${y2} A20,20 0 0 0 ${tx(y2) - 8},${y2 + 18}" fill="none" stroke="currentColor" stroke-width="1.3"/>`;
  out += T(tx(y1) + 44, y1 - 14, exprA, 14);
  out += T(tx(y2) - 46, y2 + 24, exprB, 14);
  // parallel markers
  out += T(32, y1 - 8, 'l', 14, 'middle', 0.85);
  out += T(32, y2 - 8, 'm', 14, 'middle', 0.85);
  void W; void H;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 220" width="100%" ` +
    `style="max-width:280px;display:block" role="img" aria-label="parallel lines with transversal">${out}</svg>`
  );
}

// ── Triangle with exterior angle ─────────────────────────────────────────

export function exteriorAngleSvg(exprLeft: string, exprTop: string, exprExt: string): string {
  const A = { x: 40, y: 170 };
  const B = { x: 190, y: 170 };
  const C = { x: 110, y: 60 };
  let out = `<path d="M${A.x},${A.y} L${B.x},${B.y} L${C.x},${C.y} Z" fill="currentColor" fill-opacity="0.10" stroke="currentColor" stroke-width="2"/>`;
  out += L(B.x, B.y, B.x + 60, B.y, 2); // extended base
  out += `<path d="M${A.x + 22},${A.y} A22,22 0 0 0 ${A.x + 16},${A.y - 15}" fill="none" stroke="currentColor" stroke-width="1.3"/>`;
  out += `<path d="M${C.x - 14},${C.y + 16} A20,20 0 0 1 ${C.x + 15},${C.y + 15}" fill="none" stroke="currentColor" stroke-width="1.3"/>`;
  out += `<path d="M${B.x + 20},${B.y} A20,20 0 0 0 ${B.x - 13},${B.y - 16}" fill="none" stroke="currentColor" stroke-width="1.3"/>`;
  out += T(A.x + 34, A.y - 12, exprLeft, 13.5);
  out += T(C.x + 2, C.y + 44, exprTop, 13.5);
  out += T(B.x + 18, B.y - 26, exprExt, 13.5);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 200" width="100%" ` +
    `style="max-width:290px;display:block" role="img" aria-label="triangle with exterior angle">${out}</svg>`
  );
}

// ── Qualitative piecewise graph ──────────────────────────────────────────

/** Piecewise-linear story graph; pts = vertices in order, QI plane. */
export function qualitativeGraphSvg(pts: [number, number][], xMax = 6, yMax = 6): string {
  const S = 180;
  const p = plane(0, xMax, 0, yMax, S, false);
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${p.X(x).toFixed(1)},${p.Y(y).toFixed(1)}`).join(' ');
  return wrap(p.out + `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`, S, 190, 'story graph');
}
