// Math 7 EOG: procedural factory registry.

import type { ProblemFactory, Math7Technique } from '../../problemGenerator';
import { ratioFactories } from './ratios';
import { expressionFactories } from './expressions';
import { numberFactories } from './numbers';
import { geometryFactories } from './geometry';
import { statisticsFactories } from './statistics';
import { probabilityFactories } from './probability';

export const math7Factories: Record<Exclude<Math7Technique, 'mixed-g7'>, ProblemFactory[]> = {
  'g7-ratios-proportions': ratioFactories,
  'g7-expressions-equations': expressionFactories,
  'g7-numbers-operations': numberFactories,
  'g7-geometry': geometryFactories,
  'g7-statistics': statisticsFactories,
  'g7-probability': probabilityFactories,
};
