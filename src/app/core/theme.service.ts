import { Injectable, computed, signal } from '@angular/core';

export interface ThemeOption {
  readonly id: string;
  readonly label: string;
  readonly src: string;
}

export const CLOTHS: readonly ThemeOption[] = [
  { id: 'baize', label: 'Baize', src: '/table/cloth-baize.jpg' },
  { id: 'velvet', label: 'Velvet', src: '/table/cloth-velvet.jpg' },
];

export const BACKS: readonly ThemeOption[] = [
  { id: 'oxblood', label: 'Oxblood', src: '/backs/oxblood.jpg' },
  { id: 'indigo', label: 'Indigo', src: '/backs/indigo.jpg' },
  { id: 'tartan', label: 'Tartan', src: '/backs/tartan.jpg' },
];

export const FACES: readonly ThemeOption[] = [
  { id: 'hope', label: 'Game of Hope', src: '/cards/ring.jpg' },
];

const STORAGE_KEY = 'lenormand.looks';
const DEFAULT_CLOTH = 'baize';
const DEFAULT_BACK = 'oxblood';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly clothId = signal(DEFAULT_CLOTH);
  private readonly backId = signal(DEFAULT_BACK);

  readonly cloths = CLOTHS;
  readonly backs = BACKS;
  readonly faces = FACES;
  readonly cloth = computed(() => findOption(CLOTHS, this.clothId(), DEFAULT_CLOTH));
  readonly back = computed(() => findOption(BACKS, this.backId(), DEFAULT_BACK));
  readonly face = computed(() => FACES[0]);
  readonly backSrc = computed(() => this.back().src.replace(/^\//, ''));

  constructor() {
    this.restore();
    this.paint();
  }

  pickCloth(id: string): void {
    if (!CLOTHS.some((item) => item.id === id)) {
      return;
    }
    this.clothId.set(id);
    this.persist();
    this.paint();
  }

  pickBack(id: string): void {
    if (!BACKS.some((item) => item.id === id)) {
      return;
    }
    this.backId.set(id);
    this.persist();
    this.paint();
  }

  private restore(): void {
    const saved = readLooks();
    if (saved.cloth) {
      this.clothId.set(saved.cloth);
    }
    if (saved.back) {
      this.backId.set(saved.back);
    }
  }

  private persist(): void {
    writeLooks({ cloth: this.clothId(), back: this.backId() });
  }

  private paint(): void {
    if (typeof document === 'undefined') {
      return;
    }
    const root = document.documentElement;
    root.style.setProperty('--table-image', `url("${this.cloth().src}")`);
    root.style.setProperty(
      '--mat-fill',
      this.clothId() === 'baize' ? 'none' : `url("${this.cloth().src}")`,
    );
    root.style.setProperty('--card-back-image', `url("${this.back().src}")`);
  }
}

function findOption(
  options: readonly ThemeOption[],
  id: string,
  fallbackId: string,
): ThemeOption {
  return options.find((item) => item.id === id) ?? options.find((item) => item.id === fallbackId)!;
}

function readLooks(): { cloth?: string; back?: string } {
  if (typeof localStorage === 'undefined') {
    return {};
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const cloth =
      typeof parsed?.cloth === 'string' && CLOTHS.some((item) => item.id === parsed.cloth)
        ? parsed.cloth
        : undefined;
    const back =
      typeof parsed?.back === 'string' && BACKS.some((item) => item.id === parsed.back)
        ? parsed.back
        : undefined;
    return { cloth, back };
  } catch {
    return {};
  }
}

function writeLooks(value: { cloth: string; back: string }): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Private mode / quota.
  }
}
