import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, Subject, takeUntil, tap } from 'rxjs';
import { ButtonComponent } from '../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../components/shared/input-select/input-select.component';
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
import { SelectItemModel } from '../../../../../core/models/select-item.model';
import { CategoryDataService } from '../../../core/data-service/category.data-service';
import { CategoryFormDto } from '../../../core/dtos/category.form-dto';
import { CategoryFormDialogWindowContentComponent } from './category-form-dialog-window-content/category-form-dialog-window-content.component';

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
    CategoryFormDialogWindowContentComponent,
    ReactiveFormsModule,
    TranslateModule,
    TableComponent,
  ],
})
export class CategoryFormComponent extends BaseFormComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  IconType: typeof IconType = IconType;

  header = this.id
    ? 'product-module.category-form-component.edit-category'
    : 'product-module.category-form-component.create-category';
  id?: string = this._activatedRoute.snapshot.params['id'];

  isAddCategoryButtonDisabled = signal<boolean>(true);
  isAddTranslationButtonDisabled = signal<boolean>(true);
  isDialogActive = signal<boolean>(false);
  parentItems = signal<SelectItemModel[]>([]);
  subCategories = signal<FormArray>(this.form.controls['subCategories'] as FormArray);
  subCategoryItems = signal<SelectItemModel[]>([]);

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
    const form = this._activatedRoute.snapshot.data['form'];
    this.parentItems.set(form.parentItems);
    this.subCategoryItems.set(form.subCategoryItems);
    this.fillForm(form.category);
    this.setValueChangeEvent();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  removeSubCategory(id: string): void {
    const index = (this.subCategories().value as IdNameDto[]).findIndex(x => x.id == id);
    this.subCategories().removeAt(index);
  }

  setSubCategory(value: IdNameDto): void {
    this.subCategories.update(x => {
      x.push(new FormControl(value));
      return x;
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as CategoryFormDto;
    const category$ = !this.id
      ? this._categoryDataService.add(value)
      : this._categoryDataService.update(this.id, value);

    category$.subscribe({
      next: () =>
        this._router.navigateByUrl(`${ClientRoute.productModule}/${ClientRoute.category}/${ClientRoute.list}`),
    });
  }

  private fillForm(category: CategoryFormDto): void {
    if (!category) {
      return;
    }

    const controls = this.form.controls;

    controls['name'].setValue(category.name);
    controls['parentCategoryId'].setValue(category.parentCategoryId);

    this.subCategories.update(x => {
      category.subCategories.forEach(y => {
        x.push(new FormControl(y));
      });

      return x;
    });
  }

  private setItems(): void {
    const category = this.form.controls;
    const parentCategoryId = category['parentCategoryId'].value;
    const subCategoryIds = (category['subCategories'].value as IdNameDto[]).map(x => x.id);

    forkJoin({
      parentCategoryItems: this._categoryDataService.getsAvailableToBeParent(subCategoryIds, this.id),
      subCategoryItems: this._categoryDataService.getsAvailableToBeChild(subCategoryIds, parentCategoryId, this.id),
    }).subscribe({
      next: response => {
        this.parentItems.set(
          response.parentCategoryItems.map(x => {
            return {
              id: x.id,
              value: x.name,
            };
          }),
        );

        this.subCategoryItems.set(
          response.subCategoryItems.map(x => {
            return {
              id: x.id,
              value: x.name,
            };
          }),
        );
      },
    });
  }

  private setValueChangeEvent(): void {
    this.form.controls['parentCategoryId'].valueChanges
      .pipe(
        takeUntil(this._unsubscribe),
        tap(() => {
          this.setItems();
        }),
      )
      .subscribe();

    this.form.controls['subCategories'].valueChanges
      .pipe(
        takeUntil(this._unsubscribe),
        tap(() => {
          this.setItems();
        }),
      )
      .subscribe();
  }

  protected override setFormControls(): {} {
    return {
      name: [null, [Validators.required]],
      parentCategoryId: [null],
      subCategories: new FormArray([]),
    };
  }
}
