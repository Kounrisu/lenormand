import type { LenormandCard } from './models';

/** The 36-card Petit Lenormand deck, in standard traditional order. Card #25 (Ring) is the pivot for the yes/no reading. */
export const LENORMAND_CARDS: readonly LenormandCard[] = [
  { number: 1, name: 'Rider', slug: 'rider', playingCard: '9♥' },
  { number: 2, name: 'Clover', slug: 'clover', playingCard: '6♦' },
  { number: 3, name: 'Ship', slug: 'ship', playingCard: '10♠' },
  { number: 4, name: 'House', slug: 'house', playingCard: 'Q♥' },
  { number: 5, name: 'Tree', slug: 'tree', playingCard: '7♣' },
  { number: 6, name: 'Clouds', slug: 'clouds', playingCard: 'Q♣' },
  { number: 7, name: 'Snake', slug: 'snake', playingCard: '9♦' },
  { number: 8, name: 'Coffin', slug: 'coffin', playingCard: '10♥' },
  { number: 9, name: 'Bouquet', slug: 'bouquet', playingCard: '8♦' },
  { number: 10, name: 'Scythe', slug: 'scythe', playingCard: 'J♠' },
  { number: 11, name: 'Whip', slug: 'whip', playingCard: 'J♦' },
  { number: 12, name: 'Bird', slug: 'bird', playingCard: '7♠' },
  { number: 13, name: 'Child', slug: 'child', playingCard: '10♣' },
  { number: 14, name: 'Fox', slug: 'fox', playingCard: '9♠' },
  { number: 15, name: 'Bear', slug: 'bear', playingCard: '10♦' },
  { number: 16, name: 'Stars', slug: 'stars', playingCard: '6♠' },
  { number: 17, name: 'Stork', slug: 'stork', playingCard: 'Q♦' },
  { number: 18, name: 'Dog', slug: 'dog', playingCard: '8♠' },
  { number: 19, name: 'Tower', slug: 'tower', playingCard: 'K♣' },
  { number: 20, name: 'Garden', slug: 'garden', playingCard: '8♥' },
  { number: 21, name: 'Mountain', slug: 'mountain', playingCard: 'K♠' },
  { number: 22, name: 'Path', slug: 'path', playingCard: '7♦' },
  { number: 23, name: 'Mice', slug: 'mice', playingCard: '7♥' },
  { number: 24, name: 'Heart', slug: 'heart', playingCard: 'A♥' },
  { number: 25, name: 'Ring', slug: 'ring', playingCard: 'A♣' },
  { number: 26, name: 'Book', slug: 'book', playingCard: 'A♦' },
  { number: 27, name: 'Letter', slug: 'letter', playingCard: '8♣' },
  { number: 28, name: 'Gentleman', slug: 'gentleman', playingCard: 'K♥' },
  { number: 29, name: 'Lady', slug: 'lady', playingCard: 'Q♠' },
  { number: 30, name: 'Lily', slug: 'lily', playingCard: 'K♦' },
  { number: 31, name: 'Sun', slug: 'sun', playingCard: '9♣' },
  { number: 32, name: 'Moon', slug: 'moon', playingCard: 'J♣' },
  { number: 33, name: 'Key', slug: 'key', playingCard: 'A♠' },
  { number: 34, name: 'Fish', slug: 'fish', playingCard: 'J♥' },
  { number: 35, name: 'Anchor', slug: 'anchor', playingCard: '6♣' },
  { number: 36, name: 'Cross', slug: 'cross', playingCard: '6♥' },
];

export const RING_CARD_NUMBER = 25;
export const YES_NO_CUTOFF = 13;
