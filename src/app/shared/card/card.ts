import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import type { LenormandCard } from '../../core/models';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardComponent {
  private readonly theme = inject(ThemeService);

  readonly card = input.required<LenormandCard>();
  readonly faceDown = input(false);
  readonly highlighted = input(false);
  protected readonly backSrc = this.theme.backSrc;
}
