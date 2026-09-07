import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { LENORMAND_CARDS } from '../../core/cards.data';
import { ParisMapComponent } from './paris-map';

const LARGE_CARDS_KEY = 'lenormand.aboutLargeCards';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ParisMapComponent],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  readonly back = output<void>();
  protected readonly cards = LENORMAND_CARDS;

  protected readonly largeCards = signal(this.readStoredPreference());

  protected toggleCardSize(): void {
    this.largeCards.update((v) => {
      const next = !v;
      try {
        localStorage.setItem(LARGE_CARDS_KEY, next ? '1' : '0');
      } catch {
        // localStorage can be unavailable (private mode); the toggle still works this session.
      }
      return next;
    });
  }

  private readStoredPreference(): boolean {
    try {
      return localStorage.getItem(LARGE_CARDS_KEY) === '1';
    } catch {
      return false;
    }
  }
}
