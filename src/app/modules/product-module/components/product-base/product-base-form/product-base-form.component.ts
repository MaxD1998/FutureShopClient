import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../components/shared/input-select/input-select.component';
import { InputComponent } from '../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { ButtonLayout } from '../../../../../core/enums/button-layout';
import { SelectItemModel } from '../../../../../core/models/select-item.model';
import { ProductBaseDataService } from '../../../core/data-service/product-base.data-service';
import { ProductBaseFormDto } from '../../../core/dtos/product-base.form-dto';

@Component({
  selector: 'app-product-base-form',
  templateUrl: './product-base-form.component.html',
  styleUrl: './product-base-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, ReactiveFormsModule, ButtonComponent, InputComponent, InputSelectComponent],
})
export class ProductBaseFormComponent extends BaseFormComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productBaseDataService = inject(ProductBaseDataService);
  private readonly _router = inject(Router);

  ButtonLayout: typeof ButtonLayout = ButtonLayout;

  categoryItems = this._activatedRoute.snapshot.data['form']['categories'] as SelectItemModel[];
  header = this.id
    ? 'product-module.product-base-form-component.edit-product-base'
    : 'product-module.product-base-form-component.create-product-base';
  id?: string = this._activatedRoute.snapshot.params['id'];
  productBase = this._activatedRoute.snapshot.data['form']['productBase'] as ProductBaseFormDto | undefined;

  constructor() {
    super();

    if (this.productBase) {
      this.form.controls['name'].setValue(this.productBase.name);
      this.form.controls['categoryId'].setValue(this.productBase.categoryId);
    }
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as ProductBaseFormDto;

    const productBase$ = !this.id
      ? this._productBaseDataService.add(value)
      : this._productBaseDataService.update(this.id, value);

    productBase$.subscribe({
      next: () => {
        this._router.navigateByUrl(`${ClientRoute.productModule}/${ClientRoute.productBase}/${ClientRoute.list}`);
      },
    });
  }

  protected override setFormControls(): {} {
    return {
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
    };
  }
}
