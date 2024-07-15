import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { BaseFormComponent } from '../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { ProductBaseDataService } from '../../../../core/data-services/product-base.data-service';
import { ProductBaseFormDto } from '../../../../core/dtos/product-base.form-dto';
import { ProductParameterFormDto } from '../../../../core/dtos/product-parameter.form-dto';
import { ButtonLayout } from '../../../../core/enums/button-layout';
import { TableHeaderFloat } from '../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../core/models/data-table-column.model';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputSelectComponent } from '../../../shared/input-select/input-select.component';
import { InputComponent } from '../../../shared/input/input.component';
import { DialogWindowComponent } from '../../../shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../shared/table/table.component';
import { ProductPropertyFormComponent } from './product-property-form/product-property-form.component';

@Component({
  selector: 'app-product-base-form',
  standalone: true,
  templateUrl: './product-base-form.component.html',
  styleUrl: './product-base-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    InputSelectComponent,
    TableComponent,
    DialogWindowComponent,
    ProductPropertyFormComponent,
  ],
})
export class ProductBaseFormComponent extends BaseFormComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productBaseDataService = inject(ProductBaseDataService);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  ButtonLayout: typeof ButtonLayout = ButtonLayout;

  id?: string = undefined;

  categoryItems = signal<SelectItemModel[]>([]);
  parameterToEdit = signal<{ index: number; parameter: ProductParameterFormDto } | undefined>(undefined);
  header = signal<string>('');
  isDialogActive = signal<boolean>(false);
  isNewParameter = signal<boolean>(true);
  productParameters = signal<{ id: string; name: string }[]>([]);

  dialogTitle = computed<string>(() => {
    return this.isNewParameter()
      ? 'product-base-form-component.add-parameter'
      : 'product-base-form-component.edit-parameter';
  });

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
    this.id = this._activatedRoute.snapshot.params['id'];
    this.header.set(
      this.id ? 'product-base-form-component.edit-product-base' : 'product-base-form-component.create-product-base',
    );
    const form = this._activatedRoute.snapshot.data['form'];
    this.categoryItems.set(form.categories);
    this.setValueChangeEvent();
    this.fillForm(form.productBase);
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  editParameter(id: string): void {
    this.isDialogActive.set(true);

    const parameterToEdit = this.form.controls['productParameters'] as FormArray;
    this.parameterToEdit.set({ index: parseInt(id), parameter: parameterToEdit.value[id] });
  }

  openDialogWindow(event: Event): void {
    event.preventDefault();
    this.isDialogActive.set(true);
  }

  removeParamter(id: string): void {
    (this.form.controls['productParameters'] as FormArray).removeAt(parseInt(id));
  }

  submitProductParameter(value: ProductParameterFormDto): void {
    this.isDialogActive.set(false);
    if (!value) {
      return;
    }

    const parameterToEdit = this.parameterToEdit();

    if (parameterToEdit) {
      const index = parameterToEdit.index;
      const productParameter = (this.form.controls['productParameters'] as FormArray).at(index);
      productParameter.setValue(value);
    } else {
      (this.form.controls['productParameters'] as FormArray).push(
        this._formBuilder.group({
          name: [value.name, [Validators.required]],
          translations: new FormArray(
            value.translations.map<FormGroup>(x => {
              return this._formBuilder.group({
                lang: x.lang,
                translation: x.translation,
              });
            }),
          ),
        }),
      );
    }

    this.parameterToEdit.set(undefined);
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const productBase$ = !this.id
      ? this._productBaseDataService.add(this.form.value)
      : this._productBaseDataService.update(this.id, this.form.value);

    productBase$.subscribe({
      next: () => {
        this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.productBase}/${ClientRoute.list}`);
      },
    });
  }

  private fillForm(productBase?: ProductBaseFormDto): void {
    if (!productBase) {
      return;
    }

    this.form.controls['name'].setValue(productBase.name);
    this.form.controls['categoryId'].setValue(productBase.categoryId);

    productBase.productParameters.forEach(x => {
      (this.form.controls['productParameters'] as FormArray).push(
        this._formBuilder.group({
          name: [x.name, [Validators.required]],
          translations: new FormArray(
            x.translations.map<FormGroup>(y => {
              return this._formBuilder.group({
                lang: y.lang,
                translation: y.translation,
              });
            }),
          ),
        }),
      );
    });
  }

  private setValueChangeEvent(): void {
    this.form.controls['productParameters'].valueChanges
      .pipe(
        takeUntil(this._unsubscribe),
        tap(response => {
          this.productParameters.set(
            (response as { name: string }[]).map<{ id: string; name: string }>(x => {
              return {
                id: (response as { name: string }[]).indexOf(x).toString(),
                name: x.name,
              };
            }),
          );
        }),
      )
      .subscribe();
  }

  protected override setFormControls(): {} {
    return {
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      productParameters: new FormArray([]),
    };
  }
}
