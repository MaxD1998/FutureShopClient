import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';

export const productModuleRoutes: Routes = [
  {
    path: '',
    redirectTo: ClientRoute.category,
    pathMatch: 'full',
  },
  {
    path: ClientRoute.category,
    loadChildren: () => import('./components/category/category.routes').then(x => x.categoryRoutes),
  },
  {
    path: ClientRoute.productBase,
    loadChildren: () => import('./components/product-base/product-base.routes').then(x => x.productBaseRoutes),
  },
  {
    path: ClientRoute.product,
    loadChildren: () => import('./components/product/product.routes').then(x => x.productRoutes),
  },
];
