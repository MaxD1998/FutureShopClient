import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputNumberComponent } from '../../../../../../components/shared/input-number/input-number.component';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { IdNameDto } from '../../../../../../core/dtos/id-name.dto';
import { ProductSortType } from '../../../../../../core/enums/product-sort-type';
import { SelectItemModel } from '../../../../../../core/models/select-item.model';
import { ProductDataService } from '../../../../core/data-services/product.data-service';
import { ProductShopListDto } from '../../../../core/dtos/product-shop.list-dto';
import { ProductShopLisRequestDto } from '../../../../core/dtos/product-shop.list-request-dto';
import { ProductListModel } from '../../../../core/models/product-shop.list-model';
import { ProductShopItemComponent } from './product-shop-item/product-shop-item.component';

interface IProductShopListForm {
  name: FormControl<string | null>;
  priceFrom: FormControl<number | null>;
  priceTo: FormControl<number | null>;
  sortType: FormControl<string>;
}

@Component({
  selector: 'app-product-shop-list',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    InputComponent,
    InputSelectComponent,
    InputNumberComponent,
    ButtonComponent,
    ProductShopItemComponent,
  ],
  templateUrl: './product-shop-list.component.html',
  styleUrl: './product-shop-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShopListComponent extends BaseFormComponent<IProductShopListForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productDataService = inject(ProductDataService);
  private readonly _translateService = inject(TranslateService);

  categoryName = signal<string>('');
  products = signal<ProductListModel[]>([]);

  sortItems: SelectItemModel[] = Object.keys(ProductSortType)
    .filter(x => !isNaN(Number(x)))
    .map<SelectItemModel>(x => {
      return {
        id: x,
        value: this._translateService.instant(`shop-module.product-shop-list-component.sort-items.${x}`),
      };
    });

  constructor() {
    super();
    this._activatedRoute.data.subscribe({
      next: data => {
        if (!data) {
          return;
        }

        const result: { category: IdNameDto; products: ProductShopListDto[] } = data['data'];
        this.categoryName.set(result.category.name);
        this.products.set(result.products.map(x => new ProductListModel(x)));
      },
    });
  }

  filter(): void {
    this.products.set([]);

    const { name, priceFrom, priceTo, sortType } = this.form.getRawValue();

    const request: ProductShopLisRequestDto = {
      name: name ?? undefined,
      priceFrom: priceFrom ?? undefined,
      priceTo: priceTo ?? undefined,
      sortType: Number(sortType),
    };

    this._productDataService
      .getShopListByCategoryId(this._activatedRoute.snapshot.params['categoryId'], request)
      .subscribe({
        next: response => {
          this.products.set(response.map(x => new ProductListModel(x)));
        },
      });
  }

  protected override setGroup(): FormGroup<IProductShopListForm> {
    return (
      this,
      this._formBuilder.group<IProductShopListForm>({
        name: new FormControl(null),
        priceFrom: new FormControl(null),
        priceTo: new FormControl(null),
        sortType: new FormControl('0', { nonNullable: true }),
      })
    );
  }
}
