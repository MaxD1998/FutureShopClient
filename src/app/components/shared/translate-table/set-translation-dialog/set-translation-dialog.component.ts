import { ChangeDetectionStrategy, Component, inject, Injector, input, model, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BaseFormComponent } from '../../../../core/bases/base-form.component';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { TranslationFormDto } from '../../../../modules/shop-module/core/dtos/translation.form-dto';
import { ITranslationForm } from '../../../../modules/shop-module/core/form/i-translation.form';
import { ButtonComponent } from '../../button/button.component';
import { InputSelectComponent } from '../../input-select/input-select.component';
import { InputComponent } from '../../input/input.component';

@Component({
  selector: 'app-set-translation-dialog',
  imports: [ReactiveFormsModule, TranslateModule, ButtonComponent, InputComponent, InputSelectComponent],
  templateUrl: './set-translation-dialog.component.html',
  styleUrl: './set-translation-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTranslationDialogComponent extends BaseFormComponent<ITranslationForm> {
  private readonly _injector = inject(Injector);
  private readonly _translateService = inject(TranslateService);

  formArray = input.required<FormArray<FormControl<TranslationFormDto>>>();

  editLang = model<string>();
  isDialogActive = model.required<boolean>();

  langItems = signal<SelectItemModel[]>([]);
  isOpen = signal<boolean>(false);

  constructor() {
    super();

    toObservable(this.isDialogActive, { injector: this._injector })
      .pipe(
        tap(isActive => {
          if (!isActive) {
            this.form.reset();
            if (this.editLang()) {
              this.editLang.set(undefined);
            }
          } else {
            const translations = this.formArray().getRawValue();
            if (!this.editLang()) {
              const excludedLangs = translations
                .filter(x => x.lang !== this.editLang())
                .map(translation => translation.lang);
              const langs = environment.availableLangs
                .filter(x => !excludedLangs.includes(x))
                .map(x => this.mapToSelectItemModel(x));

              this.langItems.set(langs);
            } else {
              const editLang = translations.find(x => x.lang === this.editLang());

              if (editLang) {
                const { id, lang, translation } = editLang;
                this.langItems.set([this.mapToSelectItemModel(editLang.lang)]);
                this.form.patchValue({ id: id ?? null, lang, translation: translation ?? '' });
              }
            }
          }
        }),
      )
      .subscribe(isActive => {
        this.isOpen.set(isActive);
      });
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { id, lang, translation } = this.form.getRawValue();
    const value = this.formArray().getRawValue();
    const index = value.findIndex(x => x.lang === lang);

    if (index < 0) {
      this.formArray().push(
        new FormControl<TranslationFormDto>(
          { id: id ?? undefined, lang, translation: translation ?? '' },
          { nonNullable: true },
        ),
      );
    } else {
      this.formArray()
        .at(index)
        .patchValue({ id: id ?? undefined, lang, translation: translation ?? '' });
    }

    this.isDialogActive.set(false);
  }

  private mapToSelectItemModel(lang: string): SelectItemModel {
    return { id: lang, value: this._translateService.instant(`common.languages.${lang}`) };
  }

  protected override setGroup(): FormGroup<ITranslationForm> {
    return this._formBuilder.group<ITranslationForm>({
      id: new FormControl(null),
      lang: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      translation: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });
  }
}
