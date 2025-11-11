import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { AuthorizationPermission } from '../../../../../core/enums/permissions/authorization-permission';
import { authPermissionGuard } from '../../../core/guards/auth-permission.guard';
import { userFormResolver } from '../../../core/resolvers/user/user-form.resolver';
import { userListResolver } from '../../../core/resolvers/user/user-list.resolver';

export const userRoutes: Routes = [
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
        loadComponent: () => import('./user-form/user-form.component').then(x => x.UserFormComponent),
        resolve: {
          form: userFormResolver,
        },
      },
      {
        path: ':id',
        loadComponent: () => import('./user-form/user-form.component').then(x => x.UserFormComponent),
        resolve: {
          form: userFormResolver,
        },
      },
    ],
    canMatch: [authPermissionGuard(AuthorizationPermission.UserAddUpdate)],
  },
  {
    path: `${ClientRoute.list}`,
    children: [
      {
        path: '',
        loadComponent: () => import('./user-list/user-list.component').then(x => x.UserListComponent),
        resolve: {
          pageUsers: userListResolver,
        },
      },
      {
        path: ':pageNumber',
        loadComponent: () => import('./user-list/user-list.component').then(x => x.UserListComponent),
        resolve: {
          pageUsers: userListResolver,
        },
      },
    ],
    runGuardsAndResolvers: 'always',
  },
];
