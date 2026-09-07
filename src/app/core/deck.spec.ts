import { describe, expect, it } from 'vitest';
import { LENORMAND_CARDS, RING_CARD_NUMBER, YES_NO_CUTOFF } from './cards.data';
import {
  casinoShuffle,
  cut,
  cutAt,
  drawYesNo,
  overhandShuffle,
  isFactoryOrder,
  newPack,
  packFromNumbers,
  readingFromCut,
  riffleShuffle,
  shuffle,
  stripShuffle,
} from './deck';

describe('shuffle', () => {
  it('returns every card exactly once', () => {
    const result = shuffle(LENORMAND_CARDS);
    expect(result).toHaveLength(LENORMAND_CARDS.length);
    expect(new Set(result.map((c) => c.number)).size).toBe(LENORMAND_CARDS.length);
  });

  it('does not mutate the input array', () => {
    const before = [...LENORMAND_CARDS];
    shuffle(LENORMAND_CARDS);
    expect(LENORMAND_CARDS).toEqual(before);
  });
});

function isFullDeck<T extends { number: number }>(result: T[]): void {
  expect(result).toHaveLength(LENORMAND_CARDS.length);
  expect(new Set(result.map((c) => c.number)).size).toBe(LENORMAND_CARDS.length);
}

describe('table shuffles', () => {
  it('riffle, overhand, strip, wash and casino each keep every card', () => {
    isFullDeck(riffleShuffle(LENORMAND_CARDS));
    isFullDeck(overhandShuffle(LENORMAND_CARDS));
    isFullDeck(stripShuffle(LENORMAND_CARDS));
    isFullDeck(shuffle(LENORMAND_CARDS));
    isFullDeck(casinoShuffle(LENORMAND_CARDS));
  });
});

describe('cutAt', () => {
  it('moves the lifted top pile under the rest and names the cut card', () => {
    const deck = [...LENORMAND_CARDS];
    const depth = 5;
    const { cutCard, deck: result } = cutAt(deck, depth);
    expect(cutCard).toBe(deck[depth - 1]);
    expect(result).toEqual([...deck.slice(depth), ...deck.slice(0, depth)]);
    expect(result).toHaveLength(deck.length);
  });

  it('lets the last card of the spread be the cut card', () => {
    const deck = [...LENORMAND_CARDS];
    const { cutCard, deck: result } = cutAt(deck, deck.length);
    expect(cutCard).toBe(deck[deck.length - 1]);
    expect(result).toEqual(deck);
  });
});

describe('cut', () => {
  it('preserves all cards and their cyclic order', () => {
    const deck = shuffle(LENORMAND_CARDS);
    const result = cut(deck);
    expect(result).toHaveLength(deck.length);
    const startIndex = deck.indexOf(result[0]);
    const rotated = [...deck.slice(startIndex), ...deck.slice(0, startIndex)];
    expect(result).toEqual(rotated);
  });
});

describe('readingFromCut', () => {
  it('answers yes at once when the Ring is the cut card, even though it ends at the bottom', () => {
    const ringIndex = LENORMAND_CARDS.findIndex((c) => c.number === RING_CARD_NUMBER);
    const depth = ringIndex + 1;
    const result = readingFromCut(LENORMAND_CARDS, depth);
    expect(result.atCut).toBe(true);
    expect(result.cutCard.number).toBe(RING_CARD_NUMBER);
    expect(result.answer).toBe('yes');
    expect(result.ringPosition).toBe(LENORMAND_CARDS.length);
  });

  it('answers yes when the Ring is in the first 13 after the cut', () => {
    const result = readingFromCut(LENORMAND_CARDS, 20);
    expect(result.atCut).toBe(false);
    expect(result.ringPosition).toBeLessThanOrEqual(YES_NO_CUTOFF);
    expect(result.answer).toBe('yes');
  });

  it('answers no when the Ring is after the first 13 and was not the cut', () => {
    const result = readingFromCut(LENORMAND_CARDS, 1);
    expect(result.atCut).toBe(false);
    expect(result.ringPosition).toBeGreaterThan(YES_NO_CUTOFF);
    expect(result.answer).toBe('no');
  });
});

describe('mix-cut then reading', () => {
  it('keeps the restacked order for the next cut', () => {
    const mixed = cutAt(LENORMAND_CARDS, 1).deck;
    expect(mixed[0].number).toBe(2);
    expect(mixed.at(-1)?.number).toBe(1);
    const reading = readingFromCut(mixed, 1);
    expect(reading.cutCard.number).toBe(2);
    expect(reading.deck.at(-1)?.number).toBe(2);
    expect(isFactoryOrder(mixed)).toBe(false);
  });
});

describe('packFromNumbers', () => {
  it('rebuilds a mixed pack from card numbers', () => {
    const mixed = [...LENORMAND_CARDS].reverse();
    const restored = packFromNumbers(mixed.map((card) => card.number));
    expect(restored.map((card) => card.number)).toEqual(mixed.map((card) => card.number));
    expect(isFactoryOrder(restored)).toBe(false);
  });

  it('falls back to a boxed pack when the payload is damaged', () => {
    expect(packFromNumbers(null).map((c) => c.number)).toEqual(LENORMAND_CARDS.map((c) => c.number));
    expect(packFromNumbers([1, 2, 3]).map((c) => c.number)).toEqual(
      LENORMAND_CARDS.map((c) => c.number),
    );
    expect(isFactoryOrder(newPack())).toBe(true);
  });
});

describe('drawYesNo', () => {
  it('always finds the Ring card at a valid 1-based position', () => {
    for (let i = 0; i < 50; i++) {
      const { deck, ringPosition } = drawYesNo();
      expect(ringPosition).toBeGreaterThanOrEqual(1);
      expect(ringPosition).toBeLessThanOrEqual(deck.length);
      expect(deck[ringPosition - 1].number).toBe(RING_CARD_NUMBER);
    }
  });

  it('answers yes if the Ring was at the cut or in the first 13', () => {
    for (let i = 0; i < 80; i++) {
      const { ringPosition, answer, atCut } = drawYesNo();
      expect(answer).toBe(atCut || ringPosition <= YES_NO_CUTOFF ? 'yes' : 'no');
    }
  });

  it('produces both yes and no answers over many draws', () => {
    const answers = new Set(Array.from({ length: 200 }, () => drawYesNo().answer));
    expect(answers.has('yes')).toBe(true);
    expect(answers.has('no')).toBe(true);
  });
});
