import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputNumberComponent } from '../../../../../../components/shared/input-number/input-number.component';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { DialogWindowComponent } from '../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { ToggleComponent } from '../../../../../../components/shared/toggle/toggle.component';
import { TranslateTableComponent } from '../../../../../../components/shared/translate-table/translate-table.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { ButtonLayout } from '../../../../../../core/enums/button-layout';
import { TableHeaderFloat } from '../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { SelectItemModel } from '../../../../../../core/models/select-item.model';
import { ProductDataService } from '../../../../core/data-services/product.data-service';
import { ProductParameterValueFormDto } from '../../../../core/dtos/product-parameter-value.form-dto';
import { ProductFormDto } from '../../../../core/dtos/product.form-dto';
import { TranslationFormDto } from '../../../../core/dtos/translation.form-dto';
import { SetProductParameterValueComponent } from './set-product-parameter-value/set-product-parameter-value.component';

export interface IProductForm {
  isActive: FormControl<boolean>;
  name: FormControl<string>;
  productBaseId: FormControl<string>;
  price: FormControl<number | null>;
  productParameterValues: FormArray<FormControl<ProductParameterValueFormDto>>;
  translations: FormArray<FormControl<TranslationFormDto>>;
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent,
    InputComponent,
    InputNumberComponent,
    InputSelectComponent,
    ToggleComponent,
    DialogWindowComponent,
    TableComponent,
    SetProductParameterValueComponent,
    TranslateTableComponent,
  ],
})
export class ProductFormComponent extends BaseFormComponent<IProductForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productDataService = inject(ProductDataService);
  private readonly _router = inject(Router);

  private readonly _snapshot = this._activatedRoute.snapshot;
  private readonly _resolverData = this._activatedRoute.snapshot.data['form'];
  private _id: string = this._snapshot.params['id'];
  private _product: ProductFormDto = this._resolverData['product'];

  ButtonLayout: typeof ButtonLayout = ButtonLayout;

  productBaseItems: SelectItemModel[] = this._resolverData['productBases'];

  isDialogActive = signal<boolean>(false);
  productParameterId = signal<string | undefined>(undefined);

  productParameterColumns: DataTableColumnModel[] = [
    {
      field: 'productParameterName',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.product-form-component.product-parameter-table-columns.name',
      template: TableTemplate.text,
    },
    {
      field: 'value',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.product-form-component.product-parameter-table-columns.value',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];
  translationColumns: DataTableColumnModel[] = [
    {
      field: 'lang',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.product-form-component.translate-table-columns.language',
      template: TableTemplate.text,
    },
    {
      field: 'translate',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.product-form-component.translate-table-columns.translation',
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

    const { isActive, name, productBaseId, price, productParameterValues, translations } = this._product;
    this.form.patchValue({
      isActive,
      name,
      productBaseId,
      price,
    });

    productParameterValues.forEach(x => {
      this.form.controls.productParameterValues.push(
        new FormControl<ProductParameterValueFormDto>(x, { nonNullable: true }),
      );
    });
  }

  openSetParameterValueDialog(id: string): void {
    const productParameter = this.form.getRawValue().productParameterValues.find(x => x.productParameterId === id);

    if (productParameter) {
      this.productParameterId.set(productParameter.productParameterId);

      this.isDialogActive.set(true);
    }
  }

  removeParameterValue(id: string): void {
    const index = this.form.getRawValue().productParameterValues.findIndex(x => x.productParameterId === id);

    if (index >= 0) {
      const record = this.form.controls.productParameterValues.controls.at(index)!;
      const { id, productParameterId, productParameterName } = record.getRawValue();
      record.patchValue({ id, productParameterId, productParameterName, value: undefined });
    }
  }

  onSubmitProductParameterValue(): void {
    this.isDialogActive.set(false);
    this.productParameterId.set(undefined);
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { isActive, name, productBaseId, price, productParameterValues, translations } = this.form.getRawValue();
    this._product = {
      isActive,
      name,
      productBaseId,
      price: price ?? 0,
      productParameterValues,
      translations: translations
        .filter(x => !!x.translation)
        .map(x => ({ id: x.id ?? undefined, lang: x.lang, translation: x.translation! })),
    };

    this._productDataService.update(this._id, this._product).subscribe({
      next: () => {
        this._router.navigateByUrl(
          `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.product}/${ClientRoute.list}`,
        );
      },
    });
  }

  protected override setGroup(): FormGroup<IProductForm> {
    return this._formBuilder.group<IProductForm>({
      isActive: new FormControl(false, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      price: new FormControl(null, { validators: [Validators.required] }),
      productBaseId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      productParameterValues: new FormArray<FormControl<ProductParameterValueFormDto>>([]),
      translations: new FormArray<FormControl<TranslationFormDto>>([]),
    });
  }
}
