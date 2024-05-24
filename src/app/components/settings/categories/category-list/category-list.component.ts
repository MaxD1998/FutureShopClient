import { Component, OnDestroy, WritableSignal, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subject, map, switchMap, takeUntil } from 'rxjs';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { CategoryDataService } from '../../../../core/data-services/category.data-service';
import { CategoryDto } from '../../../../core/dtos/category.dto';
import { GridTemplate } from '../../../../core/enums/grid-template';
import { CategoryGridModel } from '../../../../core/models/category-grid-model';
import { DataGridColumnModel } from '../../../../core/models/data-grid-column.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { GridComponent } from '../../../shared/grid/grid.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
  imports: [GridComponent, TranslateModule, ButtonComponent],
})
export class CategoryListComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _router = inject(Router);
  private readonly _translateService = inject(TranslateService);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  categories: WritableSignal<CategoryGridModel[]> = signal([]);
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
    const categories: CategoryDto[] = this._activatedRoute.snapshot.data['categories'];
    this.categories.set(
      categories.map<CategoryGridModel>(x => {
        return {
          id: x.id,
          name: x.name,
          isSubCategory: !!x.parentCategoryId,
          hasSubCategories: x.hasSubCategories,
        };
      }),
    );
  }

  private getCategories$(): Observable<CategoryGridModel[]> {
    return this._categoryDataService.gets().pipe(
      map(response => {
        return response.map<CategoryGridModel>(x => {
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
