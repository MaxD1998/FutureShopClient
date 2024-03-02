import { Routes } from '@angular/router';
import { ClientRoute } from './core/constants/client-routes/client.route';
import { unauthGuard } from './core/guards/unauth.guard';

export const routes: Routes = [
  {
    path: ClientRoute.main,
    loadComponent: () => import('./components/main/main.component').then(x => x.MainComponent),
  },
  {
    path: ClientRoute.main,
    loadChildren: () => import('./components/authorization/authorization.routes').then(x => x.authRoutes),
    canActivate: [unauthGuard],
  },
];
