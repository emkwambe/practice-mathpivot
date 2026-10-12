// Inline-SVG builders for Math 7 EOG visual item types:
//  - boxPlotSvg: two box plots on a shared number line (7.SP.4)
//  - lineGraphSvg: proportional ray through origin with labeled axes (7.RP.2)
//  - angleSplitSvg: right angle split by an interior ray, expression labels (7.G.5)
//  - perpendicularSvg: perpendicular lines with vertical-angle label (7.G.5)
//  - spinnerSvg: circle divided into equal labeled sectors (7.SP.8)
//  - sectorSvg: shaded circle sector with radius label (7.G.4)
//  - rectAngleSvg: rectangle + diagonal angle chase (7.G.5)
//  - prismSvg: isometric rectangular prism with edge labels (7.G.6)
// All SVGs use currentColor so they render white on the dark UI and black in print.

const T = (x: number, y: number, s: string | number, size = 13, anchor = 'middle', opacity = 1) =>
  `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" font-size="${size}" font-family="inherit" fill="currentColor" fill-opacity="${opacity}">${s}</text>`;

const L = (x1: number, y1: number, x2: number, y2: number, w = 1.8, dash = '', opacity = 1) =>
  `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="currentColor" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''} stroke-opacity="${opacity}"/>`;

// ── Box plots ────────────────────────────────────────────────────────────

export interface BoxPlotData {
  label: string;
  min: number;
  q1: number;
  med: number;
  q3: number;
  max: number;
}

/** Two box plots stacked above a shared number line. */
export function boxPlotSvg(a: BoxPlotData, b: BoxPlotData): string {
  const W = 320;
  const H = 170;
  const padL = 30;
  const padR = 16;
  const lo = Math.floor(Math.min(a.min, b.min)) - 1;
  const hi = Math.ceil(Math.max(a.max, b.max)) + 1;
  const X = (v: number) => padL + ((v - lo) / (hi - lo)) * (W - padL - padR);

  let out = '';
  // axis
  out += L(padL, H - 30, W - padR, H - 30, 1.5);
  for (let v = lo + 1; v < hi; v++) {
    out += L(X(v), H - 34, X(v), H - 26, 1);
    out += T(X(v), H - 12, v, 11, 'middle', 0.7);
  }
  const rows: [BoxPlotData, number][] = [[a, 40], [b, 92]];
  for (const [d, y] of rows) {
    out += T(6, y + 14, d.label, 12, 'start', 0.9);
    out += L(X(d.min), y + 10, X(d.q1), y + 10, 1.6);
    out += L(X(d.q3), y + 10, X(d.max), y + 10, 1.6);
    out += L(X(d.min), y + 2, X(d.min), y + 18, 1.6);
    out += L(X(d.max), y + 2, X(d.max), y + 18, 1.6);
    out += `<rect x="${X(d.q1).toFixed(1)}" y="${y}" width="${(X(d.q3) - X(d.q1)).toFixed(1)}" height="20" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.6"/>`;
    out += L(X(d.med), y, X(d.med), y + 20, 2.2);
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" ` +
    `style="max-width:340px;display:block" role="img" aria-label="two box plots">` +
    out +
    `</svg>`
  );
}

// ── Proportional line graph ─────────────────────────────────────────────

export interface LineGraphOptions {
  xLabel: string;
  yLabel: string;
  xMax: number;
  yMax: number;
  /** a marked grid point the ray passes through (dashed guides) */
  mark?: { x: number; y: number };
  /** ray slope = yMax/xMax by default; override endpoint */
  end?: { x: number; y: number };
  /** second ray (rate comparison) */
  second?: { x: number; y: number };
}

