import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../../environments/environment';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputNumberComponent } from '../../../../../../components/shared/input-number/input-number.component';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { DialogWindowComponent } from '../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { ToggleComponent } from '../../../../../../components/shared/toggle/toggle.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { IdValueDto } from '../../../../../../core/dtos/id-value.dto';
import { ButtonLayout } from '../../../../../../core/enums/button-layout';
import { TableHeaderFloat } from '../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { SelectItemModel } from '../../../../../../core/models/select-item.model';
import { ProductDataService } from '../../../../core/data-services/product.data-service';
import { ProductParameterValueFormDto } from '../../../../core/dtos/product-parameter-value.form-dto';
import { ProductFormDto } from '../../../../core/dtos/product.form-dto';
import { ITranslationForm } from '../../../../core/form/i-translation.form';
import { SetProductParameterValueComponent } from './set-product-parameter-value/set-product-parameter-value.component';

interface IProductForm {
  isActive: FormControl<boolean>;
  name: FormControl<string>;
  productBaseId: FormControl<string>;
  price: FormControl<number | null>;
  productParameterValues: FormArray<FormControl<ProductParameterValueFormDto>>;
  translations: FormArray<FormGroup<ITranslationForm>>;
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
  productParameter = signal<IdValueDto | undefined>(undefined);

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

  constructor() {
    super();

    const { isActive, name, productBaseId, price, productParameterValues, translations } = this._product;
    this.form.patchValue({
      isActive,
      name,
      productBaseId,
      price,
    });

    environment.availableLangs.forEach(lang => {
      const translation = translations.find(x => x.lang === lang);
      const translationFormGroup = this._formBuilder.group<ITranslationForm>({
        id: new FormControl(translation?.id ?? null),
        lang: new FormControl(lang, { nonNullable: true, validators: [Validators.required] }),
        translation: new FormControl(translation?.translation ?? null),
      });

      this.form.controls.translations.push(translationFormGroup);
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
      this.productParameter.set({
        id: productParameter.productParameterId,
        value: productParameter.value ?? '',
      });

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

  setProductParameterValue(dto: IdValueDto): void {
    const index = this.form.getRawValue().productParameterValues.findIndex(x => x.productParameterId === dto.id);

    if (index >= 0) {
      const record = this.form.controls.productParameterValues.controls.at(index)!;
      const { id, productParameterId, productParameterName } = record.getRawValue();
      record.patchValue({ id, productParameterId, productParameterName, value: dto.value });
    }

    this.isDialogActive.set(false);
    this.productParameter.set(undefined);
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
      translations: new FormArray<FormGroup<ITranslationForm>>([]),
    });
  }
}
