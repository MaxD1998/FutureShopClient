import { ChangeDetectionStrategy, Component, inject, Injector, input, model, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter, finalize, switchMap, tap } from 'rxjs';
import { ButtonComponent } from '../../../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../../../core/models/select-item.model';
import { ProductDataService } from '../../../../../core/data-services/product.data-service';
import { PromotionProductFormDto } from '../../../../../core/dtos/promotion/promotion-product.form-dto';
import { IPromotionForm } from '../promotion-form.component';

@Component({
  selector: 'app-set-promotion-product',
  imports: [TranslateModule, InputSelectComponent, ButtonComponent],
  templateUrl: './set-promotion-product.component.html',
  styleUrl: './set-promotion-product.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPromotionProductComponent {
  private readonly _injector = inject(Injector);
  private readonly _productDataService = inject(ProductDataService);
  private readonly _translateService = inject(TranslateService);

  private _array: PromotionProductFormDto[] = [];

  formGroup = input.required<FormGroup<IPromotionForm>>();
  isDialogActive = model.required<boolean>();

  isDisabledButton = signal<boolean>(true);
  isLoaded = signal<boolean>(false);
  products = signal<SelectItemModel[]>([]);
  selectValue = signal<string | undefined>('');

  constructor() {
    toObservable(this.isDialogActive, { injector: this._injector })
      .pipe(
        filter(x => x),
        switchMap(() => {
          const excludedIds = this.formGroup()
            .getRawValue()
            .promotionProducts.map(x => x.productId);
          return this._productDataService.getListIdName(excludedIds).pipe(
            finalize(() => {
              this.isLoaded.set(true);
            }),
          );
        }),
      )
      .subscribe({
        next: products => {
          this.selectValue.set(undefined);
          const mappedProducts = products.map(x => ({ id: x.id, value: x.name }));
          const productItems = [
            {
              value: this._translateService.instant('common.input-select.select-option'),
            },
          ].concat(mappedProducts);

          this.products.set(Array.from(productItems));
        },
      });

    toObservable(this.selectValue, { injector: this._injector })
      .pipe(tap(this.onProductSet.bind(this)))
      .subscribe();
  }

  onProductSet(id?: string): void {
    if (!id) {
      this.isDisabledButton.set(true);
      return;
    }

    const product = this.products().find(x => x.id == id);

    if (!product) {
      return;
    }

    this._array = this.formGroup().getRawValue().promotionProducts.slice();
    this._array.push({ productId: product.id!, productName: product.value });
    this._array = this._array.sort((x, y) => {
      {
        if (x.productName < y.productName) {
          return -1;
        }
        if (x.productName > y.productName) {
          return 1;
        }
        return 0;
      }
    });

    this.isDisabledButton.set(false);
  }

  submit(): void {
    const promotionProducts = this.formGroup().controls.promotionProducts;

    promotionProducts.clear();
    this._array.forEach(x => promotionProducts.push(new FormControl(x, { nonNullable: true })));

    console.log();
    this.isDialogActive.set(false);
    this.selectValue.set('');
  }
}
