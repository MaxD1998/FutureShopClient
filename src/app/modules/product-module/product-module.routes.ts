import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { ProductPermission } from '../../core/enums/product-permission';
import { productPermissionGuard } from './core/guards/product-permission.guard';

export const productModuleRoutes: Routes = [
  {
    path: '',
    redirectTo: ClientRoute.category,
    pathMatch: 'full',
  },
  {
    path: ClientRoute.category,
    loadChildren: () => import('./components/category/category.routes').then(x => x.categoryRoutes),
    canMatch: [productPermissionGuard(ProductPermission.CategoryRead)],
  },
  {
    path: ClientRoute.productBase,
    loadChildren: () => import('./components/product-base/product-base.routes').then(x => x.productBaseRoutes),
    canMatch: [productPermissionGuard(ProductPermission.ProductBaseRead)],
  },
  {
    path: ClientRoute.product,
    loadChildren: () => import('./components/product/product.routes').then(x => x.productRoutes),
    canMatch: [productPermissionGuard(ProductPermission.ProductRead)],
  },
];
