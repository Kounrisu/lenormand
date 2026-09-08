import { TestBed } from '@angular/core/testing';
import { LocaleService } from './locale.service';

describe('LocaleService', () => {
  beforeEach(() => {
    localStorage.removeItem('lenormand.locale');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.removeItem('lenormand.locale');
  });

  it('starts in English', () => {
    const locale = TestBed.inject(LocaleService);
    expect(locale.locale()).toBe('en');
    expect(locale.t('result.yes')).toBe('Yes');
  });

  it('remembers a chosen locale', () => {
    const locale = TestBed.inject(LocaleService);
    locale.set('fr');
    expect(locale.t('result.yes')).toBe('Oui');
    const again = new LocaleService();
    expect(again.locale()).toBe('fr');
  });

  it('toggles between en and fr', () => {
    const locale = TestBed.inject(LocaleService);
    expect(locale.locale()).toBe('en');
    locale.toggle();
    expect(locale.locale()).toBe('fr');
    locale.toggle();
    expect(locale.locale()).toBe('en');
  });
});
