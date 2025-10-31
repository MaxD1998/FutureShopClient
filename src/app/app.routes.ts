import { Routes } from '@angular/router';
import { ClientRoute } from './core/constants/client-routes/client.route';
import { UserType } from './core/enums/user-type';
import { authEmployeeGuard } from './core/guards/auth-employee.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/module.routes').then(x => x.moduleRoutes),
  },
  {
    path: ClientRoute.module,
    loadComponent: () => import('./components/module/module.component').then(x => x.ModuleComponent),
    canActivate: [authEmployeeGuard],
    data: { role: UserType.employee },
  },
];
