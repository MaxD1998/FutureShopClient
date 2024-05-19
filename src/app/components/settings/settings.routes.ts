import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';

export const settingsRoutes: Routes = [
  {
    path: ClientRoute.categories,
    loadChildren: () => import('./categories/category.routes').then(x => x.categoryRoutes),
  },
];
