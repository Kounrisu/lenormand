import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CardComponent } from '../../shared/card/card';
import { ReadingsService } from '../../core/readings.service';
import { RING_CARD_NUMBER, YES_NO_CUTOFF } from '../../core/cards.data';
import type { DrawResult } from '../../core/deck';
import { playDeal } from '../../core/sounds';
import { LocaleService } from '../../core/locale.service';

const REVEAL_MS = 320;
const RING_BEAT_MS = 900;

@Component({
  selector: 'app-reading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardComponent],
  templateUrl: './reading.html',
  styleUrl: './reading.scss',
})
export class ReadingComponent implements OnInit, OnDestroy {
  private readonly readingsService = inject(ReadingsService);
  protected readonly locale = inject(LocaleService);
  protected readonly t = this.locale.t;

  readonly draw = input.required<DrawResult>();
  readonly question = input<string | null>(null);
  /** Fires once, exactly when the reveal animation reaches its result — the
   * parent renders the verdict/back-to-table panel outside the felt mat. */
  readonly revealComplete = output<void>();

  protected readonly ringNumber = RING_CARD_NUMBER;
  protected readonly stockLayers = [0, 1, 2, 3, 4, 5, 6];
  protected readonly revealedCount = signal(0);
  protected readonly firstThirteen = computed(() => this.draw().deck.slice(0, YES_NO_CUTOFF));
  protected readonly done = computed(() => this.revealedCount() >= YES_NO_CUTOFF);
  protected readonly cutCardName = computed(() => {
    const card = this.draw().cutCard;
    return this.locale.isFr() ? card.nameFr : card.name;
  });

  private timer?: ReturnType<typeof setTimeout>;
  private recorded = false;
  private destroyed = false;

  ngOnInit(): void {
    if (this.draw().atCut) {
      this.finish();
      return;
    }
    if (prefersReducedMotion()) {
      this.revealedCount.set(YES_NO_CUTOFF);
      this.finish();
      return;
    }
    this.queueReveal(REVEAL_MS);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    clearTimeout(this.timer);
  }

  protected skipToEnd(): void {
    if (this.done()) {
      return;
    }
    clearTimeout(this.timer);
    this.revealedCount.set(YES_NO_CUTOFF);
    this.finish();
  }

  private queueReveal(delay: number): void {
    this.timer = setTimeout(() => this.revealNext(), delay);
  }

  private revealNext(): void {
    if (this.destroyed || this.done()) {
      return;
    }
    const next = this.revealedCount() + 1;
    this.revealedCount.set(next);
    playDeal();
    if (next >= YES_NO_CUTOFF) {
      this.finish();
      return;
    }
    const justRevealed = this.firstThirteen()[next - 1];
    const delay = justRevealed.number === RING_CARD_NUMBER ? RING_BEAT_MS : REVEAL_MS;
    this.queueReveal(delay);
  }

  private finish(): void {
    this.revealComplete.emit();
    void this.record();
  }

  private async record(): Promise<void> {
    if (this.recorded) {
      return;
    }
    this.recorded = true;
    await this.readingsService.record({
      question: this.question(),
      ringPosition: this.draw().ringPosition,
      answer: this.draw().answer,
    });
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
