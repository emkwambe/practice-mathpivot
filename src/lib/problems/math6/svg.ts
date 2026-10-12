// Inline-SVG builders for Math 6 EOG visual item types:
//  - inequalityLineSvg: number line with open/closed circle + ray (6.EE.8)
//  - hopModelSvg: number line with curved +/- hops (6.NS.9)
//  - prismNetSvg: T-layout net of a rectangular prism, labeled dims (6.G.4)
//  - triangleNetSvg: strip of 4 congruent triangles (tetrahedron net, 6.G.4)
//  - dotPlotSvg: stacked dots over a number line with title/axis label (6.SP.4)
//  - singleBoxPlotSvg: one box plot over a number line (6.SP.4)
// Reused from math7: boxPlotSvg, lineGraphSvg.
// All SVGs use currentColor so they render white on the dark UI and black in print.

const T = (x: number, y: number, s: string | number, size = 13, anchor = 'middle', opacity = 1) =>
  `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" font-size="${size}" font-family="inherit" fill="currentColor" fill-opacity="${opacity}">${s}</text>`;

const L = (x1: number, y1: number, x2: number, y2: number, w = 1.8, dash = '', opacity = 1) =>
  `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''} stroke-opacity="${opacity}"/>`;

const ARROW_R = (x: number, y: number) =>
  `<path d="M${x},${y} l-9,-5 l0,10 z" fill="currentColor"/>`;
const ARROW_L = (x: number, y: number) =>
  `<path d="M${x},${y} l9,-5 l0,10 z" fill="currentColor"/>`;

// ── Inequality number line (choice graphic) ─────────────────────────────

/** One number line showing the graph of x <cmp> bound. cmp: 'gt' | 'lt' | 'ge' | 'le'. */
export function inequalityLineSvg(cmp: 'gt' | 'lt' | 'ge' | 'le', bound: number): string {
  const W = 220;
  const H = 56;
  const lo = bound - 2;
  const hi = bound + 2;
  const padL = 18;
  const padR = 18;
  const X = (v: number) => padL + ((v - lo) / (hi - lo)) * (W - padL - padR);
  const y = 26;
  let out = L(padL - 4, y, W - padR + 4, y, 1.6) + ARROW_L(padL - 4, y) + ARROW_R(W - padR + 4, y);
  for (let v = lo; v <= hi; v++) {
    out += L(X(v), y - 5, X(v), y + 5, 1.2);
    out += T(X(v), y + 20, v, 11, 'middle', 0.75);
  }
  const closed = cmp === 'ge' || cmp === 'le';
  const right = cmp === 'gt' || cmp === 'ge';
  // bold ray
  const x0 = X(bound);
  if (right) out += L(x0, y, W - padR + 2, y, 3.4);
  else out += L(padL - 2, y, x0, y, 3.4);
  out += closed
    ? `<circle cx="${x0.toFixed(1)}" cy="${y}" r="5" fill="currentColor"/>`
    : `<circle cx="${x0.toFixed(1)}" cy="${y}" r="5" fill="none" stroke="currentColor" stroke-width="2.2"/>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" ` +
    `style="max-width:230px;display:block" role="img" aria-label="inequality number line">` +
    out +
    `</svg>`
  );
}

// ── Number-line hop model (stem graphic) ────────────────────────────────

/** Number line −7..7 with curved arrows: start at 0, then each hop (signed). */
export function hopModelSvg(hops: number[]): string {
  const W = 330;
  const H = 92;
  const lo = -7;
  const hi = 7;
  const padL = 16;
  const padR = 16;
  const X = (v: number) => padL + ((v - lo) / (hi - lo)) * (W - padL - padR);
  const y = 62;
  let out = L(padL - 4, y, W - padR + 4, y, 1.6) + ARROW_L(padL - 4, y) + ARROW_R(W - padR + 4, y);
  for (let v = lo; v <= hi; v++) {
    out += L(X(v), y - 5, X(v), y + 5, 1.2);
    out += T(X(v), y + 20, v < 0 ? `\u2212${-v}` : v, 11, 'middle', 0.75);
  }
  let pos = 0;
  let arcH = 34;
  for (const h of hops) {
    const next = pos + h;
    const x1 = X(pos);
    const x2 = X(next);
    const mx = (x1 + x2) / 2;
    const my = y - arcH;
    // arrowhead at the end of the arc
    const dir = h > 0 ? 1 : -1;
    out += `<path d="M${x1.toFixed(1)},${(y - 4).toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${(y - 4).toFixed(1)}" fill="none" stroke="currentColor" stroke-width="2"/>`;
    out += `<path d="M${x2.toFixed(1)},${(y - 4).toFixed(1)} l${(-dir * 8).toFixed(1)},-6 l1,7 z" fill="currentColor"/>`;
    pos = next;
    arcH -= 8;
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" ` +
    `style="max-width:340px;display:block" role="img" aria-label="number line model">` +
    out +
    `</svg>`
  );
}

// ── Rectangular-prism net (T layout) ────────────────────────────────────

