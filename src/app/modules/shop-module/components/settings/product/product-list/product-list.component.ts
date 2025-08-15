import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { PageDto } from '../../../../../../core/dtos/page.dto';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { PaginationModel } from '../../../../../../core/models/pagination.model';
import { ProductListDto } from '../../../../core/dtos/product/product.list-dto';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent, TranslateModule],
})
export class ProductListComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  pagination = signal<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
  });
  products = signal<ProductListDto[]>([]);

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerText: 'shop-module.product-list-component.name',
      template: TableTemplate.text,
    },
    {
      field: 'price',
      headerText: 'shop-module.product-list-component.price',
      template: TableTemplate.text,
    },
    {
      field: 'filledParameters',
      headerText: 'shop-module.product-list-component.filled-property',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  constructor() {
    this._activatedRoute.paramMap.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
      const pageProducts: PageDto<ProductListDto> = this._activatedRoute.snapshot.data['pageProducts'];
      this.setPageProduct(pageProducts);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  changePage(pageNumber: number): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.product}/${ClientRoute.list}/${pageNumber}`,
    );
  }

  navigateToEdit(id: string): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.product}/${ClientRoute.form}/${id}`,
    );
  }

  private setPageProduct(pageProducts: PageDto<ProductListDto>): void {
    this.products.set(pageProducts.items);
    this.pagination.set({
      currentPage: pageProducts.currentPage,
      totalPages: pageProducts.totalPages,
    });
  }
}
