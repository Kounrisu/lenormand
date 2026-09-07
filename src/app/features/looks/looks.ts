import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ThemeService } from '../../core/theme.service';

@Component({
  selector: 'app-looks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './looks.html',
  styleUrl: './looks.scss',
})
export class LooksComponent {
  protected readonly theme = inject(ThemeService);
  readonly back = output<void>();
}
