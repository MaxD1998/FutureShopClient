import { TableHeaderFloat } from '../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../core/models/data-table-column.model';

export class ProductFormUtils {
  static getDialogHeader(type: DialogType): string {
    switch (type) {
      case DialogType.productBase:
        return 'product-form-component.set-product-base';
      case DialogType.productParameterValue:
        return 'product-form-component.set-value';
      case DialogType.productPhoto:
        return 'product-form-component.set-product-photo';
      default:
        return '';
    }
  }

  static getProductParameterColumns(): DataTableColumnModel[] {
    return [
      {
        field: 'name',
        headerFloat: TableHeaderFloat.left,
        headerText: 'product-form-component.product-parameter-table-columns.name',
        template: TableTemplate.text,
      },
      {
        field: 'value',
        headerFloat: TableHeaderFloat.left,
        headerText: 'product-form-component.product-parameter-table-columns.value',
        template: TableTemplate.text,
      },
      {
        field: 'actions',
        headerText: '',
        template: TableTemplate.action,
      },
    ];
  }

  static getProductPhotoColumns(): DataTableColumnModel[] {
    return [
      {
        field: 'name',
        headerFloat: TableHeaderFloat.left,
        headerText: 'product-form-component.product-photo-table-columns.name',
        template: TableTemplate.text,
      },
      {
        field: 'type',
        headerFloat: TableHeaderFloat.left,
        headerText: 'product-form-component.product-photo-table-columns.type',
        template: TableTemplate.text,
      },
      {
        field: 'size',
        headerFloat: TableHeaderFloat.left,
        headerText: 'product-form-component.product-photo-table-columns.size',
        template: TableTemplate.text,
      },
      {
        field: 'actions',
        headerText: '',
        template: TableTemplate.action,
      },
    ];
  }
}

export enum DialogType {
  previewProductPhoto,
  productBase,
  productParameterValue,
  productPhoto,
}
