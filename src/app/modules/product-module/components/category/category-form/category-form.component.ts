import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, merge, Observable, switchMap } from 'rxjs';
import { ButtonComponent } from '../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../components/shared/input-select/models/select-item.model';
import { InputComponent } from '../../../../../components/shared/input/input.component';
import { DialogWindowComponent } from '../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../components/shared/table/table.component';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { IdNameDto } from '../../../../../core/dtos/id-name.dto';
import { ButtonLayout } from '../../../../../core/enums/button-layout';
import { IconType } from '../../../../../core/enums/icon-type';
import { TableHeaderFloat } from '../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../core/models/data-table-column.model';
import { CategoryDataService } from '../../../core/data-service/category.data-service';
import { CategoryRequestFormDto } from '../../../core/dtos/category/category.request-form-dto';
import { SubCategoryFormDialog } from './sub-category-form-dialog/sub-category-form-dialog';

interface ICategoryForm {
  name: FormControl<string>;
  parentCategoryId: FormControl<string | null>;
  subCategories: FormArray<FormControl<IdNameDto>>;
}

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    InputComponent,
    ButtonComponent,
    InputSelectComponent,
    DialogWindowComponent,
    SubCategoryFormDialog,
    ReactiveFormsModule,
    TranslateModule,
    TableComponent,
  ],
})
export class CategoryFormComponent extends BaseFormComponent<ICategoryForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);

  private readonly _snapshot = this._activatedRoute.snapshot;
  private readonly _resolverData = this._snapshot.data['form'];
  private readonly _id?: string = this._snapshot.params['id'];
  private _category?: CategoryRequestFormDto = this._resolverData['category'];

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  IconType: typeof IconType = IconType;

  header = this._id
    ? 'product-module.category-form-component.edit-category'
    : 'product-module.category-form-component.create-category';
  isAddCategoryButtonDisabled = signal<boolean>(true);
  isAddTranslationButtonDisabled = signal<boolean>(true);
  isDialogActive = signal<boolean>(false);
  parentItems = signal<SelectItemModel[]>(this._resolverData['parentItems']);
  subCategoryItems = signal<SelectItemModel[]>(this._resolverData['subCategoryItems']);

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'product-module.category-form-component.table-columns.name',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  constructor() {
    super();

    if (this._category) {
      const { name, parentCategoryId, subCategories } = this._category;
      this.form.patchValue({ name, parentCategoryId });

      subCategories.forEach(x => {
        this.form.controls.subCategories.push(new FormControl(x, { nonNullable: true }));
      });
    }

    merge(this.form.controls.parentCategoryId.valueChanges, this.form.controls.subCategories.valueChanges)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        switchMap(() => {
          return this.setItems$();
        }),
      )
      .subscribe({
        next: response => {
          const selectOption: SelectItemModel[] = [
            { id: '', value: this._translateService.instant('common.input-select.select-option') },
          ];
          const mapToSelectItem = (items: IdNameDto[]) =>
            items.map<SelectItemModel>(x => ({
              id: x.id,
              value: x.name,
            }));
          this.parentItems.set(selectOption.concat(mapToSelectItem(response.parentCategoryItems)));
          this.subCategoryItems.set(selectOption.concat(mapToSelectItem(response.subCategoryItems)));
        },
      });
  }

  removeSubCategory(id: string): void {
    const subCategories = this.form.controls.subCategories;
    const index = subCategories.value.findIndex(x => x.id === id);
    subCategories.removeAt(index);
  }

  setSubCategory(value: IdNameDto): void {
    this.form.controls.subCategories.push(new FormControl(value, { nonNullable: true }));
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, parentCategoryId, subCategories } = this.form.getRawValue();

    this._category = { name, parentCategoryId: parentCategoryId ?? undefined, subCategories };

    const category$ = !this._id
      ? this._categoryDataService.create(this._category)
      : this._categoryDataService.update(this._id, this._category);

    category$.subscribe({
      next: () =>
        this._router.navigateByUrl(`${ClientRoute.productModule}/${ClientRoute.category}/${ClientRoute.list}`),
    });
  }

  private setItems$(): Observable<{ parentCategoryItems: IdNameDto[]; subCategoryItems: IdNameDto[] }> {
    const value = this.form.getRawValue();
    const parentCategoryId = value.parentCategoryId ?? undefined;
    const subCategoryIds = value.subCategories.map(x => x.id);

    return forkJoin({
      parentCategoryItems: this._categoryDataService.getListPotentialParentCategories(subCategoryIds, this._id),
      subCategoryItems: this._categoryDataService.getListPotentialSubcategories(
        subCategoryIds,
        parentCategoryId,
        this._id,
      ),
    });
  }

  protected override setGroup(): FormGroup<ICategoryForm> {
    return this._formBuilder.group<ICategoryForm>({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      parentCategoryId: new FormControl(null),
      subCategories: new FormArray<FormControl<IdNameDto>>([]),
    });
  }
}
