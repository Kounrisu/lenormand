import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/card/card';
import { LENORMAND_CARDS, RING_CARD_NUMBER } from '../../core/cards.data';
import { PackService } from '../../core/pack.service';
import { LocaleService } from '../../core/locale.service';
import { cutAt, casinoShuffle, readingFromCut, type DrawResult } from '../../core/deck';
import { playCut, playGather, playLay, playPress, playShuffle, warmSounds } from '../../core/sounds';
import type { LenormandCard } from '../../core/models';

export interface DrawnEvent {
  readonly question: string | null;
  readonly result: DrawResult;
}

type Phase = 'idle' | 'shuffling' | 'shuffled' | 'mixing' | 'asking' | 'cut-reveal';

const DECK_SIZE = LENORMAND_CARDS.length;
const SHUFFLE_MS = 3000;
const MIX_LAY_MS = 980;
const MIX_CUT_MS = 1580;
const MIX_UNDER_AT = 360;
const ASK_LAY_MS = 720;
const ASK_REVEAL_MS = 1100;

type MixStep = 'lay' | 'spread' | 'cut';

@Component({
  selector: 'app-question',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CardComponent],
  templateUrl: './question.html',
  styleUrl: './question.scss',
})
export class QuestionComponent implements OnDestroy {
  private readonly packService = inject(PackService);
  protected readonly locale = inject(LocaleService);
  protected readonly t = this.locale.t;

  readonly draw = output<DrawnEvent>();

  protected readonly question = signal('');
  protected readonly noteQuestion = signal(false);
  protected readonly phase = signal<Phase>('idle');
  protected readonly cutDepth = signal(0);
  protected readonly cutFaceDown = signal(true);
  protected readonly pack = signal<LenormandCard[]>([]);
  protected readonly laying = signal(false);
  protected readonly mixStep = signal<MixStep>('spread');
  protected readonly reducedMotion = prefersReducedMotion();
  protected readonly ringNumber = RING_CARD_NUMBER;
  protected readonly leftLayers = [0, 1, 2, 3, 4];
  protected readonly rightLayers = [0, 1, 2, 3, 4];
  protected readonly factory = computed(() => this.packService.isFactory());

  private shuffleTimer?: ReturnType<typeof setTimeout>;

  protected tilt(index: number): string {
    return `${((index * 13) % 9) - 4}deg`;
  }

  protected colOf(index: number): number {
    return index % this.spreadCols();
  }

  protected rowOf(index: number): number {
    return Math.floor(index / this.spreadCols());
  }

  private spreadCols(): number {
    return (
      typeof globalThis.matchMedia === 'function' &&
      globalThis.matchMedia('(min-width: 800px)').matches
        ? 9
        : 6
    );
  }

  protected toggleNote(): void {
    this.noteQuestion.update((on) => !on);
  }

  protected shuffleAgain(): void {
    if (this.phase() === 'shuffling' || this.phase() === 'cut-reveal') {
      return;
    }
    this.startShuffle();
  }

  /** Blind cut: restack without turning a card. */
  protected spreadToMix(): void {
    if (this.phase() !== 'idle' && this.phase() !== 'shuffled') {
      return;
    }
    this.clearTimers();
    this.cutDepth.set(0);
    this.mixStep.set('lay');
    this.laying.set(true);
    this.pack.set([...this.packService.cards()]);
    this.cutFaceDown.set(true);
    playPress();
    playLay();
    this.phase.set('mixing');
    const delay = this.reducedMotion ? 0 : MIX_LAY_MS;
    this.shuffleTimer = setTimeout(() => {
      this.laying.set(false);
      this.mixStep.set('spread');
    }, delay);
  }

  /** The real cut — the tapped card is the answer. */
  protected spreadToAsk(): void {
    if (this.phase() !== 'idle' && this.phase() !== 'shuffled') {
      return;
    }
    this.clearTimers();
    this.cutDepth.set(0);
    this.mixStep.set('spread');
    this.laying.set(true);
    this.pack.set([...this.packService.cards()]);
    this.cutFaceDown.set(true);
    playPress();
    playLay();
    this.phase.set('asking');
    const delay = this.reducedMotion ? 0 : ASK_LAY_MS;
    this.shuffleTimer = setTimeout(() => this.laying.set(false), delay);
  }

  protected gather(): void {
    if (this.phase() !== 'mixing' && this.phase() !== 'asking') {
      return;
    }
    this.clearTimers();
    this.cutDepth.set(0);
    this.mixStep.set('spread');
    this.laying.set(false);
    this.pack.set([]);
    this.cutFaceDown.set(true);
    this.phase.set('idle');
  }

  protected chooseCut(position: number): void {
    if (this.phase() === 'mixing') {
      this.mixAt(position);
      return;
    }
    if (this.phase() !== 'asking') {
      return;
    }
    const depth = Math.min(DECK_SIZE, Math.max(1, position));
    this.cutDepth.set(depth);
    this.phase.set('cut-reveal');
    this.cutFaceDown.set(false);
    playCut();
    const delay = this.reducedMotion ? 0 : ASK_REVEAL_MS;
    this.shuffleTimer = setTimeout(() => this.emitDraw(), delay);
  }

  protected cutCardName(): string {
    const card = this.pack()[this.cutDepth() - 1];
    if (!card) {
      return '';
    }
    return this.locale.isFr() ? card.nameFr : card.name;
  }

  private mixAt(position: number): void {
    if (this.cutDepth() > 0 || this.mixStep() !== 'spread') {
      return;
    }
    const depth = Math.min(DECK_SIZE, Math.max(1, position));
    this.clearTimers();
    this.cutDepth.set(depth);
    this.mixStep.set('cut');
    this.laying.set(false);
    playCut();
    const { deck } = cutAt(this.packService.cards(), depth);
    this.packService.set(deck);
    if (this.reducedMotion) {
      this.finishMix();
      return;
    }
    this.shuffleTimer = setTimeout(() => {
      playGather();
      this.shuffleTimer = setTimeout(() => this.finishMix(), MIX_CUT_MS - MIX_UNDER_AT);
    }, MIX_UNDER_AT);
  }

  private finishMix(): void {
    this.mixStep.set('spread');
    this.laying.set(false);
    this.cutDepth.set(0);
    this.pack.set([]);
    this.cutFaceDown.set(true);
    this.phase.set('idle');
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private startShuffle(): void {
    warmSounds();
    this.clearTimers();
    this.phase.set('shuffling');
    this.cutFaceDown.set(true);
    this.pack.set([]);
    this.packService.set(casinoShuffle(this.packService.cards()));
    playShuffle();
    const delay = this.reducedMotion ? 0 : SHUFFLE_MS;
    this.shuffleTimer = setTimeout(() => this.becomeShuffled(), delay);
  }

  private becomeShuffled(): void {
    this.phase.set('shuffled');
  }

  private emitDraw(): void {
    const result = readingFromCut(this.packService.cards(), this.cutDepth());
    this.packService.set(result.deck);
    const trimmed = this.noteQuestion() ? this.question().trim() : '';
    this.draw.emit({
      question: trimmed.length > 0 ? trimmed : null,
      result,
    });
  }

  private clearTimers(): void {
    clearTimeout(this.shuffleTimer);
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
