import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';

export const authRoutes: Routes = [
  {
    path: ClientRoute.login,
    loadComponent: () => import('./login/login.component').then(x => x.LoginComponent),
  },
  {
    path: ClientRoute.register,
    loadComponent: () => import('./register/register.component').then(x => x.RegisterComponent),
  },
];
