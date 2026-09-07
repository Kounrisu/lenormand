import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.removeItem('lenormand.looks');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.removeItem('lenormand.looks');
  });

  it('starts on baize cloth and oxblood backs', () => {
    const theme = TestBed.inject(ThemeService);
    expect(theme.cloth().id).toBe('baize');
    expect(theme.back().id).toBe('oxblood');
  });

  it('remembers a chosen cloth and pack', () => {
    const theme = TestBed.inject(ThemeService);
    theme.pickCloth('velvet');
    theme.pickBack('indigo');
    const again = new ThemeService();
    expect(again.cloth().id).toBe('velvet');
    expect(again.back().id).toBe('indigo');
  });
});
