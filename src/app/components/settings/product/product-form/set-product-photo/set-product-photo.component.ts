import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { InputFileComponent } from '../../../../shared/input-file/input-file.component';

@Component({
  selector: 'app-set-product-photo',
  standalone: true,
  imports: [ButtonComponent, InputFileComponent, TranslateModule],
  templateUrl: './set-product-photo.component.html',
  styleUrl: './set-product-photo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetProductPhotoComponent {
  private _file?: File;

  isDisabledButton = signal<boolean>(true);
  isEmptyFile = signal<boolean>(false);

  onSave = output<File>();

  onFileLoaded(file: File): void {
    if (file.size == 0) {
      this.isDisabledButton.set(true);
      this.isEmptyFile.set(true);
    } else {
      this.isDisabledButton.set(false);
      this.isEmptyFile.set(false);
      this._file = file;
    }
  }

  submit(): void {
    if (this._file) {
      this.onSave.emit(this._file);
    }
  }
}
