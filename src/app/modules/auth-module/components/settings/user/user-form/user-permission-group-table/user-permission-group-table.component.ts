import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogWindowComponent } from '../../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../../../components/shared/table/table.component';
import { TableHeaderFloat } from '../../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../../core/models/data-table-column.model';
import { IUserForm } from '../user-form.component';
import { SetUserPermissionGroupComponent } from './set-user-permission-group/set-user-permission-group.component';

@Component({
  selector: 'app-user-permission-group-table',
  imports: [TableComponent, DialogWindowComponent, SetUserPermissionGroupComponent],
  templateUrl: './user-permission-group-table.component.html',
  styleUrl: './user-permission-group-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPermissionGroupTableComponent {
  formGroup = input.required<FormGroup<IUserForm>>();

  columns: DataTableColumnModel[] = [
    {
      field: 'permissionGroupName',
      headerFloat: TableHeaderFloat.left,
      headerText: 'auth-module.user-permission-group-table-component.table-columns.name',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  isDialogActive = signal<boolean>(false);

  remove(perimissionGroupId: string): void {
    const index = this.formGroup()
      .getRawValue()
      .userPermissionGroups.findIndex(x => x.permissionGroupId === perimissionGroupId);
    if (index < 0) {
      return;
    }

    this.formGroup().controls.userPermissionGroups.removeAt(index);
  }
}
