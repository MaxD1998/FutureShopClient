import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductDto } from '../../../../core/dtos/product.dto';
import { IconType } from '../../../../core/enums/icon-type';
import { TableHeaderFloat } from '../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../core/models/data-table-column.model';
import { PurchaseListService } from '../../../../core/services/purchase-list.service';
import { AddProductToPurchaseListComponent } from '../../../shared/add-product-to-purchase-list/add-product-to-purchase-list.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { DropDownComponent } from '../../../shared/drop-down/drop-down.component';
import { InputPlusMinusComponent } from '../../../shared/input-plus-minus/input-plus-minus.component';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    TranslateModule,
    ButtonComponent,
    InputPlusMinusComponent,
    TableComponent,
    DropDownComponent,
    AddProductToPurchaseListComponent,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _purchaseListService = inject(PurchaseListService);

  images = signal<{ source: string; isShowed: boolean }[]>([]);
  isFavouriteOpen = signal<boolean>(false);
  product = signal<ProductDto | undefined>(undefined);

  image = computed<string>(() => {
    const image = this.images().find(x => x.isShowed);

    return image?.source ?? '';
  });

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'product-details.component.table.name',
      template: TableTemplate.text,
    },
    {
      field: 'value',
      headerFloat: TableHeaderFloat.left,
      headerText: 'product-details.component.table.value',
      template: TableTemplate.text,
    },
  ];

  IconType: typeof IconType = IconType;

  constructor() {
    this.product.set(this._activatedRoute.snapshot.data['data']['product']);
    this.images.set(this._activatedRoute.snapshot.data['data']['images']);
    this._purchaseListService.getUserPurchaseLists();
  }

  addToFavourite(): void {
    this.isFavouriteOpen.set(!this.isFavouriteOpen());
  }

  onInPurchaseListChange(value: boolean): void {
    const product = this.product();
    if (!product) {
      return;
    }

    product.isInPurchaseList = value;
    this.product.set(product);
  }

  showImage(index: number): void {
    const image = this.images().find(x => x.isShowed);

    if (image) {
      image.isShowed = false;
      this.images()[index].isShowed = true;
      this.images.set(Array.from(this.images()));
    }
  }
}
