// Inline-SVG builders for Math 3 EOC visual item types:
//  - functionPlotSvg: computed polyline plot of any function (exp/quartic/piecewise)
//  - circleDiagramSvg: circle with labeled points, chords, and angle markings
//  - barChartSvg: small categorical bar chart (S-IC.5 paired-difference stems)
// All SVGs use currentColor so they render white on the dark UI and black in print.

export interface PlotOptions {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  /** mark integer dots at these x values (piecewise graph reading) */
  dots?: { x: number; y: number; open?: boolean }[];
  /** draw numeric tick labels on both axes (needed when absolute values matter) */
  labels?: boolean;
}

/** 240x240 coordinate plane with the graph of f drawn as a computed polyline. */
export function functionPlotSvg(f: (x: number) => number, o: PlotOptions): string {
  const S = 240;
  const X = (x: number) => ((x - o.xMin) / (o.xMax - o.xMin)) * S;
  const Y = (y: number) => S - ((y - o.yMin) / (o.yMax - o.yMin)) * S;

  const grid: string[] = [];
  for (let gx = Math.ceil(o.xMin); gx <= Math.floor(o.xMax); gx++) {
    grid.push(`<line x1="${X(gx).toFixed(1)}" y1="0" x2="${X(gx).toFixed(1)}" y2="${S}" stroke="currentColor" stroke-opacity="0.12"/>`);
  }
  for (let gy = Math.ceil(o.yMin); gy <= Math.floor(o.yMax); gy++) {
    grid.push(`<line x1="0" y1="${Y(gy).toFixed(1)}" x2="${S}" y2="${Y(gy).toFixed(1)}" stroke="currentColor" stroke-opacity="0.12"/>`);
  }

  const axes =
    (o.yMin < 0 && o.yMax > 0
      ? `<line x1="0" y1="${Y(0).toFixed(1)}" x2="${S}" y2="${Y(0).toFixed(1)}" stroke="currentColor" stroke-opacity="0.6" stroke-width="1.5"/>`
      : '') +
    (o.xMin < 0 && o.xMax > 0
      ? `<line x1="${X(0).toFixed(1)}" y1="0" x2="${X(0).toFixed(1)}" y2="${S}" stroke="currentColor" stroke-opacity="0.6" stroke-width="1.5"/>`
      : '');

  // Sample the function; break the path across asymptotes / window exits
  const N = 160;
  let d = '';
  let pen = false;
  let prevY = NaN;
  for (let i = 0; i <= N; i++) {
    const x = o.xMin + ((o.xMax - o.xMin) * i) / N;
    const y = f(x);
    const inWindow = isFinite(y) && y >= o.yMin - 1 && y <= o.yMax + 1;
    const jump = isFinite(prevY) && isFinite(y) && Math.abs(y - prevY) > (o.yMax - o.yMin) * 0.5;
    if (inWindow && !jump) {
      d += `${pen ? ' L' : 'M'}${X(x).toFixed(1)},${Y(y).toFixed(1)}`;
      pen = true;
    } else {
      pen = false;
    }
    prevY = y;
  }

  const dots = (o.dots ?? [])
    .map(
      (dt) =>
        dt.open
          ? `<circle cx="${X(dt.x).toFixed(1)}" cy="${Y(dt.y).toFixed(1)}" r="4.5" fill="none" stroke="currentColor" stroke-width="2"/>`
          : `<circle cx="${X(dt.x).toFixed(1)}" cy="${Y(dt.y).toFixed(1)}" r="4.5" fill="currentColor"/>`,
    )
    .join('');

  // Optional numeric tick labels: integers on x, a nice step on y.
  let labels = '';
  if (o.labels) {
    const tx: string[] = [];
    const yAxisPx = o.xMin < 0 && o.xMax > 0 ? X(0) : 0;
    const xAxisPx = o.yMin < 0 && o.yMax > 0 ? Y(0) : S;
    for (let gx = Math.ceil(o.xMin); gx <= Math.floor(o.xMax); gx++) {
      if (gx === 0) continue;
      const lx = X(gx);
      if (Math.abs(lx - yAxisPx) < 12) continue;
      tx.push(`<text x="${lx.toFixed(1)}" y="${(xAxisPx + 13).toFixed(1)}" text-anchor="middle" font-size="10" font-family="inherit" fill="currentColor" fill-opacity="0.75">${gx}</text>`);
    }
    const ySpan = o.yMax - Math.max(o.yMin, 0);
    const yStep = [1, 2, 5, 10, 20, 50].find((s) => ySpan / s <= 6) ?? 100;
    for (let gy = yStep; gy <= Math.floor(o.yMax); gy += yStep) {
      const ly = Y(gy);
      if (ly < 10) break;
      tx.push(`<text x="${(yAxisPx - 5).toFixed(1)}" y="${(ly + 3.5).toFixed(1)}" text-anchor="end" font-size="10" font-family="inherit" fill="currentColor" fill-opacity="0.75">${gy}</text>`);
    }
    labels = tx.join('');
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="100%" ` +
    `style="max-width:280px;display:block" role="img" aria-label="function graph">` +
    grid.join('') + axes +
    `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>` +
    dots +
    labels +
    `</svg>`
  );
}

export interface CirclePoint { label: string; deg: number }
export interface CircleDiagramOptions {
  points: CirclePoint[];
  /** chords/segments to draw, as pairs of point labels; 'O' = center */
  segments: [string, string][];
  /** text labels placed at a polar position, e.g. an arc measure */
  labels?: { text: string; deg: number; dist: number }[];
  /** draw a small angle arc at point `at`, between rays toward `from` and `to` */
  angleArc?: { at: string; from: string; to: string; text?: string };
}

/** 240x240 circle diagram. Angles in degrees, 0 = positive x-axis, CCW positive. */
export function circleDiagramSvg(o: CircleDiagramOptions): string {
  const S = 240;
  const C = S / 2;
  const R = 88;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const P = (deg: number, dist = R) => [C + dist * Math.cos(rad(deg)), C - dist * Math.sin(rad(deg))] as const;

  const pos = new Map<string, readonly [number, number]>();
  pos.set('O', [C, C]);
  for (const p of o.points) pos.set(p.label, P(p.deg));

  const circle = `<circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="currentColor" stroke-width="2"/>`;
  const center = `<circle cx="${C}" cy="${C}" r="3.5" fill="currentColor"/>`;

  const segs = o.segments
    .map(([a, b]) => {
      const pa = pos.get(a);
      const pb = pos.get(b);
      if (!pa || !pb) return '';
      return `<line x1="${pa[0].toFixed(1)}" y1="${pa[1].toFixed(1)}" x2="${pb[0].toFixed(1)}" y2="${pb[1].toFixed(1)}" stroke="currentColor" stroke-width="1.8"/>`;
    })
    .join('');

  const ptLabels = o.points
    .map((p) => {
      const [lx, ly] = P(p.deg, R + 16);
      return `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="middle" font-size="14" font-family="inherit" fill="currentColor">${p.label}</text>`;
    })
    .join('');

  const extra = (o.labels ?? [])
    .map((l) => {
      const [lx, ly] = P(l.deg, l.dist);
      return `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="middle" font-size="13" font-family="inherit" fill="currentColor" fill-opacity="0.85">${l.text}</text>`;
    })
    .join('');

  let arcSvg = '';
  if (o.angleArc) {
    const at = pos.get(o.angleArc.at);
    const from = pos.get(o.angleArc.from);
    const to = pos.get(o.angleArc.to);
    if (at && from && to) {
      const a1 = Math.atan2(-(from[1] - at[1]), from[0] - at[0]);
      const a2 = Math.atan2(-(to[1] - at[1]), to[0] - at[0]);
      const r = 26;
      const x1 = at[0] + r * Math.cos(a1);
      const y1 = at[1] - r * Math.sin(a1);
      const x2 = at[0] + r * Math.cos(a2);
      const y2 = at[1] - r * Math.sin(a2);
      let sweep = a2 - a1;
      while (sweep > Math.PI) sweep -= 2 * Math.PI;
      while (sweep < -Math.PI) sweep += 2 * Math.PI;
      const large = 0;
      const sweepFlag = sweep > 0 ? 1 : 0;
      arcSvg =
        `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} ${sweepFlag} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke="currentColor" stroke-width="1.5"/>` +
        (o.angleArc.text
          ? `<text x="${(at[0] + 44 * Math.cos((a1 + a2) / 2)).toFixed(1)}" y="${(at[1] - 44 * Math.sin((a1 + a2) / 2) + 4).toFixed(1)}" text-anchor="middle" font-size="13" font-family="inherit" fill="currentColor">${o.angleArc.text}</text>`
          : '');
    }
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="100%" ` +
    `style="max-width:280px;display:block" role="img" aria-label="circle diagram">` +
    circle + center + segs + arcSvg + ptLabels + extra +
    `</svg>`
  );
}

