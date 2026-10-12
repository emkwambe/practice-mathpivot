// Math 3 EOC: procedural factory registry.

import type { ProblemFactory, Math3Technique } from '../../problemGenerator';
import { polynomialFactories } from './polynomials';
import { rationalFactories } from './rational';
import { exponentialLogFactories } from './expLogs';
import { transformationFactories } from './transformations';
import { geometryFactories } from './geometry';
import { statisticsFactories } from './statistics';

export const math3Factories: Record<Exclude<Math3Technique, 'mixed-m3'>, ProblemFactory[]> = {
  'm3-polynomials': polynomialFactories,
  'm3-rational-expressions': rationalFactories,
  'm3-exponential-logs': exponentialLogFactories,
  'm3-functions-transformations': transformationFactories,
  'm3-geometry': geometryFactories,
  'm3-statistics': statisticsFactories,
};
