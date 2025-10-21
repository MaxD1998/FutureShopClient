import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../components/shared/input-select/models/select-item.model';
import { InputComponent } from '../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { ButtonLayout } from '../../../../../core/enums/button-layout';
import { ProductBaseDataService } from '../../../core/data-service/product-base.data-service';
import { ProductBaseRequestFormDto } from '../../../core/dtos/product-base/product-base.request-form-dto';

interface IProductBaseForm {
  categoryId: FormControl<string>;
  name: FormControl<string>;
}

@Component({
  selector: 'app-product-base-form',
  templateUrl: './product-base-form.component.html',
  styleUrl: './product-base-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, ReactiveFormsModule, ButtonComponent, InputComponent, InputSelectComponent],
})
export class ProductBaseFormComponent extends BaseFormComponent<IProductBaseForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productBaseDataService = inject(ProductBaseDataService);
  private readonly _router = inject(Router);

  private readonly _snapshot = this._activatedRoute.snapshot;
  private readonly _resolverData = this._snapshot.data['form'];
  private readonly _id?: string = this._snapshot.params['id'];
  private _productBase?: ProductBaseRequestFormDto = this._resolverData['productBase'];

  ButtonLayout: typeof ButtonLayout = ButtonLayout;

  categoryItems = this._activatedRoute.snapshot.data['form']['categories'] as SelectItemModel[];
  header = this._id
    ? 'product-module.product-base-form-component.edit-product-base'
    : 'product-module.product-base-form-component.create-product-base';

  constructor() {
    super();

    if (this._productBase) {
      const { categoryId, name } = this._productBase;
      this.form.patchValue({ categoryId, name });
    }
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { categoryId, name } = this.form.getRawValue();
    this._productBase = { categoryId, name };

    const productBase$ = !this._id
      ? this._productBaseDataService.create(this._productBase)
      : this._productBaseDataService.update(this._id, this._productBase);

    productBase$.subscribe({
      next: () => {
        this._router.navigateByUrl(`${ClientRoute.productModule}/${ClientRoute.productBase}/${ClientRoute.list}`);
      },
    });
  }

  protected override setGroup(): FormGroup<IProductBaseForm> {
    return this._formBuilder.group<IProductBaseForm>({
      categoryId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });
  }
}
