import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subject, map, switchMap, takeUntil } from 'rxjs';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { CategoryDataService } from '../../../../core/data-services/category.data-service';
import { CategoryDto } from '../../../../core/dtos/category.dto';
import { PageDto } from '../../../../core/dtos/page.dto';
import { GridTemplate } from '../../../../core/enums/grid-template';
import { CategoryGridModel } from '../../../../core/models/category-grid-model';
import { DataGridColumnModel } from '../../../../core/models/data-grid-column.model';
import { PaginationModel } from '../../../../core/models/pagination.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { GridPaginationComponent } from '../../../shared/grid/grid-pagination/grid-pagination.component';
import { GridComponent } from '../../../shared/grid/grid.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GridComponent, TranslateModule, ButtonComponent, GridPaginationComponent],
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

  columns: DataGridColumnModel[] = [
    {
      field: 'name',
      headerText: 'category-list-component.name',
      template: GridTemplate.text,
    },
    {
      field: 'isSubCategory',
      headerText: 'category-list-component.is-subcategory',
      template: GridTemplate.boolean,
    },
    {
      field: 'hasSubCategories',
      headerText: 'category-list-component.has-subcategories',
      template: GridTemplate.boolean,
    },
    {
      field: 'actions',
      headerText: '',
      template: GridTemplate.action,
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
      .subscribe({
        next: response => {
          this.categories.set(response);
        },
      });
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

  navigateToDetails(id: string): void {
    this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.categories}/${ClientRoute.details}/${id}`);
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
      .subscribe({
        next: response => {
          this.categories.set(response);
        },
      });
  }

  private initCategories(): void {
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
  }

  private getCategories$(): Observable<CategoryGridModel[]> {
    const pageNumber = this._activatedRoute.snapshot.params['pageNumber'];
    return this._categoryDataService.getPage(pageNumber ?? 1).pipe(
      map(response => {
        return response.items.map<CategoryGridModel>(x => {
          return {
            id: x.id,
            name: x.name,
            isSubCategory: !!x.parentCategoryId,
            hasSubCategories: x.hasSubCategories,
          };
        });
      }),
    );
  }
}
