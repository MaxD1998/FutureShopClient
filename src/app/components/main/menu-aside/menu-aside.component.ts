import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, Subject, map, switchMap, takeUntil } from 'rxjs';
import { ClientRoute } from '../../../core/constants/client-routes/client.route';
import { CategoryDataService } from '../../../core/data-services/category.data-service';
import { AsideItemModel } from '../../../core/models/aside-item.model';
import { AsideComponent } from '../../shared/aside/aside.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-menu-aside',
  standalone: true,
  templateUrl: './menu-aside.component.html',
  styleUrl: './menu-aside.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, TranslateModule, AsideComponent],
})
export class MenuAsideComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _translateService = inject(TranslateService);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  private _parentId?: string = undefined;

  categories = signal<AsideItemModel[]>([]);

  constructor() {
    this.categories.set(this._activatedRoute.snapshot.data['categories']);

    this._translateService.onLangChange
      .pipe(
        takeUntil(this._unsubscribe),
        switchMap(() => {
          return this.getsCategoryByCategoryId$(this._parentId);
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
