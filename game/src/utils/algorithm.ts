import { normalizeValue } from '.';
import {
  INITIAL_PLAYER_HEALTH,
  INITIAL_BOSS_HEALTH,
  INITIAL_MIN_WORDS_LENGTH,
  INITIAL_MAX_WORDS_LENGTH,
  INITIAL_TOTAL_WAVES,
  INITIAL_WAVE_DELAY,
  INITIAL_COUNT_WORDS_IN_WAVE,
  INITIAL_WORDS_SPEED,
} from '../constants';

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
      prefixList.push(word);
      suffixList.push(wordCurrent.substring(word.length, wordCurrent.length));
    } else {
      prefixList.push('');
      suffixList.push(wordCurrent);
    }
  });

  return { prefixList, suffixList };
};

export const gameRules = (
  level: number
): {
  newPlayerHealth: number;
  newBossHealth: number;
  minWordsLength: number;
  maxWordsLength: number;
  newTotalWaves: number;
  newWaveDelay: number; // in seconds
  newCountWordsInWave: number;
  newWordsSpeed: number;
} => ({
  newPlayerHealth: INITIAL_PLAYER_HEALTH - (level - 1),
  newBossHealth: INITIAL_BOSS_HEALTH + 2 * (level - 1),
  minWordsLength: INITIAL_MIN_WORDS_LENGTH + (level - 1),
  maxWordsLength: INITIAL_MAX_WORDS_LENGTH + 2 + (level - 1),
  newTotalWaves: INITIAL_TOTAL_WAVES + 2 * (level - 1),
  newWaveDelay: INITIAL_WAVE_DELAY - 1350 * (level - 1), // ms
  newCountWordsInWave: INITIAL_COUNT_WORDS_IN_WAVE + Math.ceil(1.5 * (level - 1)),
  newWordsSpeed: INITIAL_WORDS_SPEED - 1000 * (level - 1), // quanto menor mais rápido, seria o tempo na verdade e não velocidade
});
