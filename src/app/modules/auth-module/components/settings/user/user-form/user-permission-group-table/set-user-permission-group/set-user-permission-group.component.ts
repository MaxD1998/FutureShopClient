import { afterNextRender, ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs';
import { ButtonComponent } from '../../../../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../../../../components/shared/input-select/models/select-item.model';
import { BaseFormComponent } from '../../../../../../../../core/bases/base-form.component';
import { PermissionGroupDataService } from '../../../../../../core/data-service/permission-group.data-service';
import { IUserForm } from '../../user-form.component';

interface IUserPermissionGroupForm {
  permissionGroupId: FormControl<string | null>;
}

@Component({
  selector: 'app-set-user-permission-group',
  imports: [TranslateModule, InputSelectComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './set-user-permission-group.component.html',
  styleUrl: './set-user-permission-group.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetUserPermissionGroupComponent extends BaseFormComponent<IUserPermissionGroupForm> {
  private readonly _permissionGroupDataService = inject(PermissionGroupDataService);

  formGroup = input.required<FormGroup<IUserForm>>();
  isDialogActive = model.required<boolean>();

  permissionGroups = signal<SelectItemModel[]>([]);

  constructor() {
    super();

    afterNextRender(() => {
      const excludedIds = this.formGroup()
        .getRawValue()
        .userPermissionGroups.map(x => x.permissionGroupId);
      this._permissionGroupDataService
        .getListIdName(excludedIds)
        .pipe(map(permissionGroups => permissionGroups.map(x => ({ id: x.id, value: x.name }))))
        .subscribe({
          next: permissionGroups => {
            const items = [{ value: this._translateService.instant('common.input-select.select-option') }].concat(
              permissionGroups,
            );

            this.permissionGroups.set(Array.from(items));
          },
        });
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.form.getRawValue().permissionGroupId;
    const item = this.permissionGroups().find(x => x.id === id);

    if (item) {
      this.formGroup().controls.userPermissionGroups.push(
        new FormControl({ permissionGroupId: item.id!, permissionGroupName: item.value }, { nonNullable: true }),
      );

      this.isDialogActive.set(false);
    }
  }

  protected override setGroup(): FormGroup<IUserPermissionGroupForm> {
    return this._formBuilder.group({
      permissionGroupId: new FormControl<string | null>(null, { validators: [Validators.required] }),
    });
  }
}