/** T-layout net: top strip [w×h][l×h][w×h], column below center [l×w][l×h][l×w]. */
export function prismNetSvg(l: number, w: number, h: number, unit: string): string {
  const s = 13; // px per unit
  const cx = 40 + w * s; // left edge of center column
  const cy = 34; // top edge of strip
  const lw = l * s;
  const ww = w * s;
  const hh = h * s;
  const W = cx + lw + ww + 44;
  const H = cy + hh + ww + hh + ww + 26;
  const R = (x: number, y0: number, rw: number, rh: number) =>
    `<rect x="${x.toFixed(1)}" y="${y0.toFixed(1)}" width="${rw.toFixed(1)}" height="${rh.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="1.8"/>`;
  let out = '';
  // top strip
  out += R(cx - ww, cy, ww, hh);
  out += R(cx, cy, lw, hh);
  out += R(cx + lw, cy, ww, hh);
  // column below center
  out += R(cx, cy + hh, lw, ww);
  out += R(cx, cy + hh + ww, lw, hh);
  out += R(cx, cy + hh + ww + hh, lw, ww);
  // labels
  out += T(cx + lw / 2, cy - 8, `${l} ${unit}`, 12);
  out += T(cx + lw + ww + 6, cy + hh / 2 + 4, `${h} ${unit}`, 12, 'start');
  out += T(cx + lw + 6, cy + hh + ww + hh + ww / 2 + 4, `${w} ${unit}`, 12, 'start');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="100%" ` +
    `style="max-width:300px;display:block" role="img" aria-label="net of a rectangular prism">` +
    out +
    `</svg>`
  );
}

// ── Triangle-strip net (4 congruent triangles) ──────────────────────────

/** Four congruent triangles alternating up/down in a strip; base + height labeled. */
export function triangleNetSvg(base: number, height: number, unit: string): string {
  const s = 11;
  const b = base * s;
  const hpx = height * s * 0.9;
  const x0 = 30;
  const y0 = 30;
  const W = x0 + 4 * b + 60;
  const H = y0 + hpx + 46;
  const P = (pts: [number, number][]) =>
    `<polygon points="${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')}" fill="none" stroke="currentColor" stroke-width="1.8"/>`;
  let out = '';
  for (let i = 0; i < 4; i++) {
    const x = x0 + i * b;
    if (i % 2 === 0) out += P([[x, y0 + hpx], [x + b, y0 + hpx], [x + b / 2, y0]]);
    else out += P([[x, y0], [x + b, y0], [x + b / 2, y0 + hpx]]);
  }
  // base label under first triangle, height label beside it
  out += T(x0 + b / 2, y0 + hpx + 18, `${base} ${unit}`, 12);
  out += L(x0 + b + 12, y0, x0 + b + 12, y0 + hpx, 1, '3 3', 0.6);
  out += T(x0 + b + 18, y0 + hpx / 2 + 4, `${height} ${unit}`, 12, 'start', 0.85);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="100%" ` +
    `style="max-width:320px;display:block" role="img" aria-label="net of four triangles">` +
    out +
    `</svg>`
  );
}

// ── Dot plot ────────────────────────────────────────────────────────────

/** Dot plot: counts[i] dots stacked above value lo+i. */
export function dotPlotSvg(title: string, xLabel: string, counts: number[], lo = 0): string {
  const W = 320;
  const maxCount = Math.max(...counts, 1);
  const H = 46 + maxCount * 16 + 44;
  const padL = 26;
  const padR = 14;
  const hi = lo + counts.length - 1;
  const X = (v: number) => padL + ((v - lo) / Math.max(hi - lo, 1)) * (W - padL - padR);
  const axisY = H - 40;
  let out = T(W / 2, 18, title, 13, 'middle', 0.9);
  out += L(padL - 6, axisY, W - padR + 6, axisY, 1.5);
  for (let v = lo; v <= hi; v++) {
    out += L(X(v), axisY - 4, X(v), axisY + 4, 1.2);
    out += T(X(v), axisY + 18, v, 11, 'middle', 0.75);
  }
  out += T(W / 2, H - 4, xLabel, 12, 'middle', 0.85);
  counts.forEach((c, i) => {
    for (let k = 0; k < c; k++) {
      out += `<circle cx="${X(lo + i).toFixed(1)}" cy="${(axisY - 10 - k * 16).toFixed(1)}" r="5" fill="currentColor"/>`;
    }
  });
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" ` +
    `style="max-width:330px;display:block" role="img" aria-label="dot plot">` +
    out +
    `</svg>`
  );
}

// ── Single box plot (choice graphic) ────────────────────────────────────

export interface SingleBoxData {
  min: number;
  q1: number;
  med: number;
  q3: number;
  max: number;
}

/** One box plot above a number line spanning [lo, hi]. */
export function singleBoxPlotSvg(d: SingleBoxData, lo: number, hi: number): string {
  const W = 240;
  const H = 96;
  const padL = 16;
  const padR = 16;
  const X = (v: number) => padL + ((v - lo) / (hi - lo)) * (W - padL - padR);
  const y = 26;
  let out = L(padL, H - 26, W - padR, H - 26, 1.4);
  for (let v = lo; v <= hi; v += Math.max(1, Math.round((hi - lo) / 8))) {
    out += L(X(v), H - 30, X(v), H - 22, 1);
    out += T(X(v), H - 8, v, 10, 'middle', 0.7);
  }
  out += L(X(d.min), y + 10, X(d.q1), y + 10, 1.6);
  out += L(X(d.q3), y + 10, X(d.max), y + 10, 1.6);
  out += L(X(d.min), y + 2, X(d.min), y + 18, 1.6);
  out += L(X(d.max), y + 2, X(d.max), y + 18, 1.6);
  out += `<rect x="${X(d.q1).toFixed(1)}" y="${y}" width="${(X(d.q3) - X(d.q1)).toFixed(1)}" height="20" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.6"/>`;
  out += L(X(d.med), y, X(d.med), y + 20, 2.2);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" ` +
    `style="max-width:250px;display:block" role="img" aria-label="box plot">` +
    out +
    `</svg>`
  );
}
