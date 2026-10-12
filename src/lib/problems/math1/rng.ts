// Seeded RNG utilities for Math 1 EOC procedural generators.
// mulberry32: tiny deterministic PRNG so every seed reproduces the same item.

export type RNG = () => number;

export function mulberry32(seed: number): RNG {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Integer in [min, max] inclusive. */
export function randInt(rng: RNG, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

/** Nonzero integer in [min, max]. */
export function randNonZero(rng: RNG, min: number, max: number): number {
  let v = 0;
  while (v === 0) v = randInt(rng, min, max);
  return v;
}

export function choice<T>(rng: RNG, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function shuffle<T>(rng: RNG, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** n distinct integers from [min, max]. */
export function distinctInts(rng: RNG, n: number, min: number, max: number): number[] {
  const set = new Set<number>();
  while (set.size < n) set.add(randInt(rng, min, max));
  return [...set];
}

/** Greatest common divisor. */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
