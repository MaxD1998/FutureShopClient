import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../../components/shared/input-select/models/select-item.model';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { UserType } from '../../../../../../core/enums/user-type';
import { UserDataService } from '../../../../core/data-service/user.data-service';
import { UserPermissionGroupFromDto } from '../../../../core/dtos/user/user-permission-group.form-dto';
import { UserResponseFormDto } from '../../../../core/dtos/user/user.response-form-dto';
import { UserService } from '../../../../core/services/user.service';
import { UserPermissionGroupTableComponent } from './user-permission-group-table/user-permission-group-table.component';

export interface IUserForm {
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  password: FormControl<string | null>;
  type: FormControl<string | null>;
  userPermissionGroups: FormArray<FormControl<UserPermissionGroupFromDto>>;
}

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent,
    InputComponent,
    InputSelectComponent,
    UserPermissionGroupTableComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent extends BaseFormComponent<IUserForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _userDataService = inject(UserDataService);
  private readonly _userService = inject(UserService);

  header = this.id ? 'auth-module.user-form-component.edit-user' : 'auth-module.user-form-component.create-user';

  id?: string = this._activatedRoute.snapshot.params['id'];
  typeItems: SelectItemModel[] = [
    {
      value: this._translateService.instant('common.input-select.select-option'),
    },
    {
      id: UserType.employee.toString(),
      value: this._translateService.instant('auth-module.user-form-component.types.employee'),
    },
    {
      id: UserType.customer.toString(),
      value: this._translateService.instant('auth-module.user-form-component.types.customer'),
    },
  ];

  user?: UserResponseFormDto = this._activatedRoute.snapshot.data['form'];

  constructor() {
    super();
    this.setPasswordForm();
    this.setHiddenUserTypeValue();

    const user = this.user;

    if (user) {
      const { email, firstName, lastName, type, userPermissionGroups } = user;
      this.form.patchValue({ email, firstName, lastName, type: type.toString() });
      userPermissionGroups.forEach(x =>
        this.form.controls.userPermissionGroups.push(
          new FormControl<UserPermissionGroupFromDto>(x, { nonNullable: true }),
        ),
      );
    }
  }

  mapToUserType(value: string | null): UserType | undefined {
    if (!value) return undefined;

    const num = Number(value);
    if (!isNaN(num) && typeof (UserType as any)[num] === 'string') {
      return num as UserType;
    }

    return undefined;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, firstName, lastName, password, type, userPermissionGroups } = this.form.getRawValue();
    const id = this.id;
    const addOrUpdate = id
      ? this._userDataService.update(id, {
          email,
          firstName,
          lastName,
          type: this.mapToUserType(type)!,
          userPermissionGroups,
        })
      : this._userDataService.create({
          email,
          firstName,
          lastName,
          password: password!,
          type: this.mapToUserType(type)!,
          userPermissionGroups,
        });

    addOrUpdate.subscribe({
      next: () => {
        const route: string[] = [ClientRoute.authModule, ClientRoute.settings, ClientRoute.user, ClientRoute.list];
        this._router.navigate(route);
      },
    });
  }

  protected override setGroup(): FormGroup<IUserForm> {
    return this._formBuilder.group<IUserForm>({
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl<string | null>(null),
      type: new FormControl<string | null>(null),
      userPermissionGroups: new FormArray<FormControl<UserPermissionGroupFromDto>>([]),
    });
  }

  private setHiddenUserTypeValue(): void {
    const user = this._userService.user$.getValue();
    if (!user) {
      return;
    }

    if (user.roles.includes(UserType.superAdmin)) {
      const typeItem: SelectItemModel = {
        id: UserType.superAdmin.toString(),
        value: this._translateService.instant('auth-module.user-form-component.types.super-admin'),
      };

      this.typeItems.splice(1, 0, typeItem);
    }
  }

  private setPasswordForm(): void {
    if (this.id) {
      this.form.controls.password.clearValidators();
    } else {
      this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
    }

    this.form.controls.password.updateValueAndValidity();
  }
}
