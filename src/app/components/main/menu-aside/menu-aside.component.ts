import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { CategoryDataService } from '../../../core/data-services/category.data-service';
import { AsideItemModel } from '../../../core/models/aside-item.model';
import { onLangChange } from '../../../core/services/language.service';
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
  private readonly _categoryDataService = inject(CategoryDataService);

  private _parentId: string | null = null;

  categories: AsideItemModel[] = [];

  constructor() {
    this.getsCategoryByCategoryId(this._parentId);

    onLangChange().subscribe(() => {
      this.getsCategoryByCategoryId(this._parentId);
    });
  }

  getsCategoryByCategoryId(categoryParentId: string | null): void {
    this._categoryDataService
      .GetsByCategoryId(categoryParentId)
      .pipe(
        map(response => {
          return response.map<AsideItemModel>(x => {
            return {
              id: x.id,
              name: x.name,
              parentId: x.parentCategoryId,
              hasChildren: x.hasChildren,
            };
          });
        })
      )
      .subscribe({
        next: response => {
          this.categories = response;
        },
      });
  }
}
