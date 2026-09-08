import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { PackService } from '../../core/pack.service';
import { ThemeService } from '../../core/theme.service';
import { LocaleService } from '../../core/locale.service';

@Component({
  selector: 'app-looks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './looks.html',
  styleUrl: './looks.scss',
})
export class LooksComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly pack = inject(PackService);
  protected readonly locale = inject(LocaleService);
  protected readonly t = this.locale.t;
  readonly back = output<void>();

  protected freshPack(): void {
    this.pack.newPack();
    this.back.emit();
  }
}
