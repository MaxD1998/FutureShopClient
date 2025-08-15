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
import { CategoryPageListDto } from '../../../../core/dtos/category/category.page-list-dto';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, TableComponent],
})
export class CategoryListComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  categories = signal<CategoryPageListDto[]>([]);
  pagination = signal<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
  });

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerText: 'shop-module.category-list-component.name',
      template: TableTemplate.text,
    },
    {
      field: 'isSubCategory',
      headerText: 'shop-module.category-list-component.is-subcategory',
      template: TableTemplate.boolean,
    },
    {
      field: 'subCategoryQuantity',
      headerText: 'shop-module.category-list-component.number-of-subcategories',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  constructor() {
    this.initCategories();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  changePage(pageNumber: number): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.category}/${ClientRoute.list}/${pageNumber}`,
    );
  }

  navigateToEdit(id: string): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.category}/${ClientRoute.form}/${id}`,
    );
  }

  private initCategories(): void {
    this._activatedRoute.paramMap.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
      const pageCategories: PageDto<CategoryPageListDto> = this._activatedRoute.snapshot.data['pageCategories'];
      this.categories.set(pageCategories.items);
      this.pagination.set({
        currentPage: pageCategories.currentPage,
        totalPages: pageCategories.totalPages,
      });
    });
  }
}
