import { normalizeValue } from '.';
import {
  INITIAL_PLAYER_HEALTH,
  INITIAL_PLAYER_LOSS_HEALTH,
  INITIAL_MIN_WORDS_LENGTH,
  INITIAL_MAX_WORDS_LENGTH,
  INITIAL_TOTAL_WAVES,
  INITIAL_WAVE_DELAY,
  INITIAL_COUNT_WORDS_IN_WAVE,
  INITIAL_WORDS_SPEED,
  POINTS_FOR_DIAGONAL_VALUES,
  POINTS_FOR_NON_NORMALIZED_VALUES,
  INITIAL_DIAGONAL_CHANCE,
} from '../constants';
import type { PercentageType } from '../@types';

export const handleChangeWord = (
  wordWritten: string,
  wordsList: string[],
  normalizeWord: boolean = false
): { prefixList: string[]; suffixList: string[] } => {
  const word: string = normalizeWord ? normalizeValue(wordWritten) : wordWritten;

  const prefixList: string[] = [];
  const suffixList: string[] = [];

  wordsList.forEach((w: string) => {
    const wordCurrent: string = normalizeWord ? normalizeValue(w) : w;

    if (wordCurrent.substring(0, word.length) === word) {
      prefixList.push(wordWritten);
      suffixList.push(w.substring(wordWritten.length, w.length));
    } else {
      prefixList.push('');
      suffixList.push(w);
    }
  });

  return { prefixList, suffixList };
};

export const gameRules = (
  level: number
): {
  newPlayerHealth: number;
  newPlayerLossHealth: number;
  minWordsLength: number;
  maxWordsLength: number;
  newDiagonalChance: PercentageType;
  newTotalWaves: number;
  newWaveDelay: number; // in seconds
  newCountWordsInWave: number;
  newWordsSpeed: number;
} => ({
  newPlayerHealth: INITIAL_PLAYER_HEALTH - (level - 1),
  newPlayerLossHealth: INITIAL_PLAYER_LOSS_HEALTH + (level - 1),
  minWordsLength: INITIAL_MIN_WORDS_LENGTH + (level - 1),
  maxWordsLength: INITIAL_MAX_WORDS_LENGTH + (level - 1),
  newDiagonalChance: Math.min(100, INITIAL_DIAGONAL_CHANCE + 10 * (level - 1)) as PercentageType,
  newTotalWaves: INITIAL_TOTAL_WAVES + 2 * (level - 1),
  newWaveDelay: INITIAL_WAVE_DELAY - 1350 * (level - 1), // ms
  newCountWordsInWave: INITIAL_COUNT_WORDS_IN_WAVE + Math.ceil(1.5 * (level - 1)),
  newWordsSpeed: INITIAL_WORDS_SPEED - 1000 * (level - 1), // quanto menor mais rápido, seria o tempo na verdade e não velocidade
});

export const getPointsGained = (
  level: number,
  wordHitLength: number,
  isDiagonal: boolean,
  isNormalized: boolean
): number =>
  level *
  wordHitLength *
  (isDiagonal ? POINTS_FOR_DIAGONAL_VALUES : 1) *
  (isNormalized ? 1 : POINTS_FOR_NON_NORMALIZED_VALUES);
