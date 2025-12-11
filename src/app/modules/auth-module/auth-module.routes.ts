import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { authEmployeeGuard } from '../../core/guards/auth-employee.guard';
import { unauthGuard } from '../../core/guards/unauth.guard';

export const authModuleRoutes: Routes = [
  {
    path: ClientRoute.auth,
    loadComponent: () =>
      import('./components/authorization/authorization.component').then(x => x.AuthorizationComponent),
    loadChildren: () => import('./components/authorization/authorization.routes').then(x => x.authRoutes),
    canActivate: [unauthGuard],
  },
  {
    path: ClientRoute.settings,
    loadComponent: () => import('./components/settings/settings.component').then(x => x.SettingsComponent),
    loadChildren: () => import('./components/settings/settings.routes').then(x => x.settingsRoutes),
    canActivate: [authEmployeeGuard],
  },
];
