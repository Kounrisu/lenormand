import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { PackService } from '../../core/pack.service';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-looks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './looks.html',
  styleUrl: './looks.scss',
})
export class LooksComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly pack = inject(PackService);
  readonly back = output<void>();
  readonly about = output<void>();

  protected freshPack(): void {
    this.pack.newPack();
    this.back.emit();
  }
}
