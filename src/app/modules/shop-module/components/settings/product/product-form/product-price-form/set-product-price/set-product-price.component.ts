import { ChangeDetectionStrategy, Component, inject, Injector, input, model } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { ButtonComponent } from '../../../../../../../../components/shared/button/button.component';
import { InputDateComponent } from '../../../../../../../../components/shared/input-date/input-date.component';
import { InputNumberComponent } from '../../../../../../../../components/shared/input-number/input-number.component';
import { BaseFormComponent } from '../../../../../../../../core/bases/base-form.component';
import { ProductDataService } from '../../../../../../core/data-services/product.data-service';
import { SimulatePriceFormDto } from '../../../../../../core/dtos/simulate-price.form-dto';
import { SimulatePriceRequestDto } from '../../../../../../core/dtos/simulate-price.request-dto';

interface IPriceForm {
  id: FormControl<string | null>;
  end: FormControl<Date | null>;
  fakeId: FormControl<number>;
  price: FormControl<number | null>;
  start: FormControl<Date | null>;
}

@Component({
  selector: 'app-set-product-price',
  imports: [ReactiveFormsModule, TranslateModule, ButtonComponent, InputDateComponent, InputNumberComponent],
  templateUrl: './set-product-price.component.html',
  styleUrl: './set-product-price.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetProductPriceComponent extends BaseFormComponent<IPriceForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _injector = inject(Injector);
  private readonly _productDataService = inject(ProductDataService);

  private readonly _snapshot = this._activatedRoute.snapshot;
  private _productId: string = this._snapshot.params['id'];

  formArray = input.required<FormArray<FormControl<SimulatePriceFormDto>>>();
  id = model<number>();
  isDialogActive = model.required<boolean>();

  wasActive = false;

  constructor() {
    super();

    toObservable(this.isDialogActive, { injector: this._injector })
      .pipe(
        tap(isActive => {
          if (!isActive) {
            this.id.set(undefined);
            this.form.reset();
          } else {
            const row = this.formArray()
              .getRawValue()
              .find(x => x.fakeId === this.id());

            if (row) {
              const { id, end, fakeId, price, start } = row;
              this.form.patchValue({ id, end, fakeId, price, start });
            }
          }
        }),
      )
      .subscribe();
  }

  submit(): void {
    const rowId = this.id();

    const array = this.formArray().getRawValue();
    const { id, end, fakeId, price, start } = this.form.getRawValue();

    const request: SimulatePriceRequestDto = {
      collection: array,
      element: {
        id: id ?? undefined,
        end: end ?? undefined,
        fakeId: fakeId,
        isNew: !id,
        price: price ?? 0,
        start: start ?? undefined,
      },
      productId: this._productId,
    };

    const simulateAction$ = !rowId
      ? this._productDataService.simulateAddProduct(request)
      : this._productDataService.simulateUpdateProduct(request);

    simulateAction$.subscribe({
      next: response => {
        this.formArray().clear();
        response.forEach((x, i) => {
          x.fakeId = i + 1;
          this.formArray().push(new FormControl<SimulatePriceFormDto>(x, { nonNullable: true }));
          this.isDialogActive.set(false);
        });
      },
    });
  }

  protected override setGroup(): FormGroup<IPriceForm> {
    return this._formBuilder.group<IPriceForm>({
      id: new FormControl(null),
      end: new FormControl(null),
      fakeId: new FormControl(0, { nonNullable: true }),
      price: new FormControl(null, { nonNullable: true, validators: [Validators.required] }),
      start: new FormControl(null),
    });
  }
}
