import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subject, map, switchMap, takeUntil, tap } from 'rxjs';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { CategoryDataService } from '../../../../core/data-services/category.data-service';
import { CategoryDto } from '../../../../core/dtos/category.dto';
import { PageDto } from '../../../../core/dtos/page.dto';
import { TableTemplate } from '../../../../core/enums/table-template';
import { CategoryGridModel } from '../../../../core/models/category-grid-model';
import { DataTableColumnModel } from '../../../../core/models/data-table-column.model';
import { PaginationModel } from '../../../../core/models/pagination.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, ButtonComponent, TableComponent],
})
export class CategoryListComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _router = inject(Router);
  private readonly _translateService = inject(TranslateService);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  categories = signal<CategoryGridModel[]>([]);
  pagination = signal<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
  });

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerText: 'category-list-component.name',
      template: TableTemplate.text,
    },
    {
      field: 'isSubCategory',
      headerText: 'category-list-component.is-subcategory',
      template: TableTemplate.boolean,
    },
    {
      field: 'hasSubCategories',
      headerText: 'category-list-component.has-subcategories',
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
    this._translateService.onLangChange
      .pipe(
        takeUntil(this._unsubscribe),
        switchMap(() => {
          return this.getCategories$();
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  changePage(pageNumber: number): void {
    this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.categories}/${ClientRoute.list}/${pageNumber}`);
  }

  navigateToCreate(): void {
    this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.categories}/${ClientRoute.form}`);
  }

  navigateToEdit(id: string): void {
    this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.categories}/${ClientRoute.form}/${id}`);
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
      const pageCategories: PageDto<CategoryDto> = this._activatedRoute.snapshot.data['pageCategories'];
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
