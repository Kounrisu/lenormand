import { describe, expect, it } from 'vitest';
import { LENORMAND_CARDS, RING_CARD_NUMBER, YES_NO_CUTOFF } from './cards.data';
import { cut, drawYesNo, shuffle } from './deck';

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

describe('drawYesNo', () => {
  it('always finds the Ring card at a valid 1-based position', () => {
    for (let i = 0; i < 50; i++) {
      const { deck, ringPosition } = drawYesNo();
      expect(ringPosition).toBeGreaterThanOrEqual(1);
      expect(ringPosition).toBeLessThanOrEqual(deck.length);
      expect(deck[ringPosition - 1].number).toBe(RING_CARD_NUMBER);
    }
  });

  it('answers yes iff the Ring is within the first 13 cards', () => {
    for (let i = 0; i < 50; i++) {
      const { ringPosition, answer } = drawYesNo();
      expect(answer).toBe(ringPosition <= YES_NO_CUTOFF ? 'yes' : 'no');
    }
  });

  it('produces both yes and no answers over many draws', () => {
    const answers = new Set(Array.from({ length: 200 }, () => drawYesNo().answer));
    expect(answers.has('yes')).toBe(true);
    expect(answers.has('no')).toBe(true);
  });
});
