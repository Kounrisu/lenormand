import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { QuestionComponent } from './features/question/question';
import { ReadingComponent } from './features/reading/reading';
import { HistoryComponent } from './features/history/history';
import { drawYesNo, type DrawResult } from './core/deck';

type View = 'ask' | 'reading' | 'history';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuestionComponent, ReadingComponent, HistoryComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly view = signal<View>('ask');
  protected readonly question = signal<string | null>(null);
  protected readonly draw = signal<DrawResult | null>(null);

  protected onDraw(question: string | null): void {
    this.question.set(question);
    this.draw.set(drawYesNo());
    this.view.set('reading');
  }

  protected askAgain(): void {
    this.view.set('ask');
    this.draw.set(null);
  }

  protected showHistory(): void {
    this.view.set('history');
  }
}
