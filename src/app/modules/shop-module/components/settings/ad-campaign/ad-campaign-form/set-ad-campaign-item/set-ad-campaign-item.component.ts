import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../../../environments/environment';
import { ButtonComponent } from '../../../../../../../components/shared/button/button.component';
import { InputFileComponent } from '../../../../../../../components/shared/input-file/input-file.component';
import { InputSelectComponent } from '../../../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../../../core/models/select-item.model';

@Component({
  selector: 'app-set-ad-campaign-item',
  imports: [TranslateModule, InputSelectComponent, InputFileComponent, ButtonComponent],
  templateUrl: './set-ad-campaign-item.component.html',
  styleUrl: './set-ad-campaign-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetAdCampaignItemComponent {
  private readonly _translateService = inject(TranslateService);

  private _file?: File;
  private _lang?: string;

  isDisabledButton = signal<boolean>(true);
  isEmptyFile = signal<boolean>(false);

  onSave = output<{ lang: string; file: File }>();

  languages: SelectItemModel[] = [
    { value: this._translateService.instant('common.input-select.select-option') },
  ].concat(
    environment.availableLangs.map(x => {
      return {
        id: x,
        value: this._translateService.instant(`common.languages.${x}`),
      };
    }),
  );

  onFileLoaded(file: File): void {
    if (file.size == 0) {
      this.isEmptyFile.set(true);
      this.checkFieldsAreFilled();
    } else {
      this._file = file;
      this.isEmptyFile.set(false);
      this.checkFieldsAreFilled();
    }
  }

  onLangSet(id?: string) {
    this._lang = id;
    this.checkFieldsAreFilled();
  }

  submit(): void {
    if (this._lang && this._file) {
      this.onSave.emit({
        lang: this._lang,
        file: this._file,
      });
    }
  }

  private checkFieldsAreFilled() {
    this.isDisabledButton.set(!this._file && !this._lang);
  }
}
