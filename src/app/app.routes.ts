import { Routes } from '@angular/router';
import { unauthGuard } from './core/guards/unauth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./components/authorization/authorization.routes').then(x => x.authRoutes),
    canActivate: [unauthGuard],
  },
];
