import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { LenormandCard } from '../../core/models';
import { ThemeService } from '../../core/theme.service';
import { LocaleService } from '../../core/locale.service';

@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class CardComponent {
  private readonly theme = inject(ThemeService);
  private readonly locale = inject(LocaleService);

  readonly card = input.required<LenormandCard>();
  readonly faceDown = input(false);
  readonly highlighted = input(false);
  protected readonly backSrc = this.theme.backSrc;
  protected readonly name = computed(() =>
    this.locale.isFr() ? this.card().nameFr : this.card().name,
  );
}
