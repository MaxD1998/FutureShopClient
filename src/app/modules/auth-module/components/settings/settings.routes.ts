import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { AuthorizationPermission } from '../../../../core/enums/permissions/authorization-permission';
import { authPermissionGuard } from '../../core/guards/auth-permission.guard';

export const settingsRoutes: Routes = [
  {
    path: ClientRoute.user,
    loadChildren: () => import('./user/user.routes').then(x => x.userRoutes),
    canMatch: [authPermissionGuard(AuthorizationPermission.UserRead)],
  },
  {
    path: ClientRoute.permissionGroup,
    loadChildren: () => import('./permission-group/permission-group.routes').then(x => x.permissionGroupRoutes),
    canMatch: [authPermissionGuard(AuthorizationPermission.PermissionGroupRead)],
  },
];
