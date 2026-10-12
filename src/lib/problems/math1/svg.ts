// Inline-SVG builders for Math 1 EOC visual item types (A-REI.12 graph
// choices, F-BF.1.a dot patterns). All SVGs use stroke/fill="currentColor"
// so they render white on the dark UI and black on printed worksheets.

/** Clip the line y = m x + b to the square [-R, R]^2; returns the two
 *  boundary intersection points in math coordinates. */
function clipLine(m: number, b: number, R: number): [number, number][] {
  const pts: [number, number][] = [];
  const push = (x: number, y: number) => {
    if (x < -R - 1e-9 || x > R + 1e-9 || y < -R - 1e-9 || y > R + 1e-9) return;
    if (!pts.some((p) => Math.abs(p[0] - x) < 1e-9 && Math.abs(p[1] - y) < 1e-9)) pts.push([x, y]);
  };
  push(-R, m * -R + b);
  push(R, m * R + b);
  if (m !== 0) {
    push((R - b) / m, R);
    push((-R - b) / m, -R);
  }
  return pts.slice(0, 2) as [number, number][];
}

export interface InequalityGraphOptions {
  m: number;
  b: number;
  /** true = >= or <= (solid line), false = > or < (dashed) */
  solid: boolean;
  /** true = shade above the line (y >= ...), false = shade below */
  shadeAbove: boolean;
}

/**
 * 200x200 coordinate plane showing the boundary line y = m x + b and the
 * shaded half-plane for a linear inequality. Range [-5, 5] on both axes.
 */
export function inequalityGraphSvg({ m, b, solid, shadeAbove }: InequalityGraphOptions): string {
  const R = 5;
  const S = 200;
  const scale = S / (2 * R); // 20 px per unit
  const X = (x: number) => S / 2 + x * scale;
  const Y = (y: number) => S / 2 - y * scale;

  const ends = clipLine(m, b, R);
  if (ends.length < 2) {
    // Line lies entirely outside the window (|b| too large) — caller
    // constrains b, but fall back to a horizontal mid-line to stay valid.
    return inequalityGraphSvg({ m: 0, b: 0, solid, shadeAbove });
  }

  // Shaded polygon = line endpoints + square corners on the shaded side,
  // sorted by angle around the centroid (region is convex).
  const corners: [number, number][] = [
    [-R, -R], [R, -R], [R, R], [-R, R],
  ];
  const poly: [number, number][] = [...ends];
  for (const [cx, cy] of corners) {
    const above = cy > m * cx + b + 1e-9;
    if (above === shadeAbove) poly.push([cx, cy]);
  }
  const gx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
  const gy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
  poly.sort((p, q) => Math.atan2(p[1] - gy, p[0] - gx) - Math.atan2(q[1] - gy, q[0] - gx));
  const polyPts = poly.map(([px, py]) => `${X(px).toFixed(1)},${Y(py).toFixed(1)}`).join(' ');

  const grid: string[] = [];
  for (let i = -R + 1; i < R; i++) {
    grid.push(
      `<line x1="${X(i)}" y1="0" x2="${X(i)}" y2="${S}" stroke="currentColor" stroke-opacity="0.12" stroke-width="1"/>`,
      `<line x1="0" y1="${Y(i)}" x2="${S}" y2="${Y(i)}" stroke="currentColor" stroke-opacity="0.12" stroke-width="1"/>`,
    );
  }

  const dash = solid ? '' : ' stroke-dasharray="7 5"';

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="100%" ` +
    `style="max-width:180px;display:block" role="img" aria-label="graph">` +
    grid.join('') +
    `<line x1="0" y1="${Y(0)}" x2="${S}" y2="${Y(0)}" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5"/>` +
    `<line x1="${X(0)}" y1="0" x2="${X(0)}" y2="${S}" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5"/>` +
    `<polygon points="${polyPts}" fill="currentColor" fill-opacity="0.16"/>` +
    `<line x1="${X(ends[0][0]).toFixed(1)}" y1="${Y(ends[0][1]).toFixed(1)}" ` +
    `x2="${X(ends[1][0]).toFixed(1)}" y2="${Y(ends[1][1]).toFixed(1)}" ` +
    `stroke="currentColor" stroke-width="2.5" stroke-linecap="round"${dash}/>` +
    `</svg>`
  );
}

/**
 * Dot-pattern figures 1-3 side by side. Figure n shows a tail of `c` dots
 * on the bottom-left plus n columns of height `h`, so figure n has
 * h*n + c dots. 360x140 viewBox, captions beneath each figure.
 */
export function dotPatternSvg(h: number, c: number): string {
  const W = 360;
  const H = 150;
  const r = 5.5;
  const gap = 17;
  const regions = [60, 180, 300]; // center x of each figure region
  const baseY = 108;

  const parts: string[] = [];
  for (let f = 1; f <= 3; f++) {
    const ox = regions[f - 1];
    const dots: string[] = [];
    // tail dots on the bottom row, to the left of the columns
    for (let i = 0; i < c; i++) {
      dots.push(`<circle cx="${ox - (c - i) * gap}" cy="${baseY}" r="${r}" fill="currentColor"/>`);
    }
    // n columns of height h
    for (let col = 0; col < f; col++) {
      for (let row = 0; row < h; row++) {
        dots.push(
          `<circle cx="${ox + (col + 1) * gap}" cy="${baseY - row * gap}" r="${r}" fill="currentColor"/>`,
        );
      }
    }
    parts.push(
      dots.join('') +
        `<text x="${ox}" y="${baseY + 28}" text-anchor="middle" font-size="13" ` +
        `font-family="inherit" fill="currentColor" fill-opacity="0.7">Figure ${f}</text>`,
    );
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" ` +
    `style="max-width:420px;display:block" role="img" aria-label="dot pattern figures 1 to 3">` +
    parts.join('') +
    `</svg>`
  );
}
