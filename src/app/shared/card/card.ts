import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CARD_SYMBOLS } from '../../core/card-symbols';
import type { LenormandCard } from '../../core/models';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardComponent {
  readonly card = input.required<LenormandCard>();
  readonly faceDown = input(false);
  readonly highlighted = input(false);

  protected symbolFor(slug: string): string {
    return CARD_SYMBOLS[slug] ?? '🂠';
  }
}
