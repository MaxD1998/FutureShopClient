import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../../components/shared/button/button.component';
import { InputComponent } from '../../../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../../../core/bases/base-form.component';
import { UserDeliveryAddressDataService } from '../../../../../core/data-services/user-delivery-address.data-service';
import { UserDeliveryAddressResponseFormDto } from '../../../../../core/dtos/user-delivery-address/user-delivery-address.response-form.dto';

interface IUserDeliveryAddressForm {
  apartamentNumber: FormControl<string | null>;
  city: FormControl<string>;
  email: FormControl<string>;
  firstName: FormControl<string>;
  houseNumber: FormControl<string>;
  isDefault: FormControl<boolean>;
  lastName: FormControl<string>;
  phoneNumber: FormControl<string>;
  postalCode: FormControl<string>;
  street: FormControl<string>;
}

@Component({
  selector: 'app-add-user-delivery-address',
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent],
  templateUrl: './add-user-delivery-address.component.html',
  styleUrl: './add-user-delivery-address.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserDeliveryAddressComponent extends BaseFormComponent<IUserDeliveryAddressForm> {
  private readonly _userDeliveryAddressDataService = inject(UserDeliveryAddressDataService);

  isDialogActive = model.required<boolean>();
  userDeliveryAddresses = model.required<UserDeliveryAddressResponseFormDto[]>();
  userDeliveryAddressId = model.required<string | undefined>();

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const {
      apartamentNumber,
      city,
      email,
      firstName,
      houseNumber,
      isDefault,
      lastName,
      phoneNumber,
      postalCode,
      street,
    } = this.form.getRawValue();

    const dto = {
      apartamentNumber: apartamentNumber ?? undefined,
      city,
      email,
      firstName,
      houseNumber,
      isDefault,
      lastName,
      phoneNumber,
      postalCode,
      street,
    };

    const id = this.userDeliveryAddressId();
    const addOrUpdate$ = id
      ? this._userDeliveryAddressDataService.update(id, dto)
      : this._userDeliveryAddressDataService.create(dto);

    addOrUpdate$.subscribe({
      next: response => {
        const index = this.userDeliveryAddresses().findIndex(x => x.id === response.id);

        if (index > -1) {
          this.userDeliveryAddresses()[index] = response;
        } else {
          this.userDeliveryAddresses().push(response);
        }

        this.userDeliveryAddresses.set([...this.userDeliveryAddresses()]);
        this.isDialogActive.set(false);
      },
    });
  }

  protected override setGroup(): FormGroup<IUserDeliveryAddressForm> {
    return this._formBuilder.group<IUserDeliveryAddressForm>({
      apartamentNumber: new FormControl(null),
      city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      houseNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      isDefault: new FormControl(false, { nonNullable: true }),
      lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      postalCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    });
  }
}