/** Small vertical bar chart for data stems (categories on x, signed values). */
export function barChartSvg(categories: string[], values: number[], yLabel: string): string {
  const W = 320;
  const H = 190;
  const padL = 14;
  const padB = 40;
  const padT = 14;
  const maxAbs = Math.max(...values.map((v) => Math.abs(v)), 1);
  const zeroY = padT + ((H - padB - padT) * maxAbs) / (2 * maxAbs); // centered zero line
  const unit = (H - padB - padT) / (2 * maxAbs);
  const bw = (W - padL - 10) / categories.length;

  const bars = values
    .map((v, i) => {
      const x = padL + i * bw + 6;
      const h = Math.abs(v) * unit;
      const y = v >= 0 ? zeroY - h : zeroY;
      const labelY = H - 24;
      return (
        `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(bw - 12).toFixed(1)}" height="${Math.max(h, 1).toFixed(1)}" fill="currentColor" fill-opacity="0.45"/>` +
        `<text x="${(x + (bw - 12) / 2).toFixed(1)}" y="${labelY}" text-anchor="middle" font-size="10.5" font-family="inherit" fill="currentColor" fill-opacity="0.75">${categories[i]}</text>`
      );
    })
    .join('');

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" ` +
    `style="max-width:340px;display:block" role="img" aria-label="bar chart">` +
    `<line x1="${padL}" y1="${zeroY.toFixed(1)}" x2="${W - 6}" y2="${zeroY.toFixed(1)}" stroke="currentColor" stroke-width="1.5"/>` +
    bars +
    `<text x="${padL}" y="${H - 6}" font-size="11" font-family="inherit" fill="currentColor" fill-opacity="0.7">${yLabel}</text>` +
    `</svg>`
  );
}
