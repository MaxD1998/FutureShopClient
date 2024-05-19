import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, map, switchMap } from 'rxjs';
import { CategoryDataService } from '../../../core/data-services/category.data-service';
import { AsideItemModel } from '../../../core/models/aside-item.model';
import { AsideComponent } from '../../shared/aside/aside.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-menu-aside',
  standalone: true,
  templateUrl: './menu-aside.component.html',
  styleUrl: './menu-aside.component.css',
  imports: [IconComponent, TranslateModule, AsideComponent],
})
export class MenuAsideComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _translateService = inject(TranslateService);

  private _parentId?: string = undefined;

  categories: AsideItemModel[] = [];

  constructor() {
    this.categories = this._activatedRoute.snapshot.data['categories'];

    this._translateService.onLangChange
      .pipe(
        switchMap(() => {
          return this.getsCategoryByCategoryId$(this._parentId);
        }),
      )
      .subscribe({
        next: response => {
          this.categories = response;
        },
      });
  }

  getsCategoryByCategoryId(categoryParentId?: string): void {
    this.getsCategoryByCategoryId$(categoryParentId).subscribe({
      next: response => {
        this.categories = response;
      },
    });
  }

  private getsCategoryByCategoryId$(categoryParentId?: string): Observable<AsideItemModel[]> {
    return this._categoryDataService.getsByCategoryParentId(categoryParentId).pipe(
      map(response => {
        return response.map<AsideItemModel>(x => {
          return {
            id: x.id,
            name: x.name,
            parentId: x.parentCategoryId,
            hasSubCategories: x.hasSubCategories,
            link: x.id,
          };
        });
      }),
    );
  }
}
