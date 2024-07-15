import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { BaseFormComponent } from '../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { ProductParameterDataService } from '../../../../core/data-services/product-parameter.data-service';
import { ProductDataService } from '../../../../core/data-services/product.data-service';
import { ProductFormDto } from '../../../../core/dtos/product.form-dto';
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
import { SetProductBaseFormComponent } from './set-product-base-form/set-product-base-form.component';
import { SetProductParameterValueComponent } from './set-product-parameter-value/set-product-parameter-value.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent,
    InputComponent,
    InputSelectComponent,
    DialogWindowComponent,
    SetProductBaseFormComponent,
    TableComponent,
    SetProductParameterValueComponent,
  ],
})
export class ProductFormComponent extends BaseFormComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _location = inject(Location);
  private readonly _productDataService = inject(ProductDataService);
  private readonly _productParamterDataService = inject(ProductParameterDataService);
  private readonly _router = inject(Router);

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  DialogType: typeof DialogType = DialogType;

  id?: string;

  dialogType = signal<DialogType>(DialogType.productBase);
  header = signal<string>('');
  isDialogActive = signal<boolean>(true);
  productBaseItems = signal<SelectItemModel[]>([]);
  productParameter = signal<{ productParameterId: string; value?: string }>({
    productParameterId: '',
  });
  productParameters = signal<{ id: string; name: string; value?: string }[]>([]);
  translations = signal<FormArray>(this.form.controls['translations'] as FormArray);

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'product-form-component.table-columns.name',
      template: TableTemplate.text,
    },
    {
      field: 'value',
      headerFloat: TableHeaderFloat.left,
      headerText: 'product-form-component.table-columns.value',
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
    this.isDialogActive.set(!this.id);
    this.header.set(this.id ? 'product-form-component.edit-product' : 'product-form-component.create-product');
    const form = this._activatedRoute.snapshot.data['form'];

    if (!form.product && !form.productBases) {
      this.dialogClose();
    }

    if (form.productBases) {
      this.productBaseItems.set(form.productBases);
    }

    if (form.productParameters) {
      this.productParameters.set(form.productParameters);
    }

    this.fillForm(form.product);
  }

  dialogClose(): void {
    if (this.dialogType() == DialogType.productBase) {
      this._location.back();
    } else {
      this.isDialogActive.set(false);
    }
  }

  openSetParameterValueDialog(id: string): void {
    if (this.dialogType() != DialogType.ProductParameterValue) {
      this.dialogType.set(DialogType.ProductParameterValue);
    }

    const productParameter = this.productParameters().find(x => x.id == id);

    if (productParameter) {
      this.productParameter.set({
        productParameterId: productParameter.id,
        value: productParameter.value,
      });
      this.isDialogActive.set(true);
    }
  }

  removeParameterValue(id: string): void {
    const productParameter = this.productParameters().find(x => x.id == id);
    const array = this.form.controls['productParameterValues'] as FormArray;
    const arrayValues = array.value as { productParameterId: string; value?: string }[];
    const index = arrayValues.findIndex(x => x.productParameterId == id);

    if (productParameter) {
      productParameter.value = undefined;
    }

    if (index > -1) {
      array.removeAt(index);
    }
  }

  setProductBase(value: SelectItemModel): void {
    if (!value.id) {
      this.dialogClose();
      return;
    }

    this._productParamterDataService.getsByProductBaseId(value.id).subscribe({
      next: response => {
        this.productParameters.set(
          response.map(x => {
            return {
              id: x.id,
              name: x.name,
            };
          }),
        );
        this.form.controls['productBaseId'].setValue(value.id);
        this.isDialogActive.set(false);
      },
    });
  }

  setProductParameterValue(parameterValue: { productParameterId: string; value: string }): void {
    const array = this.form.controls['productParameterValues'] as FormArray;
    const arrayValues = array.value as { productParameterId: string; value?: string }[];
    const value = arrayValues.find(x => x.productParameterId == parameterValue.productParameterId);

    if (value) {
      value.value = parameterValue.value;
    } else {
      array.push(new FormControl(parameterValue));
    }

    const productParameters = this.productParameters();
    const productParameter = productParameters.find(x => x.id == parameterValue.productParameterId);
    if (productParameter) {
      productParameter.value = parameterValue.value;
      this.productParameters.set(productParameters.slice());
    }

    this.isDialogActive.set(false);
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as ProductFormDto;

    value.translations = value.translations.filter(x => x.translation);

    const product$ = !this.id ? this._productDataService.add(value) : this._productDataService.update(this.id, value);

    console.log(value);

    product$.subscribe({
      next: () => {
        this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.product}/${ClientRoute.list}`);
      },
    });
  }

  private fillForm(product?: ProductFormDto): void {
    if (!product) {
      return;
    }

    const form = this.form.controls;
    form['name'].setValue(product.name);
    form['price'].setValue(product.price);
    form['productBaseId'].setValue(product.productBaseId);

    this.productParameters.update(x => {
      product.productParameterValues.forEach(y => {
        const productParameter = x.find(z => z.id == y.productParameterId);
        if (productParameter) {
          (form['productParameterValues'] as FormArray).push(
            new FormControl({
              productParameterId: y.productParameterId,
              value: y.value,
            }),
          );
          productParameter.value = y.value;
        }
      });

      return x;
    });

    this.translations.update(x => {
      (x.controls as FormGroup[]).forEach(y => {
        const transaltion = product.translations.find(z => z.lang == y.controls['lang'].value);
        if (transaltion) {
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
            lang: [x, [Validators.required]],
            translation: [null],
          }),
        );
        return y;
      });
    });
  }

  protected override setFormControls(): {} {
    return {
      name: [null, [Validators.required]],
      price: [0, [Validators.required]],
      productBaseId: [null, [Validators.required]],
      productParameterValues: new FormArray([]),
      translations: new FormArray([]),
    };
  }
}

enum DialogType {
  productBase,
  ProductParameterValue,
}
