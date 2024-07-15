import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';

export const settingsRoutes: Routes = [
  {
    path: ClientRoute.category,
    loadChildren: () => import('./category/category.routes').then(x => x.categoryRoutes),
  },
  {
    path: ClientRoute.productBase,
    loadChildren: () => import('./product-base/product-base.routes').then(x => x.productBaseRoutes),
  },
  {
    path: ClientRoute.product,
    loadChildren: () => import('./product/product.routes').then(x => x.productRoutes),
  },
];
