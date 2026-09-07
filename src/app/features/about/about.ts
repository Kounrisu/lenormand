import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { LENORMAND_CARDS } from '../../core/cards.data';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  readonly back = output<void>();
  protected readonly cards = LENORMAND_CARDS;
}
