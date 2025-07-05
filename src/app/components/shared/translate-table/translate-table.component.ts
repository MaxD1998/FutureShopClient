import { afterNextRender, ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { TableHeaderFloat } from '../../../core/enums/table-header-float';
import { TableTemplate } from '../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../core/models/data-table-column.model';
import { TranslationFormDto } from '../../../modules/shop-module/core/dtos/translation.form-dto';
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
export class TranslateTableComponent implements OnDestroy {
  private readonly _translateService = inject(TranslateService);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  formArray = input.required<FormArray<FormControl<TranslationFormDto>>>();

  editLang = signal<string | undefined>(undefined);
  isDialogActive = signal<boolean>(false);
  translations = signal<TranslateModel[]>([]);

  columns: DataTableColumnModel[] = [
    {
      field: 'langTranslate',
      headerFloat: TableHeaderFloat.left,
      headerText: 'common.translate-table.columns.language',
      template: TableTemplate.text,
    },
    {
      field: 'translation',
      headerFloat: TableHeaderFloat.left,
      headerText: 'common.translate-table.columns.translation',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  constructor() {
    afterNextRender(() => {
      const translations = this.formArray().getRawValue();
      this.setTranslations(translations);

      this.formArray()
        .valueChanges.pipe(takeUntil(this._unsubscribe), tap(this.setTranslations.bind(this)))
        .subscribe();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  onAdd(): void {
    this.editLang.set(undefined);
    this.isDialogActive.set(true);
  }

  onEdit(lang: string): void {
    this.editLang.set(lang);
    this.isDialogActive.set(true);
  }

  remove(lang: string): void {
    const index = this.formArray().controls.findIndex(x => x.value.lang === lang);
    this.formArray().removeAt(index);
  }

  private setTranslations(translations: TranslationFormDto[]): void {
    const results = translations.map<TranslateModel>(x => ({
      id: x.id,
      lang: x.lang,
      langTranslate: this._translateService.instant(`common.languages.${x.lang}`),
      translation: x.translation,
    }));

    this.translations.set(results);
  }
}
