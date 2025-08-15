import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { DialogWindowComponent } from '../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { ButtonLayout } from '../../../../../../core/enums/button-layout';
import { TableHeaderFloat } from '../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { SelectItemModel } from '../../../../../../core/models/select-item.model';
import { ProductBaseDataService } from '../../../../core/data-services/product-base.data-service';
import { ProductBaseRequestFormDto } from '../../../../core/dtos/product-base/product-base.request-form-dto';
import { ProductParameterFormModel } from '../../../../core/models/product-parameter.form-model';
import { ProductPropertyFormComponent } from './product-property-form/product-property-form.component';

interface IProductBaseForm {
  categoryId: FormControl<string>;
  name: FormControl<string>;
  productParameters: FormArray<FormControl<ProductParameterFormModel>>;
}

@Component({
  selector: 'app-product-base-form',
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
export class ProductBaseFormComponent extends BaseFormComponent<IProductBaseForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productBaseDataService = inject(ProductBaseDataService);
  private readonly _router = inject(Router);

  private readonly _snapshot = this._activatedRoute.snapshot;
  private readonly _resoverData = this._snapshot.data['form'];
  private _id: string = this._snapshot.params['id'];
  private _productBase: ProductBaseRequestFormDto = this._resoverData['productBase'];

  ButtonLayout: typeof ButtonLayout = ButtonLayout;

  categoryItems: SelectItemModel[] = this._resoverData['categories'];

  parameterToEdit = signal<ProductParameterFormModel | undefined>(undefined);
  isDialogActive = signal<boolean>(false);
  isNewParameter = signal<boolean>(true);

  dialogTitle = computed<string>(() => {
    return this.isNewParameter()
      ? 'shop-module.product-base-form-component.add-parameter'
      : 'shop-module.product-base-form-component.edit-parameter';
  });

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.product-base-form-component.table-columns.name',
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

    const { categoryId, name, productParameters } = this._productBase;
    this.form.patchValue({ categoryId, name });

    productParameters.forEach((x, i) => {
      const value = { ...x, index: i };
      this.form.controls.productParameters.push(new FormControl(value, { nonNullable: true }));
    });
  }

  addParameter(): void {
    this.isDialogActive.set(true);
    this.parameterToEdit.set(undefined);
  }

  closeDialog(): void {
    this.isDialogActive.set(false);
    this.parameterToEdit.set(undefined);
  }

  editParameter(id: string): void {
    this.isDialogActive.set(true);
    this.parameterToEdit.set(this.form.getRawValue().productParameters.find(x => x.index?.toString() == id));
  }

  openDialogWindow(event: Event): void {
    event.preventDefault();
    this.isDialogActive.set(true);
  }

  removeParamter(id: string): void {
    this.form.controls.productParameters.removeAt(Number.parseInt(id));

    const productParameters = this.form.getRawValue().productParameters;
    productParameters.forEach((x, i) => {
      x.index = i;
      this.form.controls.productParameters.at(i).patchValue(x);
    });
  }

  submitProductParameter(value: ProductParameterFormModel): void {
    this.isDialogActive.set(false);
    if (!value) {
      return;
    }

    const productParameters = this.form.controls.productParameters;
    const productParameter = this.parameterToEdit();

    if (productParameter) {
      productParameters.at(productParameter.index).patchValue(value);
    } else {
      value.index = productParameters.length;
      productParameters.push(new FormControl(value, { nonNullable: true }));
    }

    this.parameterToEdit.set(undefined);
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { categoryId, name, productParameters } = this.form.getRawValue();
    this._productBase = { categoryId, name, productParameters };

    this._productBaseDataService.update(this._id, this._productBase).subscribe({
      next: () => {
        this._router.navigateByUrl(
          `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.productBase}/${ClientRoute.list}`,
        );
      },
    });
  }

  protected override setGroup(): FormGroup<IProductBaseForm> {
    return this._formBuilder.group<IProductBaseForm>({
      categoryId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      productParameters: new FormArray<FormControl<ProductParameterFormModel>>([]),
    });
  }
}
