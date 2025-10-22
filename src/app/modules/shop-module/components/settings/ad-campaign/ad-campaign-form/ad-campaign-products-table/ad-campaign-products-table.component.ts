import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { DialogWindowComponent } from '../../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../../../components/shared/table/table.component';
import { TableTemplate } from '../../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../../core/models/data-table-column.model';
import { AdCampaignProductFormDto } from '../../../../../core/dtos/ad-campaign/ad-campaign-product.form-dto';
import { IAdCampaignForm } from '../ad-campaign-form.component';
import { SetAdCampaignProductComponent } from './set-ad-campaign-product/set-ad-campaign-product.component';

@Component({
  selector: 'app-ad-campaign-products-table',
  imports: [TableComponent, DialogWindowComponent, SetAdCampaignProductComponent],
  templateUrl: './ad-campaign-products-table.component.html',
  styleUrl: './ad-campaign-products-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdCampaignProductsTableComponent {
  private readonly _destroyRef = inject(DestroyRef);

  formGroup = input.required<FormGroup<IAdCampaignForm>>();

  columns: DataTableColumnModel[] = [
    {
      headerText: 'shop-module.ad-campaign-products-table-component.table-colums.name',
      field: 'productName',
      template: TableTemplate.text,
    },
  ];

  items = signal<AdCampaignProductFormDto[]>([]);
  isDialogActive = signal<boolean>(false);

  constructor() {
    afterNextRender(() => {
      var items = this.formGroup().getRawValue().adCampaignProducts;
      this.items.set(Array.from(items));

      this.formGroup()
        .controls.adCampaignProducts.valueChanges.pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(x => {
          this.items.set(Array.from(x));
        });
    });
  }

  removeItem(productId: string): void {
    const index = this.formGroup()
      .getRawValue()
      .adCampaignProducts.findIndex(x => x.productId === productId);

    if (index >= 0) {
      this.formGroup().controls.adCampaignProducts.removeAt(index);
    }
  }
}
