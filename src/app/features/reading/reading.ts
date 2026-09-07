import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { CardComponent } from '../../shared/card/card';
import { ReadingsService } from '../../core/readings.service';
import { YES_NO_CUTOFF } from '../../core/cards.data';
import type { DrawResult } from '../../core/deck';

const REVEAL_INTERVAL_MS = 260;

@Component({
  selector: 'app-reading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent],
  templateUrl: './reading.html',
  styleUrl: './reading.scss',
})
export class ReadingComponent implements OnInit, OnDestroy {
  private readonly readingsService = inject(ReadingsService);

  readonly draw = input.required<DrawResult>();
  readonly question = input<string | null>(null);
  readonly again = output<void>();
  readonly viewHistory = output<void>();

  protected readonly cutoff = YES_NO_CUTOFF;
  protected readonly revealedCount = signal(0);
  protected readonly firstThirteen = computed(() => this.draw().deck.slice(0, YES_NO_CUTOFF));
  protected readonly done = computed(() => this.revealedCount() >= YES_NO_CUTOFF);

  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.revealedCount.update((n) => {
        const next = n + 1;
        if (next >= YES_NO_CUTOFF) {
          clearInterval(this.timer);
          void this.readingsService.record({
            question: this.question(),
            ringPosition: this.draw().ringPosition,
            answer: this.draw().answer,
          });
        }
        return next;
      });
    }, REVEAL_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }
}
