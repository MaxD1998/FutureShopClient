import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TableHeaderFloat } from '../../../core/enums/table-header-float';
import { TableTemplate } from '../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../core/models/data-table-column.model';
import { ITranslationForm } from '../../../modules/shop-module/core/form/i-translation.form';
import { DialogWindowComponent } from '../modals/dialog-window/dialog-window.component';
import { TableComponent } from '../table/table.component';
import { SetTranslationDialogComponent } from './set-translation-dialog/set-translation-dialog.component';

interface TranslateModel {
  id?: string;
  lang: string;
  langTranslate: string;
  translation: string;
}

@Component({
  selector: 'app-translate-table',
  imports: [TranslateModule, DialogWindowComponent, SetTranslationDialogComponent, TableComponent],
  templateUrl: './translate-table.component.html',
  styleUrl: './translate-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslateTableComponent {
  private readonly _translateService = inject(TranslateService);

  formArray = input.required<FormArray<FormGroup<ITranslationForm>>>();

  translations = computed<TranslateModel[]>(() => {
    return this.formArray()
      .getRawValue()
      .map<TranslateModel>(x => ({
        id: x.id ?? undefined,
        lang: x.lang,
        langTranslate: this._translateService.instant(`common.languages.${x.lang}`),
        translation: x.translation ?? '',
      }));
  });

  columns: DataTableColumnModel[] = [
    {
      field: 'langTranslate',
      headerFloat: TableHeaderFloat.left,
      headerText: 'common.translate-table-columns.language',
      template: TableTemplate.text,
    },
    {
      field: 'translate',
      headerFloat: TableHeaderFloat.left,
      headerText: 'common.translate-table-columns.translation',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];
}
