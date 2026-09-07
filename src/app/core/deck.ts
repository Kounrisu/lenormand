import { LENORMAND_CARDS, RING_CARD_NUMBER, YES_NO_CUTOFF } from './cards.data';
import type { Answer, LenormandCard } from './models';

/** Fisher-Yates shuffle. Pure — takes and returns a new array, never mutates the input. */
export function shuffle<T>(cards: readonly T[]): T[] {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Cuts a shuffled deck at a random point, moving the bottom portion to the top. */
export function cut<T>(cards: readonly T[]): T[] {
  const cutPoint = 1 + Math.floor(Math.random() * (cards.length - 1));
  return [...cards.slice(cutPoint), ...cards.slice(0, cutPoint)];
}

export interface DrawResult {
  readonly deck: readonly LenormandCard[];
  readonly ringPosition: number;
  readonly answer: Answer;
}

/** Shuffles and cuts a fresh deck, then locates the Ring card to decide yes/no. */
export function drawYesNo(): DrawResult {
  const deck = cut(shuffle(LENORMAND_CARDS));
  const ringPosition = deck.findIndex((card) => card.number === RING_CARD_NUMBER) + 1;
  const answer: Answer = ringPosition <= YES_NO_CUTOFF ? 'yes' : 'no';
  return { deck, ringPosition, answer };
}
