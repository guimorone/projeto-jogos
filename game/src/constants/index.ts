import { KeyboardEvent } from 'react';
import type { PercentageType } from '../@types';
import type { ConfigType } from '../@types/settings';

export const GAME_NAME: Readonly<string> = 'Type War';
export const REPO_URL: Readonly<string> = 'https://github.com/guimorone/projeto-jogos';
export const MAX_LEVEL: Readonly<number> = 5;
export const DELAY_TO_START_NEW_LEVEL_MS: Readonly<number> = 3000; // ms
export const INITIAL_PLAYER_HEALTH: Readonly<number> = 20;
export const INITIAL_PLAYER_LOSS_HEALTH: Readonly<number> = 2;
export const INITIAL_MIN_WORDS_LENGTH: Readonly<number> = 2;
export const INITIAL_MAX_WORDS_LENGTH: Readonly<number> = 4;
export const INITIAL_DIAGONAL_CHANCE: Readonly<PercentageType> = 15;
export const INITIAL_TOTAL_WAVES: Readonly<number> = 3;
export const INITIAL_WAVE_DELAY: Readonly<number> = 10000; // ms
export const INITIAL_COUNT_WORDS_IN_WAVE: Readonly<number> = 4;
export const INITIAL_WORDS_SPEED: Readonly<number> = 15000; // ms
export const AXLE_GAP: Readonly<number> = 175;
export const POINTS_FOR_DIAGONAL_VALUES: Readonly<number> = 2;
export const POINTS_FOR_NON_NORMALIZED_VALUES: Readonly<number> = 3;
export const CANCEL_KEYS: Readonly<KeyboardEvent<HTMLInputElement>['key'][]> = ['Enter', 'Escape'];
export const INITIAL_VOLUME: Readonly<ConfigType['volume']> = { music: 50, soundEffects: 50 };
export const INITIAL_DIAGONAL_WORDS_BOOL: Readonly<ConfigType['diagonalWords']> = true;
export const INITIAL_CONSIDER_NON_NORMALIZED_WORDS: Readonly<ConfigType['considerNonNormalizedWords']> = true;
