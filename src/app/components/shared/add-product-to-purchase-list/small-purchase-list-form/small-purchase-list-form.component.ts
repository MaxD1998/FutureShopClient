import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BaseFormComponent } from '../../../../core/bases/base-form.component';
import { PurchaseListFormDto } from '../../../../core/dtos/purchase-list.from-dto';
import { PurchaseListService } from '../../../../core/services/purchase-list.service';
import { ButtonComponent } from '../../button/button.component';
import { InputComponent } from '../../input/input.component';

@Component({
    selector: 'app-small-purchase-list-form',
    imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent],
    templateUrl: './small-purchase-list-form.component.html',
    styleUrl: './small-purchase-list-form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmallPurchaseListFormComponent extends BaseFormComponent {
  private readonly _purchaseListService = inject(PurchaseListService);

  onClick = output<void>();

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const value: PurchaseListFormDto = {
      isFavourite: false,
      name: this.form.value['name'],
      purchaseListItems: [],
    };

    this._purchaseListService.create(value);
    this.form.reset();
    this.onClick.emit();
  }

  protected override setFormControls(): {} {
    return {
      name: [null, [Validators.required]],
    };
  }
}
