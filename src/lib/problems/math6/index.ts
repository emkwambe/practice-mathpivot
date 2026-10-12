// Math 6 EOG: procedural factory registry.

import type { ProblemFactory, Math6Technique } from '../../problemGenerator';
import { ratioFactories } from './ratios';
import { expressionFactories } from './expressions';
import { numberSystemFactories } from './numberSystem';
import { geometryFactories } from './geometry';
import { statisticsFactories } from './statistics';

export const math6Factories: Record<Exclude<Math6Technique, 'mixed-g6'>, ProblemFactory[]> = {
  'g6-ratios': ratioFactories,
  'g6-expressions-equations': expressionFactories,
  'g6-number-system': numberSystemFactories,
  'g6-geometry': geometryFactories,
  'g6-statistics': statisticsFactories,
};
