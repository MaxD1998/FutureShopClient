import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { AuthorizationPermission } from '../../../../../core/enums/permissions/authorization-permission';
import { authPermissionGuard } from '../../../core/guards/auth-permission.guard';
import { permissionGroupFormResolver } from '../../../core/resolvers/permission-group/permission-group-form.resolver';
import { permissionGroupListResolver } from '../../../core/resolvers/permission-group/permission-group-list.resolver';

export const permissionGroupRoutes: Routes = [
  {
    path: '',
    redirectTo: ClientRoute.list,
    pathMatch: 'full',
  },
  {
    path: ClientRoute.form,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./permission-group-form/permission-group-form.component').then(x => x.PermissionGroupFormComponent),
        resolve: {
          form: permissionGroupFormResolver,
        },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./permission-group-form/permission-group-form.component').then(x => x.PermissionGroupFormComponent),
        resolve: {
          form: permissionGroupFormResolver,
        },
      },
    ],
    canMatch: [authPermissionGuard(AuthorizationPermission.PermissionGroupAddUpdate)],
  },
  {
    path: `${ClientRoute.list}`,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./permission-group-list/permission-group-list.component').then(x => x.PermissionGroupListComponent),
        resolve: {
          pagePermissionGroups: permissionGroupListResolver,
        },
      },
      {
        path: ':pageNumber',
        loadComponent: () =>
          import('./permission-group-list/permission-group-list.component').then(x => x.PermissionGroupListComponent),
        resolve: {
          pagePermissionGroups: permissionGroupListResolver,
        },
      },
    ],
    runGuardsAndResolvers: 'always',
  },
];
