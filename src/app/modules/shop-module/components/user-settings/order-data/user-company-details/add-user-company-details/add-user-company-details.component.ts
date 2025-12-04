import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../../../../../environments/environment';
import { ButtonComponent } from '../../../../../../../components/shared/button/button.component';
import { InputComponent } from '../../../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../../../core/bases/base-form.component';
import { UserCompanyDetailsDataService } from '../../../../../core/data-services/user-company-details.data-service';
import { UserCompanyDetailsResponseFormDto } from '../../../../../core/dtos/user-company-details/user-company-details.response-form-dto';
import { CompanyIdentifierNumberType } from '../../../../../core/enums/company-identifier-number-type';

interface IUserCompanyDetailsForm {
  apartamentNumber: FormControl<string | null>;
  city: FormControl<string>;
  companyIdentifierNumber: FormControl<string>;
  companyName: FormControl<string>;
  houseNumber: FormControl<string>;
  isDefault: FormControl<boolean>;
  postalCode: FormControl<string>;
  street: FormControl<string>;
  type: FormControl<CompanyIdentifierNumberType>;
}

@Component({
  selector: 'app-add-user-company-details',
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent],
  templateUrl: './add-user-company-details.component.html',
  styleUrl: './add-user-company-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserCompanyDetailsComponent extends BaseFormComponent<IUserCompanyDetailsForm> {
  private readonly _userCompanyDetailsDataService = inject(UserCompanyDetailsDataService);

  isDialogActive = model.required<boolean>();
  userCompanyDetails = model.required<UserCompanyDetailsResponseFormDto[]>();
  userCompanyDetailsId = model.required<string | undefined>();

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const {
      apartamentNumber,
      city,
      companyIdentifierNumber,
      companyName,
      houseNumber,
      isDefault,
      postalCode,
      street,
      type,
    } = this.form.getRawValue();

    const userCompanyDetailsToEdit = {
      apartamentNumber: apartamentNumber ?? undefined,
      city,
      companyIdentifierNumber,
      companyName,
      houseNumber,
      isDefault,
      postalCode,
      street,
      type,
    };

    const id = this.userCompanyDetailsId();
    const addOrUpdate$ = id
      ? this._userCompanyDetailsDataService.update(id, userCompanyDetailsToEdit)
      : this._userCompanyDetailsDataService.create(userCompanyDetailsToEdit);

    addOrUpdate$.subscribe({
      next: response => {
        const index = this.userCompanyDetails().findIndex(x => x.id === response.id);

        if (index > -1) {
          this.userCompanyDetails()[index] = response;
        } else {
          this.userCompanyDetails().push(response);
        }

        this.userCompanyDetails.set(Array.from(this.userCompanyDetails()));
        this.isDialogActive.set(false);
      },
    });
  }

  protected override setGroup(): FormGroup<IUserCompanyDetailsForm> {
    return this._formBuilder.group<IUserCompanyDetailsForm>({
      apartamentNumber: new FormControl(null),
      city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      companyIdentifierNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      houseNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      isDefault: new FormControl(false, { nonNullable: true }),
      postalCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      type: new FormControl(environment.defaultCompanyIdentifier as CompanyIdentifierNumberType, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }
}
