import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DialogWindowComponent } from '../../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../../../components/shared/table/table.component';
import { TableHeaderFloat } from '../../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../../core/models/data-table-column.model';
import { ProductParameterValueFormDto } from '../../../../../core/dtos/product-parameter-value.form-dto';
import { SetProductParameterValueComponent } from './set-product-parameter-value/set-product-parameter-value.component';

@Component({
  selector: 'app-product-parameter-value-form',
  imports: [TranslateModule, TableComponent, DialogWindowComponent, SetProductParameterValueComponent],
  templateUrl: './product-parameter-value-form.component.html',
  styleUrl: './product-parameter-value-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductParameterValueFormComponent {
  formArray = input.required<FormArray<FormControl<ProductParameterValueFormDto>>>();

  isDialogActive = signal<boolean>(false);
  id = signal<string | undefined>(undefined);

  columns: DataTableColumnModel[] = [
    {
      field: 'productParameterName',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.product-form-component.parameters.table-columns.name',
      template: TableTemplate.text,
    },
    {
      field: 'value',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.product-form-component.parameters.table-columns.value',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  clearParams(): void {
    this.isDialogActive.set(false);
    this.id.set(undefined);
  }

  setDialog(id: string): void {
    const productParameter = this.formArray()
      .getRawValue()
      .find(x => x.productParameterId === id);

    if (productParameter) {
      this.id.set(productParameter.productParameterId);

      this.isDialogActive.set(true);
    }
  }

  remove(id: string): void {
    const index = this.formArray()
      .getRawValue()
      .findIndex(x => x.productParameterId === id);

    if (index >= 0) {
      const record = this.formArray().controls.at(index)!;
      const { id, productParameterId, productParameterName } = record.getRawValue();
      record.patchValue({ id, productParameterId, productParameterName, value: undefined });
    }
  }
}
