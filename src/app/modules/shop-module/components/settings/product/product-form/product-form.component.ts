import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../../components/shared/input-select/models/select-item.model';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { ToggleComponent } from '../../../../../../components/shared/toggle/toggle.component';
import { TranslateTableComponent } from '../../../../../../components/shared/translate-table/translate-table.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { ButtonLayout } from '../../../../../../core/enums/button-layout';
import { ShopPermission } from '../../../../../../core/enums/shop-permission';
import { CustomValidators } from '../../../../../../core/utils/custom-validators';
import { ProductDataService } from '../../../../core/data-services/product.data-service';
import { ProductParameterValueFormDto } from '../../../../core/dtos/product/product-parameter-value.form-dto';
import { ProductRequestFormDto } from '../../../../core/dtos/product/product.request-form-dto';
import { SimulatePriceFormDto } from '../../../../core/dtos/product/simulate-price.form-dto';
import { TranslationFormDto } from '../../../../core/dtos/translation.form-dto';
import { ProductParameterValueFormComponent } from './product-parameter-value-form/product-parameter-value-form.component';
import { ProductPriceFormComponent } from './product-price-form/product-price-form.component';

export interface IProductForm {
  isActive: FormControl<boolean>;
  name: FormControl<string>;
  productBaseId: FormControl<string>;
  prices: FormArray<FormControl<SimulatePriceFormDto>>;
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
    InputSelectComponent,
    ToggleComponent,
    TranslateTableComponent,
    ProductParameterValueFormComponent,
    ProductPriceFormComponent,
  ],
})
export class ProductFormComponent extends BaseFormComponent<IProductForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _productDataService = inject(ProductDataService);
  private readonly _router = inject(Router);

  private readonly _snapshot = this._activatedRoute.snapshot;
  private readonly _resolverData = this._activatedRoute.snapshot.data['form'];
  private _id: string = this._snapshot.params['id'];
  private _product: ProductRequestFormDto = this._resolverData['product'];

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  ShopPermission: typeof ShopPermission = ShopPermission;

  productBaseItems: SelectItemModel[] = this._resolverData['productBases'];

  constructor() {
    super();

    const { isActive, name, productBaseId, prices, productParameterValues, translations } = this._product;
    this.form.patchValue({
      isActive,
      name,
      productBaseId,
    });

    prices.forEach((x, i) => {
      const row: SimulatePriceFormDto = { ...x, fakeId: i + 1, isNew: !x.id };
      this.form.controls.prices.push(new FormControl<SimulatePriceFormDto>(row, { nonNullable: true }));
    });

    productParameterValues.forEach(x => {
      this.form.controls.productParameterValues.push(
        new FormControl<ProductParameterValueFormDto>(x, { nonNullable: true }),
      );
    });

    translations.forEach(x => this.form.controls.translations.push(new FormControl(x, { nonNullable: true })));

    this.form.controls.prices.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      const isActive = this.form.controls.isActive;

      isActive.markAsTouched();
      isActive.updateValueAndValidity();
    });
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { isActive, name, productBaseId, prices, productParameterValues, translations } = this.form.getRawValue();
    this._product = {
      isActive,
      name,
      productBaseId,
      prices,
      productParameterValues,
      translations: translations.map(x => ({ id: x.id ?? undefined, lang: x.lang, translation: x.translation! })),
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
      isActive: new FormControl(false, { nonNullable: true, validators: CustomValidators.arrayIsNotEmpty('prices') }),
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      productBaseId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      prices: new FormArray<FormControl<SimulatePriceFormDto>>([]),
      productParameterValues: new FormArray<FormControl<ProductParameterValueFormDto>>([]),
      translations: new FormArray<FormControl<TranslationFormDto>>([]),
    });
  }
}
