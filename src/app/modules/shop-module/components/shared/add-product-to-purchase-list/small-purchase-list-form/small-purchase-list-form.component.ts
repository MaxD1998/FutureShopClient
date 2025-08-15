import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { PurchaseListRequestFormDto } from '../../../../core/dtos/purchase-list/purchase-list.request-from-dto';
import { PurchaseListService } from '../../../../core/services/purchase-list.service';

interface ISmallPurchaseListForm {
  name: FormControl<string>;
}

@Component({
  selector: 'app-small-purchase-list-form',
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent],
  templateUrl: './small-purchase-list-form.component.html',
  styleUrl: './small-purchase-list-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmallPurchaseListFormComponent extends BaseFormComponent<ISmallPurchaseListForm> {
  private readonly _purchaseListService = inject(PurchaseListService);

  onClick = output<void>();

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const value: PurchaseListRequestFormDto = {
      isFavourite: false,
      name: this.form.getRawValue().name,
      purchaseListItems: [],
    };

    this._purchaseListService.create(value);
    this.form.reset();
    this.onClick.emit();
  }

  protected override setGroup(): FormGroup<ISmallPurchaseListForm> {
    return this._formBuilder.group<ISmallPurchaseListForm>({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });
  }
}
