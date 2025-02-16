import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ProductBaseFormDto } from '../../../../core/dtos/product-base.form-dto';
import { ProductParameterFormModel } from '../../../../core/models/product-parameter.form-model';
import { ProductPropertyFormComponent } from './product-property-form/product-property-form.component';

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
export class ProductBaseFormComponent extends BaseFormComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productBaseDataService = inject(ProductBaseDataService);
  private readonly _router = inject(Router);

  ButtonLayout: typeof ButtonLayout = ButtonLayout;

  categoryItems = this._activatedRoute.snapshot.data['form']['categories'] as SelectItemModel[];
  id = this._activatedRoute.snapshot.params['id'] as string;
  productBase = this._activatedRoute.snapshot.data['form']['productBase'] as ProductBaseFormDto;

  parameterToEdit = signal<ProductParameterFormModel | undefined>(undefined);
  isDialogActive = signal<boolean>(false);
  isNewParameter = signal<boolean>(true);
  productParameters = signal<ProductParameterFormModel[]>(
    this.productBase.productParameters.map((x, i) => new ProductParameterFormModel(x, i)),
  );

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

    this.form.controls['name'].setValue(this.productBase.name);
    this.form.controls['categoryId'].setValue(this.productBase.categoryId);
  }

  closeDialog(): void {
    this.isDialogActive.set(false);
    this.parameterToEdit.set(undefined);
  }

  editParameter(id: string): void {
    this.isDialogActive.set(true);
    this.parameterToEdit.set(this.productParameters().find(x => x.index?.toString() == id));
  }

  openDialogWindow(event: Event): void {
    event.preventDefault();
    this.isDialogActive.set(true);
  }

  removeParamter(id: string): void {
    this.productParameters.set(
      Array.from(
        this.productParameters()
          .filter(x => x.index?.toString() != id)
          .map((x, i) => new ProductParameterFormModel(x, i)),
      ),
    );
  }

  submitProductParameter(value: ProductParameterFormModel): void {
    this.isDialogActive.set(false);
    if (!value) {
      return;
    }

    const productParameters = this.productParameters();
    const productParameter = this.parameterToEdit();

    if (productParameter) {
      productParameters[productParameter.index] = value;
    } else {
      productParameters.push(value);
    }

    this.productParameters.set(Array.from(productParameters.map((x, i) => new ProductParameterFormModel(x, i))));
    this.parameterToEdit.set(undefined);
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as ProductBaseFormDto;
    value.productParameters = this.productParameters().map(x => x.mapToDto());

    this._productBaseDataService.update(this.id, value).subscribe({
      next: () => {
        this._router.navigateByUrl(
          `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.productBase}/${ClientRoute.list}`,
        );
      },
    });
  }

  protected override setFormControls(): {} {
    return {
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
    };
  }
}
