import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { QuestionComponent, type DrawnEvent } from './features/question/question';
import { ReadingComponent } from './features/reading/reading';
import { HistoryComponent } from './features/history/history';
import { LooksComponent } from './features/looks/looks';
import { AboutComponent } from './features/about/about';
import { ThemeService } from './core/theme.service';
import type { DrawResult } from './core/deck';

type View = 'ask' | 'reading' | 'history' | 'looks' | 'about';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuestionComponent, ReadingComponent, HistoryComponent, LooksComponent, AboutComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly theme = inject(ThemeService);

  protected readonly view = signal<View>('ask');
  protected readonly question = signal<string | null>(null);
  protected readonly draw = signal<DrawResult | null>(null);
  protected readonly readingDone = signal(false);

  protected onDraw(event: DrawnEvent): void {
    this.question.set(event.question);
    this.draw.set(event.result);
    this.readingDone.set(false);
    this.view.set('reading');
  }

  protected onRevealComplete(): void {
    this.readingDone.set(true);
  }

  protected askAgain(): void {
    this.view.set('ask');
    this.draw.set(null);
    this.readingDone.set(false);
  }

  protected showHistory(): void {
    this.view.set('history');
  }

  protected showLooks(): void {
    this.view.set('looks');
  }

  protected showAbout(): void {
    this.view.set('about');
  }
}
