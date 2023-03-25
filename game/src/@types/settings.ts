import type { PercentageType } from '.';

export type ConfigType = {
  volume: { music: PercentageType; soundEffects: PercentageType };
  diagonalWords: boolean;
  considerNonNormalizedWords: boolean;
};
