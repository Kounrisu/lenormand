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
import {
  cutAt,
  shuffleWith,
  readingFromCut,
  type DrawResult,
  type ShuffleStyle,
} from '../../core/deck';
import {
  playCut,
  playGather,
  playLay,
  playPress,
  playShuffle,
  playTap,
  warmSounds,
} from '../../core/sounds';
import type { LenormandCard } from '../../core/models';

export interface DrawnEvent {
  readonly question: string | null;
  readonly result: DrawResult;
}

type Phase = 'idle' | 'shuffling' | 'shuffled' | 'mixing' | 'asking' | 'cut-reveal';

const DECK_SIZE = LENORMAND_CARDS.length;
const MIX_LAY_MS = 980;
const MIX_CUT_MS = 1580;
const MIX_UNDER_AT = 360;
const ASK_LAY_MS = 720;
const ASK_REVEAL_MS = 1100;

type MixStep = 'lay' | 'spread' | 'cut';

const SHUFFLE_MS: Record<ShuffleStyle, number> = {
  riffle: 1600,
  overhand: 1800,
  strip: 1700,
  wash: 2200,
  casino: 3000,
};

export const SHUFFLE_METHODS: { readonly id: ShuffleStyle; readonly label: string }[] = [
  { id: 'riffle', label: 'Riffle' },
  { id: 'overhand', label: 'Overhand' },
  { id: 'strip', label: 'Strip' },
  { id: 'wash', label: 'Wash' },
  { id: 'casino', label: 'Casino' },
];

@Component({
  selector: 'app-question',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CardComponent],
  templateUrl: './question.html',
  styleUrl: './question.scss',
})
export class QuestionComponent implements OnDestroy {
  private readonly packService = inject(PackService);

  readonly draw = output<DrawnEvent>();

  protected readonly question = signal('');
  protected readonly noteQuestion = signal(false);
  protected readonly phase = signal<Phase>('idle');
  protected readonly cutDepth = signal(0);
  protected readonly cutFaceDown = signal(true);
  protected readonly pack = signal<LenormandCard[]>([]);
  protected readonly method = signal<ShuffleStyle>('riffle');
  protected readonly laying = signal(false);
  protected readonly mixStep = signal<MixStep>('spread');
  protected readonly washBits = signal<{ i: number; x: number; y: number; r: number }[]>([]);
  protected readonly reducedMotion = prefersReducedMotion();
  protected readonly ringNumber = RING_CARD_NUMBER;
  protected readonly methods = SHUFFLE_METHODS;
  protected readonly leftLayers = [0, 1, 2, 3, 4];
  protected readonly rightLayers = [0, 1, 2, 3, 4];
  protected readonly factory = computed(() => this.packService.isFactory());

  private shuffleTimer?: ReturnType<typeof setTimeout>;

  protected tilt(index: number): string {
    if (this.phase() === 'mixing') {
      return `${((index * 7) % 5) - 2}deg`;
    }
    return `${((index * 13) % 9) - 4}deg`;
  }

  protected toggleNote(): void {
    this.noteQuestion.update((on) => !on);
  }

  protected pickMethod(style: ShuffleStyle): void {
    this.method.set(style);
    playTap();
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

  protected newPack(): void {
    if (this.phase() !== 'idle' && this.phase() !== 'shuffled') {
      return;
    }
    this.packService.newPack();
    this.pack.set([]);
    this.phase.set('idle');
  }

  private mixAt(position: number): void {
    if (this.cutDepth() > 0 || this.mixStep() === 'cut') {
      return;
    }
    const depth = Math.min(DECK_SIZE, Math.max(1, position));
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
    if (this.method() === 'wash') {
      this.washBits.set(
        Array.from({ length: 16 }, (_, i) => ({
          i,
          x: Math.round((Math.random() - 0.5) * 220),
          y: Math.round((Math.random() - 0.5) * 120),
          r: Math.round((Math.random() - 0.5) * 56),
        })),
      );
    } else {
      this.washBits.set([]);
    }
    this.packService.set(shuffleWith(this.packService.cards(), this.method()));
    playShuffle(this.method());
    const delay = this.reducedMotion ? 0 : SHUFFLE_MS[this.method()];
    this.shuffleTimer = setTimeout(() => this.becomeShuffled(), delay);
  }

  private becomeShuffled(): void {
    this.washBits.set([]);
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
