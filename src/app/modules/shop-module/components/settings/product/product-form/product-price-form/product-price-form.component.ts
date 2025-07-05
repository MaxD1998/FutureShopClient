import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, signal } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DialogWindowComponent } from '../../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../../../components/shared/table/table.component';
import { TableHeaderFloat } from '../../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../../core/models/data-table-column.model';
import { ProductDataService } from '../../../../../core/data-services/product.data-service';
import { SimulatePriceFormDto } from '../../../../../core/dtos/simulate-price.form-dto';
import { SimulateRemovePriceRequestDto } from '../../../../../core/dtos/simulate-remove-price.request-dto';
import { SetProductPriceComponent } from './set-product-price/set-product-price.component';

@Component({
  selector: 'app-product-price-form',
  imports: [TranslateModule, TableComponent, DialogWindowComponent, SetProductPriceComponent],
  templateUrl: './product-price-form.component.html',
  styleUrl: './product-price-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPriceFormComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _productDataService = inject(ProductDataService);

  private readonly _snapshot = this._activatedRoute.snapshot;
  private _productId: string = this._snapshot.params['id'];

  formArray = input.required<FormArray<FormControl<SimulatePriceFormDto>>>();

  isDialogActive = signal<boolean>(false);
  id = signal<number | undefined>(undefined);

  columns: DataTableColumnModel[] = [
    {
      field: 'start',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.product-form-component.prices.table-columns.start',
      template: TableTemplate.text,
    },
    {
      field: 'end',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.product-form-component.prices.table-columns.end',
      template: TableTemplate.text,
    },
    {
      field: 'price',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.product-form-component.prices.table-columns.price',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  setDialog(id: string): void {
    this.id.set(Number.parseInt(id));
    this.isDialogActive.set(true);
  }

  remove(id: string): void {
    const oldArray = this.formArray().getRawValue();
    const newArray = this.formArray()
      .getRawValue()
      .filter(x => x.fakeId !== Number.parseInt(id));

    const request: SimulateRemovePriceRequestDto = {
      newCollection: newArray,
      oldCollection: oldArray,
      productId: this._productId,
    };

    this._productDataService.simulateRemoveProduct(request).subscribe({
      next: response => {
        this.formArray().clear();
        response.forEach((x, i) => {
          x.fakeId = i + 1;
          this.formArray().push(new FormControl<SimulatePriceFormDto>(x, { nonNullable: true }));
        });

        this._cdr.detectChanges();
      },
    });
  }
}
