import { LENORMAND_CARDS, RING_CARD_NUMBER, YES_NO_CUTOFF } from './cards.data';
import type { Answer, LenormandCard } from './models';

export type ShuffleStyle = 'riffle' | 'overhand' | 'strip' | 'wash' | 'casino';

/** Fisher-Yates — a thorough table wash / scramble. */
export function shuffle<T>(cards: readonly T[]): T[] {
  const result = [...cards];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Table riffle: split ~in half, interleave with 1–2 card drops (blackjack/poker). */
export function riffleShuffle<T>(cards: readonly T[]): T[] {
  if (cards.length < 2) {
    return [...cards];
  }
  const jitter = Math.floor(Math.random() * 5) - 2;
  const mid = Math.min(cards.length - 1, Math.max(1, Math.floor(cards.length / 2) + jitter));
  const left = cards.slice(0, mid);
  const right = cards.slice(mid);
  const out: T[] = [];
  let i = 0;
  let j = 0;
  while (i < left.length || j < right.length) {
    const fromLeft = j >= right.length || (i < left.length && Math.random() < 0.5);
    const take = 1 + Math.floor(Math.random() * 2);
    if (fromLeft) {
      const n = Math.min(take, left.length - i);
      out.push(...left.slice(i, i + n));
      i += n;
    } else {
      const n = Math.min(take, right.length - j);
      out.push(...right.slice(j, j + n));
      j += n;
    }
  }
  return out;
}

/** Overhand: peel small packets off the top onto a new pile. */
export function overhandShuffle<T>(cards: readonly T[]): T[] {
  const held = [...cards];
  let out: T[] = [];
  while (held.length) {
    const n = Math.min(held.length, 1 + Math.floor(Math.random() * 5));
    const packet = held.splice(0, n);
    out = [...packet, ...out];
  }
  return out;
}

/** Casino strip / box: a few running packets off the top, dropped onto the table. */
export function stripShuffle<T>(cards: readonly T[], packets = 4): T[] {
  const held = [...cards];
  let out: T[] = [];
  const piles = Math.min(packets, held.length);
  for (let p = 0; p < piles; p++) {
    const remainingPiles = piles - p;
    const n =
      p === piles - 1
        ? held.length
        : Math.max(1, Math.floor(held.length / remainingPiles + (Math.random() * 3 - 1)));
    const packet = held.splice(0, Math.min(held.length, n));
    out = [...packet, ...out];
  }
  return out;
}

/** Poker-room “casino shuffle”: riffle, riffle, strip, riffle. Cut is a separate step. */
export function casinoShuffle<T>(cards: readonly T[]): T[] {
  return riffleShuffle(stripShuffle(riffleShuffle(riffleShuffle(cards))));
}

export function shuffleWith<T>(cards: readonly T[], style: ShuffleStyle): T[] {
  switch (style) {
    case 'riffle':
      return riffleShuffle(cards);
    case 'overhand':
      return overhandShuffle(cards);
    case 'strip':
      return stripShuffle(cards);
    case 'wash':
      return shuffle(cards);
    case 'casino':
      return casinoShuffle(cards);
  }
}

/** A boxed pack: Rider through Cross, numbers 1–36. */
export function newPack(): LenormandCard[] {
  return [...LENORMAND_CARDS];
}

export function isFactoryOrder(cards: readonly LenormandCard[]): boolean {
  return (
    cards.length === LENORMAND_CARDS.length &&
    cards.every((card, index) => card.number === LENORMAND_CARDS[index].number)
  );
}

/**
 * Rebuild a pack from stored card numbers. Wrong length, duplicates, or
 * unknown numbers fall back to a boxed pack — never a partial deck.
 */
export function packFromNumbers(numbers: unknown): LenormandCard[] {
  if (!Array.isArray(numbers) || numbers.length !== LENORMAND_CARDS.length) {
    return newPack();
  }
  const byNumber = new Map(LENORMAND_CARDS.map((card) => [card.number, card]));
  const seen = new Set<number>();
  const out: LenormandCard[] = [];
  for (const value of numbers) {
    if (typeof value !== 'number' || seen.has(value)) {
      return newPack();
    }
    const card = byNumber.get(value);
    if (!card) {
      return newPack();
    }
    seen.add(value);
    out.push(card);
  }
  return out;
}

/**
 * The card at `depth` (1-based, 1…length) is the cut card.
 * Cards above it go under the rest. Depth === length means the last card
 * of the spread is the cut; the pack order is unchanged.
 */
export function cutAt<T>(
  cards: readonly T[],
  depth: number,
): { readonly cutCard: T; readonly deck: T[] } {
  if (depth < 1 || depth > cards.length) {
    throw new RangeError(`cut depth must be between 1 and ${cards.length}`);
  }
  const lifted = cards.slice(0, depth);
  const rest = cards.slice(depth);
  return {
    cutCard: lifted[lifted.length - 1],
    deck: rest.length === 0 ? [...cards] : [...rest, ...lifted],
  };
}

/** Cuts a shuffled deck at a random point, moving the top portion to the bottom. */
export function cut<T>(cards: readonly T[]): T[] {
  const depth = 1 + Math.floor(Math.random() * (cards.length - 1));
  return cutAt(cards, depth).deck;
}

export interface DrawResult {
  readonly deck: readonly LenormandCard[];
  readonly cutCard: LenormandCard;
  readonly cutDepth: number;
  readonly ringPosition: number;
  readonly answer: Answer;
  readonly atCut: boolean;
}

/** Apply a player-chosen cut to an already shuffled deck and score the Ring. */
export function readingFromCut(shuffled: readonly LenormandCard[], depth: number): DrawResult {
  const { cutCard, deck } = cutAt(shuffled, depth);
  const atCut = cutCard.number === RING_CARD_NUMBER;
  const ringPosition = deck.findIndex((card) => card.number === RING_CARD_NUMBER) + 1;
  const answer: Answer = atCut || ringPosition <= YES_NO_CUTOFF ? 'yes' : 'no';
  return { deck, cutCard, cutDepth: depth, ringPosition, answer, atCut };
}

/** Shuffles and cuts a fresh deck, then locates the Ring card to decide yes/no. */
export function drawYesNo(): DrawResult {
  const shuffled = shuffle(LENORMAND_CARDS);
  const depth = 1 + Math.floor(Math.random() * (shuffled.length - 1));
  return readingFromCut(shuffled, depth);
}
