import { ComponentProps } from 'react';
import Timer from '../components/Timer';

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type PercentageType = IntRange<0, 101>;

export type GameStatusOptions =
  | 'starting'
  | 'paused'
  | 'running'
  | 'victory'
  | 'defeat'
  | 'gameOver'
  | 'newLevel'
  | 'levelDone';

type NewLevelType = { initialSeconds: ComponentProps<typeof Timer>['initialSeconds'] };

type CommomEndLevel = { wordsHitsNames: string[]; wordsMissedNames: string[]; points: number };
type VictoryType = CommomEndLevel & {};
type DefeatType = CommomEndLevel & {
  totalWordsHitsNames: string[];
  totalWordsMissedNames: string[];
  totalPoints: number;
};
type GameOverType = CommomEndLevel & {
  totalWordsHitsNames: string[];
  totalWordsMissedNames: string[];
  totalPoints: number;
};

export type TitleType = { status: GameStatusOptions };
export type StatusType = (NewLevelType | undefined) &
  (VictoryType | undefined) &
  (DefeatType | undefined) &
  (GameOverType | undefined);
export type LevelDoneType = (VictoryType | undefined) & (DefeatType | undefined) & (GameOverType | undefined);

export type OnLevelDoneEventType = (
  currentPoints: number,
  currentWordsHitsNames: string[],
  currentWordsMissedNames: string[]
) => void;