/** Coordinate plane in QI with a proportional ray from the origin. */
export function lineGraphSvg(o: LineGraphOptions): string {
  const W = 280;
  const H = 240;
  const padL = 34;
  const padB = 34;
  const padT = 12;
  const padR = 10;
  const X = (x: number) => padL + (x / o.xMax) * (W - padL - padR);
  const Y = (y: number) => H - padB - (y / o.yMax) * (H - padB - padT);
  const fmt = (v: number) => String(Math.round(v * 100) / 100);

  let out = '';
  for (let gx = 0; gx <= o.xMax + 1e-9; gx += o.xMax / 5) out += L(X(gx), padT, X(gx), H - padB, 1, '', 0.12);
  for (let gy = 0; gy <= o.yMax + 1e-9; gy += o.yMax / 5) out += L(padL, Y(gy), W - padR, Y(gy), 1, '', 0.12);
  // axes with arrows
  out += `<path d="M${padL},${H - padB} L${W - 4},${H - padB} M${W - 10},${H - padB - 4} L${W - 4},${H - padB} L${W - 10},${H - padB + 4}" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
  out += `<path d="M${padL},${H - padB} L${padL},6 M${padL - 4},12 L${padL},6 L${padL + 4},12" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
  // tick labels (skip 0 on both axes; origin gets a single 0)
  for (let gx = o.xMax / 5; gx <= o.xMax + 1e-9; gx += o.xMax / 5) out += T(X(gx), H - padB + 16, fmt(gx), 11, 'middle', 0.7);
  for (let gy = o.yMax / 5; gy <= o.yMax + 1e-9; gy += o.yMax / 5) out += T(padL - 6, Y(gy) + 4, fmt(gy), 11, 'end', 0.7);
  out += T(padL - 8, H - padB + 14, '0', 11, 'middle', 0.7);
  out += T(W / 2, H - 4, o.xLabel, 12, 'middle', 0.85);
  out += `<text x="8" y="${(H / 2).toFixed(1)}" text-anchor="middle" font-size="12" font-family="inherit" fill="currentColor" fill-opacity="0.85" transform="rotate(-90 8 ${(H / 2).toFixed(1)})">${o.yLabel}</text>`;

  const end = o.end ?? { x: o.xMax, y: o.yMax };
  out += L(padL, H - padB, X(end.x), Y(end.y), 2.4);
  if (o.second) out += L(padL, H - padB, X(o.second.x), Y(o.second.y), 2.4, '6 4');
  if (o.mark) {
    out += L(X(o.mark.x), H - padB, X(o.mark.x), Y(o.mark.y), 1.2, '4 3', 0.6);
    out += L(padL, Y(o.mark.y), X(o.mark.x), Y(o.mark.y), 1.2, '4 3', 0.6);
    out += `<circle cx="${X(o.mark.x).toFixed(1)}" cy="${Y(o.mark.y).toFixed(1)}" r="4" fill="currentColor"/>`;
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" ` +
    `style="max-width:300px;display:block" role="img" aria-label="proportional line graph">` +
    out +
    `</svg>`
  );
}

// ── Angle diagrams ───────────────────────────────────────────────────────

/** Right angle at a vertex split by an interior ray; arcs labeled with expressions. */
export function angleSplitSvg(labelA: string, labelB: string): string {
  const S = 220;
  const V = { x: 60, y: 170 };
  const ray = (deg: number, len = 120) => [V.x + len * Math.cos((deg * Math.PI) / 180), V.y - len * Math.sin((deg * Math.PI) / 180)] as const;
  const [rx, ry] = ray(0);
  const [tx, ty] = ray(90);
  const [mx, my] = ray(52);
  let out = L(V.x, V.y, rx, ry, 2) + L(V.x, V.y, tx, ty, 2) + L(V.x, V.y, mx, my, 1.8);
  // right-angle marker between the two outer rays? No — the outer rays form the 90°.
  out += `<path d="M${V.x + 18},${V.y} L${V.x + 18},${V.y - 18} L${V.x},${V.y - 18}" fill="none" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.55"/>`;
  // arc for angle A (0..52) and B (52..90)
  const arc = (a1: number, a2: number, r: number) => {
    const [x1, y1] = ray(a1, r);
    const [x2, y2] = ray(a2, r);
    return `<path d="M${(V.x + x1 - V.x).toFixed(1)},${(V.y + y1 - V.y).toFixed(1)} A${r},${r} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="1.4"/>`;
  };
  out += arc(4, 48, 34) + arc(56, 86, 44);
  const [lax, lay] = ray(26, 62);
  const [lbx, lby] = ray(71, 68);
  out += T(lax, lay, labelA, 14);
  out += T(lbx, lby, labelB, 14);
  void S;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 200" width="100%" ` +
    `style="max-width:240px;display:block" role="img" aria-label="complementary angles">` +
    out +
    `</svg>`
  );
}

/** Two perpendicular lines crossing; one angle labeled (vertical angles → 90°). */
export function perpendicularSvg(label: string): string {
  const C = 110;
  let out = L(20, C, 200, C, 2) + L(C, 20, C, 200, 2);
  // right-angle marker top-left quadrant
  out += `<path d="M${C - 16},${C} L${C - 16},${C - 16} L${C},${C - 16}" fill="none" stroke="currentColor" stroke-width="1.4"/>`;
  // label bottom-right quadrant angle
  out += T(C + 34, C + 40, label, 14);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220" width="100%" ` +
    `style="max-width:240px;display:block" role="img" aria-label="perpendicular lines">` +
    out +
    `</svg>`
  );
}

// ── Spinner ──────────────────────────────────────────────────────────────

