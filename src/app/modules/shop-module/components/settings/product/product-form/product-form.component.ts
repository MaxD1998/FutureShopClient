import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../../environments/environment';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputNumberComponent } from '../../../../../../components/shared/input-number/input-number.component';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { DialogWindowComponent } from '../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { IdValueDto } from '../../../../../../core/dtos/id-value.dto';
import { ButtonLayout } from '../../../../../../core/enums/button-layout';
import { TableHeaderFloat } from '../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { SelectItemModel } from '../../../../../../core/models/select-item.model';
import { ProductDataService } from '../../../../core/data-services/product.data-service';
import { ProductParameterFlatDto } from '../../../../core/dtos/product-parameter-flat.dto copy';
import { ProductFormDto } from '../../../../core/dtos/product.form-dto';
import { SetProductParameterValueComponent } from './set-product-parameter-value/set-product-parameter-value.component';

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
    DialogWindowComponent,
    TableComponent,
    SetProductParameterValueComponent,
  ],
})
export class ProductFormComponent extends BaseFormComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productDataService = inject(ProductDataService);
  private readonly _router = inject(Router);

  ButtonLayout: typeof ButtonLayout = ButtonLayout;

  id: string = this._activatedRoute.snapshot.params['id'];
  product: ProductFormDto = this._activatedRoute.snapshot.data['form']['product'];
  productBaseItems: SelectItemModel[] = this._activatedRoute.snapshot.data['form']['productBases'] ?? [];
  productParameters: ProductParameterFlatDto[] = this._activatedRoute.snapshot.data['form']['productParameters'] ?? [];
  translations = this.form.controls['translations'] as FormArray;

  isDialogActive = signal<boolean>(false);
  productParameter = signal<IdValueDto | undefined>(undefined);

  productParameterColumns: DataTableColumnModel[] = [
    {
      field: 'name',
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

    const form = this.form.controls;
    form['name'].setValue(this.product.name);
    form['productBaseId'].setValue(this.product.productBaseId);
    form['price'].setValue(this.product.price);

    environment.availableLangs.forEach(x => {
      const translation = this.product.translations.find(y => y.lang == x);
      this.translations.push(
        this._formBuilder.group({
          id: [translation?.id],
          lang: [x, [Validators.required]],
          translation: [translation?.translation],
        }),
      );
    });
  }

  openSetParameterValueDialog(id: string): void {
    const productParameter = this.productParameters.find(x => x.id == id);

    if (productParameter) {
      this.productParameter.set({
        id: productParameter.id,
        value: productParameter.value ?? '',
      });

      this.isDialogActive.set(true);
    }
  }

  removeParameterValue(id: string): void {
    const productParameter = this.productParameters.find(x => x.id == id);
    if (productParameter) {
      productParameter.value = undefined;
      this.productParameters = this.productParameters.slice();
    }
  }

  setProductParameterValue(dto: IdValueDto): void {
    const productParameter = this.productParameters.find(x => x.id == dto.id);
    if (productParameter) {
      productParameter.value = dto.value;
      this.productParameters = this.productParameters.slice();
    }

    this.isDialogActive.set(false);
    this.productParameter.set(undefined);
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as ProductFormDto;

    value.productParameterValues = this.productParameters
      .filter(x => x.value)
      .map(x => {
        return {
          id: x.productParameterValueId,
          productParameterId: x.id,
          value: x.value,
        };
      });

    value.translations = value.translations.filter(x => x.translation);

    this._productDataService.update(this.id, value).subscribe({
      next: () => {
        this._router.navigateByUrl(
          `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.product}/${ClientRoute.list}`,
        );
      },
    });
  }

  protected override setFormControls(): {} {
    return {
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      productBaseId: [null, [Validators.required]],
      translations: new FormArray([]),
    };
  }
}
