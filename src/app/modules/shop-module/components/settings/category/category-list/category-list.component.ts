import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { PageDto } from '../../../../../../core/dtos/page.dto';
import { ModuleType } from '../../../../../../core/enums/module-type';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { PaginationModel } from '../../../../../../core/models/pagination.model';
import { CategoryListDto } from '../../../../../product-module/core/dtos/category.list-dto';
import { CategoryGridModel } from '../../../../../product-module/core/models/category-grid-model';
import { CategoryDataService } from '../../../../core/data-services/category.data-service';

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

  categories = signal<CategoryGridModel[]>([]);
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
      field: 'hasSubCategories',
      headerText: 'shop-module.category-list-component.has-subcategories',
      template: TableTemplate.boolean,
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
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.category}/${ClientRoute.list}/${pageNumber}`,
    );
  }

  navigateToCreate(): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.category}/${ClientRoute.form}`,
    );
  }

  navigateToEdit(id: string): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.category}/${ClientRoute.form}/${id}`,
    );
  }

  private initCategories(): void {
    this._activatedRoute.paramMap.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
      const pageCategories: PageDto<CategoryListDto> = this._activatedRoute.snapshot.data['pageCategories'];
      this.categories.set(
        pageCategories.items.map<CategoryGridModel>(x => {
          return {
            id: x.id,
            name: x.name,
            isSubCategory: !!x.parentCategoryId,
            hasSubCategories: x.hasSubCategories,
          };
        }),
      );
      this.pagination.set({
        currentPage: pageCategories.currentPage,
        totalPages: pageCategories.totalPages,
      });
    });
  }

  private getCategories$(): Observable<PageDto<CategoryGridModel>> {
    const pageNumber = this._activatedRoute.snapshot.params['pageNumber'];
    return this._categoryDataService.getPage(pageNumber ?? 1).pipe(
      map(response => {
        return {
          items: response.items.map<CategoryGridModel>(x => {
            return {
              id: x.id,
              name: x.name,
              isSubCategory: !!x.parentCategoryId,
              hasSubCategories: x.hasSubCategories,
            };
          }),
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
