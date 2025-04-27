import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TableComponent } from '../../../../../components/shared/table/table.component';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { PageDto } from '../../../../../core/dtos/page.dto';
import { ModuleType } from '../../../../../core/enums/module-type';
import { TableTemplate } from '../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../core/models/data-table-column.model';
import { PaginationModel } from '../../../../../core/models/pagination.model';
import { CategoryDataService } from '../../../core/data-service/category.data-service';
import { CategoryListDto } from '../../../core/dtos/category.list-dto';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, TableComponent],
})
export class CategoryListComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  ModuleType: typeof ModuleType = ModuleType;

  categories = signal<CategoryListDto[]>([]);
  pagination = signal<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
  });

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerText: 'product-module.category-list-component.name',
      template: TableTemplate.text,
    },
    {
      field: 'isSubCategory',
      headerText: 'product-module.category-list-component.is-subcategory',
      template: TableTemplate.boolean,
    },
    {
      field: 'subCategoryQuantity',
      headerText: 'product-module.category-list-component.number-of-subcategories',
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

  changePage(pageNumber: number): void {
    this._router.navigateByUrl(
      `${ClientRoute.productModule}/${ClientRoute.category}/${ClientRoute.list}/${pageNumber}`,
    );
  }

  navigateToCreate(): void {
    this._router.navigateByUrl(`${ClientRoute.productModule}/${ClientRoute.category}/${ClientRoute.form}`);
  }

  navigateToEdit(id: string): void {
    this._router.navigateByUrl(`${ClientRoute.productModule}/${ClientRoute.category}/${ClientRoute.form}/${id}`);
  }

  removeRecord(id: string): void {
    this._categoryDataService
      .delete(id)
      .pipe(
        switchMap(() => {
          return this.getCategories$();
        }),
      )
      .subscribe();
  }

  private initCategories(): void {
    this._activatedRoute.paramMap.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
      const pageCategories: PageDto<CategoryListDto> = this._activatedRoute.snapshot.data['pageCategories'];
      this.categories.set(pageCategories.items);
      this.pagination.set({
        currentPage: pageCategories.currentPage,
        totalPages: pageCategories.totalPages,
      });
    });
  }

  private getCategories$(): Observable<PageDto<CategoryListDto>> {
    const pageNumber = this._activatedRoute.snapshot.params['pageNumber'];
    return this._categoryDataService.getPage(pageNumber ?? 1).pipe(
      map(response => {
        return {
          items: response.items,
          currentPage: response.currentPage,
          totalPages: response.totalPages,
        };
      }),
      tap(response => {
        this.categories.set(response.items);
        this.pagination.set({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
        });
      }),
    );
  }
}
