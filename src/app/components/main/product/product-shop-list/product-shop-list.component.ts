import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { BaseFormComponent } from '../../../../core/bases/base-form.component';
import { CategoryDataService } from '../../../../core/data-services/category.data-service';
import { ProductDataService } from '../../../../core/data-services/product.data-service';
import { IdNameDto } from '../../../../core/dtos/id-name.dto';
import { ProductShopListDto } from '../../../../core/dtos/product-shop.list-dto';
import { ProductShopLisRequestDto } from '../../../../core/dtos/product-shop.list-request-dto';
import { ProductSortType } from '../../../../core/enums/product-sort-type';
import { ProductShopListModel } from '../../../../core/models/product-shop.list-model';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputNumberComponent } from '../../../shared/input-number/input-number.component';
import { InputSelectComponent } from '../../../shared/input-select/input-select.component';
import { InputComponent } from '../../../shared/input/input.component';
import { ProductShopItemComponent } from './product-shop-item/product-shop-item.component';

@Component({
  selector: 'app-product-shop-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    InputComponent,
    InputSelectComponent,
    InputNumberComponent,
    ProductShopItemComponent,
    ButtonComponent,
  ],
  templateUrl: './product-shop-list.component.html',
  styleUrl: './product-shop-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShopListComponent extends BaseFormComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _categoryDataService = inject(CategoryDataService);
  private readonly _productDataService = inject(ProductDataService);
  private readonly _translateService = inject(TranslateService);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  categoryName = signal<string>('');
  products = signal<ProductShopListModel[]>([]);

  sortItems: SelectItemModel[] = Object.keys(ProductSortType)
    .filter(x => !isNaN(Number(x)))
    .map<SelectItemModel>(x => {
      return {
        id: x,
        value: `product-shop-list-component.sort-items.${x}`,
      };
    });

  constructor() {
    super();

    this._activatedRoute.data.subscribe({
      next: data => {
        if (!data) {
          return;
        }

        const result = data['data'] as { category: IdNameDto; products: ProductShopListDto[] };
        this.categoryName.set(result.category.name);
        this.products.set(result.products.map(x => new ProductShopListModel(x)));
      },
    });

    this._translateService.onLangChange
      .pipe(
        takeUntil(this._unsubscribe),
        tap(() => {
          this.products.set([]);
        }),
        switchMap(() => {
          const request: ProductShopLisRequestDto = {
            name: this.form.value['name'],
            priceFrom: this.form.value['priceFrom'],
            priceTo: this.form.value['priceTo'],
            sortType: Number(this.form.value['sortType']),
          };

          return this._categoryDataService.getIdNameById(this._activatedRoute.snapshot.params['categoryId']).pipe(
            switchMap(response => {
              return forkJoin({
                category: of(response),
                products: this._productDataService.getShopListByCategoryId(response.id, request),
              });
            }),
          );
        }),
      )
      .subscribe({
        next: response => {
          this.categoryName.set(response.category.name);
          this.products.set(response.products.map(x => new ProductShopListModel(x)));
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  filter(): void {
    this.products.set([]);

    const request: ProductShopLisRequestDto = {
      name: this.form.value['name'],
      priceFrom: this.form.value['priceFrom'],
      priceTo: this.form.value['priceTo'],
      sortType: Number(this.form.value['sortType']),
    };

    this._productDataService
      .getShopListByCategoryId(this._activatedRoute.snapshot.params['categoryId'], request)
      .subscribe({
        next: response => {
          this.products.set(response.map(x => new ProductShopListModel(x)));
        },
      });
  }

  protected override setFormControls(): {} {
    return {
      name: [null],
      sortType: ['0'],
      priceFrom: [null],
      priceTo: [null],
    };
  }
}
