import { TestBed } from '@angular/core/testing';
import { LENORMAND_CARDS } from './cards.data';
import { PackService } from './pack.service';
import { isFactoryOrder } from './deck';

describe('PackService', () => {
  beforeEach(() => {
    localStorage.removeItem('lenormand.pack');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.removeItem('lenormand.pack');
  });

  it('starts as a boxed pack and newPack restores that order', () => {
    const pack = TestBed.inject(PackService);
    expect(isFactoryOrder(pack.cards())).toBe(true);
    pack.set([...LENORMAND_CARDS].reverse());
    expect(isFactoryOrder(pack.cards())).toBe(false);
    pack.newPack();
    expect(isFactoryOrder(pack.cards())).toBe(true);
    expect(pack.isFactory()).toBe(true);
  });

  it('remembers a mixed pack in localStorage', () => {
    const pack = TestBed.inject(PackService);
    const mixed = [...LENORMAND_CARDS].reverse();
    pack.set(mixed);
    const again = new PackService();
    expect(again.cards().map((card) => card.number)).toEqual(mixed.map((card) => card.number));
  });
});
