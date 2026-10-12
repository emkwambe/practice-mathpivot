// Math 8 EOG: procedural factory registry.

import type { ProblemFactory, Math8Technique } from '../../problemGenerator';
import { functionFactories } from './functions';
import { equationFactories } from './equations';
import { geometryFactories } from './geometry';
import { statisticsFactories } from './statistics';
import { numberSystemFactories } from './numberSystem';

export const math8Factories: Record<Exclude<Math8Technique, 'mixed-g8'>, ProblemFactory[]> = {
  'g8-functions': functionFactories,
  'g8-expressions-equations': equationFactories,
  'g8-geometry': geometryFactories,
  'g8-statistics-probability': statisticsFactories,
  'g8-number-system': numberSystemFactories,
};
