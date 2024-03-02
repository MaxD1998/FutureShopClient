import { Component, EventEmitter, Output, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryDataService } from '../../../core/data-services/category.data-service';
import { CategoryDto } from '../../../core/dtos/category.dto';
import { IconType } from '../../../core/enums/icon-type';
import { IconComponent } from '../../shared/icon/icon.component';
import { AsideCardComponent } from './aside-card/aside-card.component';

@Component({
  selector: 'app-aside',
  standalone: true,
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css',
  imports: [AsideCardComponent, IconComponent, TranslateModule],
})
export class AsideComponent {
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  private readonly _categoryDataService = inject(CategoryDataService);

  private _categories: CategoryDto[] | null = null;
  private _isFirstLoaded: boolean = false;

  IconType: typeof IconType = IconType;
  selectedCategoryParentsIds: (string | null)[] = [];

  constructor() {
    this.getsCategoryByCategoryId(null, () => {
      this._isFirstLoaded = true;
    });
  }

  get categories(): CategoryDto[] | null {
    return this._categories;
  }

  get hasSelectedCategoryParentsIds(): boolean {
    return this.selectedCategoryParentsIds.length > 0;
  }

  get isAnimate(): boolean {
    return !!this.categories && (!this.categories.some(x => x.parentCategoryId == null) || !this._isFirstLoaded);
  }

  backLevel(): void {
    const lenght = this.selectedCategoryParentsIds.length;
    if (lenght == 0) {
      return;
    }

    const categoryParentId = this.selectedCategoryParentsIds[lenght - 1];
    this.selectedCategoryParentsIds.pop();
    this._categories = null;
    this.getsCategoryByCategoryId(categoryParentId, () => {
      this._isFirstLoaded = false;
    });
  }

  closeMenu(): void {
    this.onClose.emit();
  }

  selectLevel(categoryId: string): void {
    if (!this.categories) {
      return;
    }

    const categories = this._categories as CategoryDto[];
    const category = categories.find(x => x.id == categoryId) as CategoryDto;

    this.selectedCategoryParentsIds.push(category.parentCategoryId);
    this._categories = null;
    this.getsCategoryByCategoryId(categoryId);
  }

  private getsCategoryByCategoryId(categoryParentId: string | null, callback?: () => void): void {
    this._categoryDataService.GetsByCategoryId(categoryParentId).subscribe({
      next: response => {
        this._categories = response;

        if (callback) {
          callback();
        }
      },
    });
  }
}
