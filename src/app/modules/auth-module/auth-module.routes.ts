import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { unauthGuard } from '../../core/guards/unauth.guard';

export const authModuleRoutes: Routes = [
  {
    path: ClientRoute.auth,
    loadChildren: () => import('./components/authorization/authorization.routes').then(x => x.authRoutes),
    canActivate: [unauthGuard],
  },
];
