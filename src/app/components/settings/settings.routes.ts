import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { UserType } from '../../core/enums/user-type';
import { authGuard } from '../../core/guards/auth.guard';

export const settingsRoutes: Routes = [
  {
    path: ClientRoute.category,
    loadChildren: () => import('./category/category.routes').then(x => x.categoryRoutes),
    canActivate: [authGuard],
    data: { role: UserType.manager },
  },
  {
    path: ClientRoute.productBase,
    loadChildren: () => import('./product-base/product-base.routes').then(x => x.productBaseRoutes),
    canActivate: [authGuard],
    data: { role: UserType.manager },
  },
  {
    path: ClientRoute.product,
    loadChildren: () => import('./product/product.routes').then(x => x.productRoutes),
    canActivate: [authGuard],
    data: { role: UserType.manager },
  },
];
