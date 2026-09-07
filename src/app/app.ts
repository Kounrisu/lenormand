import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { QuestionComponent, type DrawnEvent } from './features/question/question';
import { ReadingComponent } from './features/reading/reading';
import { HistoryComponent } from './features/history/history';
import { LooksComponent } from './features/looks/looks';
import { ThemeService } from './core/theme.service';
import type { DrawResult } from './core/deck';

type View = 'ask' | 'reading' | 'history' | 'looks';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuestionComponent, ReadingComponent, HistoryComponent, LooksComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly theme = inject(ThemeService);

  protected readonly view = signal<View>('ask');
  protected readonly question = signal<string | null>(null);
  protected readonly draw = signal<DrawResult | null>(null);

  protected onDraw(event: DrawnEvent): void {
    this.question.set(event.question);
    this.draw.set(event.result);
    this.view.set('reading');
  }

  protected askAgain(): void {
    this.view.set('ask');
    this.draw.set(null);
  }

  protected showHistory(): void {
    this.view.set('history');
  }

  protected showLooks(): void {
    this.view.set('looks');
  }
}
