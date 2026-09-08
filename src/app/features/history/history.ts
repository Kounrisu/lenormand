import { ChangeDetectionStrategy, Component, OnInit, inject, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReadingsService } from '../../core/readings.service';
import { LocaleService } from '../../core/locale.service';

@Component({
  selector: 'app-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class HistoryComponent implements OnInit {
  protected readonly readingsService = inject(ReadingsService);
  protected readonly locale = inject(LocaleService);
  protected readonly t = this.locale.t;
  readonly back = output<void>();

  ngOnInit(): void {
    void this.readingsService.loadHistory();
  }
}
