// Math 1 EOC: procedural factory registry.
// Each technique holds multiple factories — one per released item format —
// so a single concept is covered by a wide range of skills.

import type { ProblemFactory, Math1Technique } from '../../problemGenerator';
import { linearEquationFactories } from './linearEquations';
import { systemFactories } from './systems';
import { functionFactories } from './functions';
import { quadraticFactories } from './quadratics';
import { exponentialFactories } from './exponentials';
import { exponentsGeometryFactories } from './exponentsGeometry';
import { statisticsFactories } from './statistics';
import { genInequalityGraph, genDotPattern } from './visual';

export const math1Factories: Record<Exclude<Math1Technique, 'mixed-m1'>, ProblemFactory[]> = {
  'm1-linear-equations': [...linearEquationFactories, genInequalityGraph],
  'm1-systems': systemFactories,
  'm1-functions': [...functionFactories, genDotPattern],
  'm1-quadratics-polynomials': quadraticFactories,
  'm1-exponentials': exponentialFactories,
  'm1-exponents-geometry': exponentsGeometryFactories,
  'm1-statistics': statisticsFactories,
};
