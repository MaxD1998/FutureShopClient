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
import { UserDataService } from '../../../../core/data-service/user.data-service';
import { UserListDto } from '../../../../core/dtos/user/user.list-dto';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-user-list',
  imports: [AsyncPipe, TableComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  private readonly _baseRoute: string[] = [ClientRoute.authModule, ClientRoute.settings, ClientRoute.user];

  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _userDataService = inject(UserDataService);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  readonly userService = inject(UserService);

  AuthorizationPermission: typeof AuthorizationPermission = AuthorizationPermission;

  pagination = signal<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
  });
  users = signal<UserListDto[]>([]);

  columns: DataTableColumnModel[] = [
    {
      field: 'firstName',
      headerFloat: TableHeaderFloat.left,
      headerText: 'auth-module.user-list-component.columns.first-name',
      template: TableTemplate.text,
    },
    {
      field: 'lastName',
      headerFloat: TableHeaderFloat.left,
      headerText: 'auth-module.user-list-component.columns.last-name',
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
      const pageUsers: PageDto<UserListDto> = this._activatedRoute.snapshot.data['pageUsers'];
      this.setUsers(pageUsers);
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
    this._userDataService
      .delete(id)
      .pipe(
        switchMap(() => {
          const pageNumber = this._activatedRoute.snapshot.params['pageNumber'];
          return this._userDataService.getPage(pageNumber ?? 1);
        }),
      )
      .subscribe({
        next: response => {
          this.setUsers(response);
        },
      });
  }

  private setUsers(pageUser: PageDto<UserListDto>): void {
    this.users.set(pageUser.items);
    this.pagination.set({
      currentPage: pageUser.currentPage,
      totalPages: pageUser.totalPages,
    });
  }
}
