import { Injectable, computed, signal } from '@angular/core';
import type { Locale } from './models';
import { I18N, type I18nKey } from './i18n.data';

const STORAGE_KEY = 'lenormand.locale';
const DEFAULT_LOCALE: Locale = 'en';

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly localeSignal = signal<Locale>(readStoredLocale());

  readonly locale = this.localeSignal.asReadonly();
  readonly isFr = computed(() => this.localeSignal() === 'fr');

  constructor() {
    // t() closes over localeSignal, so it stays reactive in templates.
  }

  set(locale: Locale): void {
    if (locale !== 'en' && locale !== 'fr') {
      return;
    }
    this.localeSignal.set(locale);
    writeStoredLocale(locale);
  }

  toggle(): void {
    this.set(this.localeSignal() === 'en' ? 'fr' : 'en');
  }

  readonly t = (key: I18nKey, ...args: Array<number | string>): string => {
    const entry = I18N[key];
    const value = this.localeSignal() === 'fr' ? entry.fr : entry.en;
    return typeof value === 'function' ? (value as (...a: Array<number | string>) => string)(...args) : value;
  };
}

function readStoredLocale(): Locale {
  if (typeof localStorage === 'undefined') {
    return DEFAULT_LOCALE;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'fr' || raw === 'en' ? raw : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function writeStoredLocale(locale: Locale): void {
  if (typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Private mode / quota.
  }
}
