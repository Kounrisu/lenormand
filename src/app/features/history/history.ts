import { ChangeDetectionStrategy, Component, OnInit, inject, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReadingsService } from '../../core/readings.service';

@Component({
  selector: 'app-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class HistoryComponent implements OnInit {
  protected readonly readingsService = inject(ReadingsService);
  readonly back = output<void>();

  ngOnInit(): void {
    void this.readingsService.loadHistory();
  }
}
