import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-input-file',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './input-file.component.html',
  styleUrl: './input-file.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFileComponent {
  accept = input<string>('*');
  label = input.required<string>();

  onValueChange = output<File>();

  fileName = signal<string>('common.input-file.file-was-not-selected');

  valueChane(value: HTMLInputElement): void {
    const files = value.files;

    if (files && files.length > 0) {
      const file = files.item(0);

      if (file) {
        this.fileName.set(file.name);
        this.onValueChange.emit(file);
      }
    }
  }
}
