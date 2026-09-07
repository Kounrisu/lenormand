import { Injectable, computed, signal } from '@angular/core';
import type { LenormandCard } from './models';
import { isFactoryOrder, newPack, packFromNumbers } from './deck';

const STORAGE_KEY = 'lenormand.pack';

@Injectable({ providedIn: 'root' })
export class PackService {
  private readonly cardsSignal = signal<LenormandCard[]>(readStoredPack());

  readonly cards = this.cardsSignal.asReadonly();
  readonly isFactory = computed(() => isFactoryOrder(this.cardsSignal()));

  set(cards: readonly LenormandCard[]): void {
    const next = [...cards];
    this.cardsSignal.set(next);
    writeStoredPack(next);
  }

  newPack(): void {
    this.set(newPack());
  }
}

function readStoredPack(): LenormandCard[] {
  if (typeof localStorage === 'undefined') {
    return newPack();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return packFromNumbers(raw ? JSON.parse(raw) : null);
  } catch {
    return newPack();
  }
}

function writeStoredPack(cards: readonly LenormandCard[]): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards.map((card) => card.number)));
  } catch {
    // Private mode / quota — keep going with in-memory order.
  }
}
