import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../../environments/environment';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { ToggleComponent } from '../../../../../../components/shared/toggle/toggle.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { IdNameDto } from '../../../../../../core/dtos/id-name.dto';
import { ButtonLayout } from '../../../../../../core/enums/button-layout';
import { IconType } from '../../../../../../core/enums/icon-type';
import { TableHeaderFloat } from '../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { SelectItemModel } from '../../../../../../core/models/select-item.model';
import { CategoryDataService } from '../../../../core/data-services/category.data-service';
import { CategoryFormDto } from '../../../../core/dtos/category.form-dto';
import { ITranslationForm } from '../../../../core/form/i-translation.form';

interface ICategoryForm {
  isActive: FormControl<boolean>;
  name: FormControl<string>;
  parentCategoryId: FormControl<string | null>;
  subCategories: FormArray<FormControl<IdNameDto>>;
  translations: FormArray<FormGroup<ITranslationForm>>;
}

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputComponent,
    InputSelectComponent,
    ReactiveFormsModule,
    TranslateModule,
    TableComponent,
    ButtonComponent,
    ToggleComponent,
  ],
})
export class CategoryFormComponent extends BaseFormComponent<ICategoryForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _router = inject(Router);

  private readonly _snapshot = this._activatedRoute.snapshot;
  private readonly _resolverData = this._snapshot.data['form'];
  private _category: CategoryFormDto = this._resolverData['category'];
  private _id: string = this._snapshot.params['id'];

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  IconType: typeof IconType = IconType;

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.category-form-component.table-columns.name',
      template: TableTemplate.text,
    },
  ];
  parentCategoryItems: SelectItemModel[] = this._resolverData['parentCategoryItems'];
  subCategories = this._category.subCategories;
  translations = this.form.getRawValue().translations;

  constructor() {
    super();

    const { isActive, name, parentCategoryId, subCategories, translations } = this._category;
    this.form.patchValue({ isActive, name, parentCategoryId: parentCategoryId ?? null, subCategories });

    environment.availableLangs.forEach(lang => {
      const translation = translations.find(x => x.lang === lang);
      const translationFormGroup = this._formBuilder.group<ITranslationForm>({
        id: new FormControl(translation?.id ?? null),
        lang: new FormControl(lang, { nonNullable: true, validators: [Validators.required] }),
        translation: new FormControl(translation?.translation ?? null),
      });

      this.form.controls.translations.push(translationFormGroup);
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { isActive, name, parentCategoryId, subCategories, translations } = this.form.getRawValue();
    this._category = {
      isActive,
      name,
      parentCategoryId: parentCategoryId ?? undefined,
      subCategories,
      translations: translations
        .filter(x => !!x.translation)
        .map(x => ({ id: x.id ?? undefined, lang: x.lang, translation: x.translation! })),
    };

    this._categoryDataService.update(this._id, this._category).subscribe({
      next: () =>
        this._router.navigateByUrl(
          `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.category}/${ClientRoute.list}`,
        ),
    });
  }

  protected override setGroup(): FormGroup<ICategoryForm> {
    return this._formBuilder.group<ICategoryForm>({
      isActive: new FormControl(false, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      parentCategoryId: new FormControl(null),
      subCategories: new FormArray<FormControl<IdNameDto>>([]),
      translations: new FormArray<FormGroup<ITranslationForm>>([]),
    });
  }
}
