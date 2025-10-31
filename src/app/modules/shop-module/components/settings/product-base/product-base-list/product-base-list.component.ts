import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { PageDto } from '../../../../../../core/dtos/page.dto';
import { ShopPermission } from '../../../../../../core/enums/shop-permission';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { PaginationModel } from '../../../../../../core/models/pagination.model';
import { UserService } from '../../../../../auth-module/core/services/user.service';
import { ProductBaseListDto } from '../../../../core/dtos/product-base/product-base.list-dto';

@Component({
  selector: 'app-product-base-list',
  templateUrl: './product-base-list.component.html',
  styleUrl: './product-base-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, TranslateModule, TableComponent],
})
export class ProductBaseListComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  readonly userService = inject(UserService);

  ShopPermission: typeof ShopPermission = ShopPermission;

  pagination = signal<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
  });
  productBases = signal<ProductBaseListDto[]>([]);

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerText: 'shop-module.product-base-list-component.name',
      template: TableTemplate.text,
    },
    {
      field: 'categoryName',
      headerText: 'shop-module.product-base-list-component.category-name',
      template: TableTemplate.text,
    },
    {
      field: 'productCount',
      headerText: 'shop-module.product-base-list-component.product-count',
      template: TableTemplate.text,
    },
    {
      field: 'productParameterCount',
      headerText: 'shop-module.product-base-list-component.parameter-count',
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
      const pageProductBases: PageDto<ProductBaseListDto> = this._activatedRoute.snapshot.data['pageProductBases'];
      this.setPageProductBase(pageProductBases);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  changePage(pageNumber: number): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.productBase}/${ClientRoute.list}/${pageNumber}`,
    );
  }

  navigateToEdit(id: string): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.productBase}/${ClientRoute.form}/${id}`,
    );
  }

  private setPageProductBase(pageProductBases: PageDto<ProductBaseListDto>): void {
    this.productBases.set(pageProductBases.items);
    this.pagination.set({
      currentPage: pageProductBases.currentPage,
      totalPages: pageProductBases.totalPages,
    });
  }
}
