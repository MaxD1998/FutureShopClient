import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { AsideComponent } from '../../../../../components/shared/aside/aside.component';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { AsideItemModel } from '../../../../../core/models/aside-item.model';
import { CategoryDataService } from '../../../core/data-services/category.data-service';

@Component({
  selector: 'app-menu-aside',
  templateUrl: './menu-aside.component.html',
  styleUrl: './menu-aside.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, AsideComponent],
})
export class MenuAsideComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);

  categories = signal<AsideItemModel[]>([]);

  constructor() {
    this.categories.set(this._activatedRoute.snapshot.data['categories']);
  }

  getsCategoryByCategoryId(categoryParentId?: string): void {
    this.getsCategoryByCategoryId$(categoryParentId).subscribe({
      next: response => {
        this.categories.set(response);
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
            link: `${ClientRoute.product}/${x.id}`,
          };
        });
      }),
    );
  }
}
