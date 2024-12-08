import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { ProductBaseDataService } from '../../../../core/data-services/product-base.data-service';
import { PageDto } from '../../../../core/dtos/page.dto';
import { ProductBaseListDto } from '../../../../core/dtos/product-base.list-dto';
import { TableTemplate } from '../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../core/models/data-table-column.model';
import { PaginationModel } from '../../../../core/models/pagination.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
    selector: 'app-product-base-list',
    templateUrl: './product-base-list.component.html',
    styleUrl: './product-base-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TranslateModule, ButtonComponent, TableComponent]
})
export class ProductBaseListComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productBaseDataService = inject(ProductBaseDataService);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  pagination = signal<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
  });
  productBases = signal<ProductBaseListDto[]>([]);

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerText: 'product-base-list-component.name',
      template: TableTemplate.text,
    },
    {
      field: 'categoryName',
      headerText: 'product-base-list-component.category-name',
      template: TableTemplate.text,
    },
    {
      field: 'productCount',
      headerText: 'product-base-list-component.product-count',
      template: TableTemplate.text,
    },
    {
      field: 'productParameterCount',
      headerText: 'product-base-list-component.parameter-count',
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
    this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.productBase}/${ClientRoute.list}/${pageNumber}`);
  }

  navigateToCreate(): void {
    this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.productBase}/${ClientRoute.form}`);
  }

  navigateToEdit(id: string): void {
    this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.productBase}/${ClientRoute.form}/${id}`);
  }

  removeRecord(id: string): void {
    this._productBaseDataService
      .delete(id)
      .pipe(
        switchMap(() => {
          const pageNumber = this._activatedRoute.snapshot.params['pageNumber'];
          return this._productBaseDataService.getPage(pageNumber ?? 1);
        }),
      )
      .subscribe({
        next: response => {
          this.setPageProductBase(response);
        },
      });
  }

  private setPageProductBase(pageProductBases: PageDto<ProductBaseListDto>): void {
    this.productBases.set(pageProductBases.items);
    this.pagination.set({
      currentPage: pageProductBases.currentPage,
      totalPages: pageProductBases.totalPages,
    });
  }
}
