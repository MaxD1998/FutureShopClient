import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin, Subject, takeUntil, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BaseFormComponent } from '../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { CategoryDataService } from '../../../../core/data-services/category.data-service';
import { CategoryFormDto } from '../../../../core/dtos/category.form-dto';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { ButtonLayout } from '../../../../core/enums/button-layout';
import { IconType } from '../../../../core/enums/icon-type';
import { TableHeaderFloat } from '../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../core/models/data-table-column.model';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputSelectComponent } from '../../../shared/input-select/input-select.component';
import { InputComponent } from '../../../shared/input/input.component';
import { DialogWindowComponent } from '../../../shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../shared/table/table.component';
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
    ]
})
export class CategoryFormComponent extends BaseFormComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  IconType: typeof IconType = IconType;

  id?: string = undefined;

  isAddCategoryButtonDisabled = signal<boolean>(true);
  isAddTranslationButtonDisabled = signal<boolean>(true);
  isDialogActive = signal<boolean>(false);
  header = signal<string>('');
  parentItems = signal<SelectItemModel[]>([]);
  subCategories = signal<FormArray>(this.form.controls['subCategories'] as FormArray);
  subCategoryItems = signal<SelectItemModel[]>([]);
  translations = signal<FormArray>(this.form.controls['translations'] as FormArray);

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'product-base-form-component.table-columns.name',
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
    this.setLangs();
    this.id = this._activatedRoute.snapshot.params['id'];
    this.header.set(this.id ? 'category-form-component.edit-category' : 'category-form-component.create-category');
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
    value.translations = value.translations.filter(x => x.translation);

    const category$ = !this.id
      ? this._categoryDataService.add(value)
      : this._categoryDataService.update(this.id, value);

    category$.subscribe({
      next: () => this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.category}/${ClientRoute.list}`),
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

    this.translations.update(x => {
      (x.controls as FormGroup[]).forEach(y => {
        const transaltion = category.translations.find(z => z.lang == y.controls['lang'].value);
        if (transaltion) {
          y.controls['id'].setValue(transaltion.id);
          y.controls['translation'].setValue(transaltion.translation);
        }
      });

      return x;
    });
  }

  private setLangs(): void {
    environment.availableLangs.forEach(x => {
      this.translations.update(y => {
        y.push(
          this._formBuilder.group({
            id: [null],
            lang: [x, [Validators.required]],
            translation: [null],
          }),
        );
        return y;
      });
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
      translations: new FormArray([]),
    };
  }
}
