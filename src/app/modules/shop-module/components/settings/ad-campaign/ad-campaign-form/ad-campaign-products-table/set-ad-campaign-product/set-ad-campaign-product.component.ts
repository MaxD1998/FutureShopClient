import { afterNextRender, ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, map } from 'rxjs';
import { ButtonComponent } from '../../../../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../../../../components/shared/input-select/models/select-item.model';
import { BaseFormComponent } from '../../../../../../../../core/bases/base-form.component';
import { ProductDataService } from '../../../../../../core/data-services/product.data-service';
import { AdCampaignProductFormDto } from '../../../../../../core/dtos/ad-campaign/ad-campaign-product.form-dto';
import { IAdCampaignForm } from '../../ad-campaign-form.component';

interface IProductForm {
  productId: FormControl<string | null>;
}

@Component({
  selector: 'app-set-ad-campaign-product',
  imports: [ReactiveFormsModule, TranslateModule, InputSelectComponent, ButtonComponent],
  templateUrl: './set-ad-campaign-product.component.html',
  styleUrl: './set-ad-campaign-product.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetAdCampaignProductComponent extends BaseFormComponent<IProductForm> {
  private readonly _productDataService = inject(ProductDataService);

  formGroup = input.required<FormGroup<IAdCampaignForm>>();
  onSave = output<void>();

  isLoaded = signal<boolean>(false);
  items = signal<SelectItemModel[]>([]);

  constructor() {
    super();
    afterNextRender(() => {
      const excludedIds = this.formGroup()
        .getRawValue()
        .adCampaignProducts.map(x => x.productId);

      this._productDataService
        .getListIdName(excludedIds)
        .pipe(
          map(products => products.map(x => ({ id: x.id, value: x.name }))),
          finalize(() => this.isLoaded.set(true)),
        )
        .subscribe({
          next: products => {
            const items = [
              {
                value: this._translateService.instant('common.input-select.select-option'),
              },
            ].concat(products);

            this.items.set(items);
          },
        });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const productId = this.form.getRawValue().productId!;
    const { id, value } = this.items().find(x => x.id === productId)!;
    this.formGroup().controls.adCampaignProducts.push(
      new FormControl<AdCampaignProductFormDto>(
        {
          productId: id!,
          productName: value,
        },
        { nonNullable: true },
      ),
    );

    this.onSave.emit();
  }

  protected override setGroup(): FormGroup<IProductForm> {
    return this._formBuilder.group<IProductForm>({
      productId: new FormControl<string | null>(null),
    });
  }
}