/** Circle divided into equal sectors, each labeled (colors, numbers, …). */
export function spinnerSvg(labels: string[]): string {
  const S = 200;
  const C = S / 2;
  const R = 78;
  const n = labels.length;
  let out = `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="currentColor" stroke-width="2"/>`;
  for (let i = 0; i < n; i++) {
    const a = ((i * 360) / n) * (Math.PI / 180);
    out += L(C, C, C + R * Math.cos(a), C - R * Math.sin(a), 1.6);
    const mid = (((i + 0.5) * 360) / n) * (Math.PI / 180);
    out += T(C + (R * 0.6) * Math.cos(mid), C - (R * 0.6) * Math.sin(mid) + 4, labels[i], 13);
  }
  out += `<circle cx="${C}" cy="${C}" r="3" fill="currentColor"/>`;
  out += L(C, C - R, C, C - R - 14, 2.4);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="100%" ` +
    `style="max-width:220px;display:block" role="img" aria-label="spinner">` +
    out +
    `</svg>`
  );
}

// ── Circle sector ────────────────────────────────────────────────────────

/** Circle with a shaded sector; radius labeled. */
export function sectorSvg(centerDeg: number, radiusLabel: string): string {
  const S = 220;
  const C = S / 2;
  const R = 80;
  const rad = (d: number) => (d * Math.PI) / 180;
  const P = (d: number, r = R) => [C + r * Math.cos(rad(d)), C - r * Math.sin(rad(d))] as const;
  const a1 = centerDeg / 2;
  const a2 = -centerDeg / 2;
  const [x1, y1] = P(a1);
  const [x2, y2] = P(a2);
  const large = centerDeg > 180 ? 1 : 0;
  let out = `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="currentColor" stroke-width="2"/>`;
  out += `<path d="M${C},${C} L${x1.toFixed(1)},${y1.toFixed(1)} A${R},${R} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.6"/>`;
  const [mx, my] = P(0, R / 2);
  out += T(mx, my + 4, radiusLabel, 13);
  const [ax, ay] = P(0, R + 16);
  out += T(ax, ay + 4, `${centerDeg}°`, 13, 'middle', 0.85);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="100%" ` +
    `style="max-width:240px;display:block" role="img" aria-label="circle sector">` +
    out +
    `</svg>`
  );
}

// ── Rectangle angle chase ────────────────────────────────────────────────

export interface RectAngleLabels {
  /** angle between diagonal and bottom side, inside rectangle */
  a?: string;
  /** angle at bottom-right corner exterior (extended side) */
  b?: string;
  /** target angle label shown as ? */
  target?: string;
}

/** Rectangle with a diagonal and the bottom side extended past the corner. */
export function rectAngleSvg(lb: RectAngleLabels): string {
  const X0 = 40;
  const Y0 = 40;
  const Wd = 160;
  const Ht = 100;
  let out = `<rect x="${X0}" y="${Y0}" width="${Wd}" height="${Ht}" fill="none" stroke="currentColor" stroke-width="2"/>`;
  // diagonal from bottom-left to top-right
  out += L(X0, Y0 + Ht, X0 + Wd, Y0, 1.8);
  // extended bottom side
  out += L(X0 + Wd, Y0 + Ht, X0 + Wd + 50, Y0 + Ht, 1.8);
  if (lb.a) out += T(X0 + 52, Y0 + Ht - 10, lb.a, 13);
  if (lb.b) out += T(X0 + Wd + 26, Y0 + Ht - 12, lb.b, 13);
  if (lb.target) out += T(X0 + Wd - 26, Y0 + 24, lb.target, 14);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 160" width="100%" ` +
    `style="max-width:280px;display:block" role="img" aria-label="rectangle angle diagram">` +
    out +
    `</svg>`
  );
}

// ── Isometric prism ──────────────────────────────────────────────────────

/** Isometric rectangular prism; hidden edges dashed; three edge labels. */
export function prismSvg(l: string, w: string, h: string): string {
  // front face rectangle
  const fx = 50;
  const fy = 60;
  const fw = 140;
  const fh = 80;
  const dx = 44;
  const dy = -34; // back offset
  const bx = fx + dx;
  const by = fy + dy;
  let out = '';
  // back face
  out += `<rect x="${bx}" y="${by}" width="${fw}" height="${fh}" fill="none" stroke="currentColor" stroke-width="1.8"/>`;
  // front face
  out += `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" fill="none" stroke="currentColor" stroke-width="1.8"/>`;
  // connectors: visible except bottom-back-left
  out += L(fx + fw, fy, bx + fw, by, 1.6);
  out += L(fx + fw, fy + fh, bx + fw, by + fh, 1.6);
  out += L(fx, fy, bx, by, 1.6);
  out += L(fx, fy + fh, bx, by + fh, 1.4, '5 4', 0.55);
  // labels
  out += T(fx + fw / 2, fy + fh + 18, l, 13);
  out += T(bx + fw + 14, by + fh / 2, w, 13, 'start');
  out += T(fx - 12, fy + fh / 2, h, 13, 'end');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 190" width="100%" ` +
    `style="max-width:300px;display:block" role="img" aria-label="rectangular prism">` +
    out +
    `</svg>`
  );
}
