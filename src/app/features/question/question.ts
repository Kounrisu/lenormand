import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './question.html',
  styleUrl: './question.scss',
})
export class QuestionComponent {
  readonly draw = output<string | null>();

  protected readonly question = signal('');

  protected submit(): void {
    const trimmed = this.question().trim();
    this.draw.emit(trimmed.length > 0 ? trimmed : null);
  }
}
