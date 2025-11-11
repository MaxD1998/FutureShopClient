import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { PageDto } from '../../../../../../core/dtos/page.dto';
import { AuthorizationPermission } from '../../../../../../core/enums/permissions/authorization-permission';
import { TableHeaderFloat } from '../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { PaginationModel } from '../../../../../../core/models/pagination.model';
import { PermissionGroupDataService } from '../../../../core/data-service/permission-group.data-service';
import { PermissionGroupListDto } from '../../../../core/dtos/permission-group/permission-group.list-dto';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-permission-group-list',
  imports: [AsyncPipe, TableComponent],
  templateUrl: './permission-group-list.component.html',
  styleUrl: './permission-group-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionGroupListComponent {
  private readonly _baseRoute: string[] = [ClientRoute.authModule, ClientRoute.settings, ClientRoute.permissionGroup];

  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _permissionGroupDataService = inject(PermissionGroupDataService);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  readonly userService = inject(UserService);

  AuthorizationPermission: typeof AuthorizationPermission = AuthorizationPermission;

  pagination = signal<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
  });
  permissionGroups = signal<PermissionGroupListDto[]>([]);

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'auth-module.permission-group-list-component.columns.name',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  constructor() {
    this._activatedRoute.paramMap.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
      const pagePermissionGroups: PageDto<PermissionGroupListDto> =
        this._activatedRoute.snapshot.data['pagePermissionGroups'];
      this.setPagePermissionGroups(pagePermissionGroups);
    });
  }

  changePage(pageNumber: number): void {
    this._router.navigate([...this._baseRoute, ClientRoute.list, pageNumber]);
  }

  navigateToCreate(): void {
    this._router.navigate([...this._baseRoute, ClientRoute.form]);
  }

  navigateToEdit(id: string): void {
    this._router.navigate([...this._baseRoute, ClientRoute.form, id]);
  }

  removeRecord(id: string): void {
    this._permissionGroupDataService
      .delete(id)
      .pipe(
        switchMap(() => {
          const pageNumber = this._activatedRoute.snapshot.params['pageNumber'];
          return this._permissionGroupDataService.getPage(pageNumber ?? 1);
        }),
      )
      .subscribe({
        next: response => {
          this.setPagePermissionGroups(response);
        },
      });
  }

  private setPagePermissionGroups(pagePermissionGroup: PageDto<PermissionGroupListDto>): void {
    this.permissionGroups.set(pagePermissionGroup.items);
    this.pagination.set({
      currentPage: pagePermissionGroup.currentPage,
      totalPages: pagePermissionGroup.totalPages,
    });
  }
}
