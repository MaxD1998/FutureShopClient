import { Routes } from '@angular/router';
import { ClientRoute } from '../core/constants/client-routes/client.route';
import { UserType } from '../core/enums/user-type';
import { authGuard } from '../core/guards/auth.guard';

export const moduleRoutes: Routes = [
  {
    path: ClientRoute.authModule,
    loadComponent: () => import('./auth-module/auth-module.component').then(x => x.AuthModuleComponent),
    loadChildren: () => import('./auth-module/auth-module.routes').then(x => x.authModuleRoutes),
  },
  {
    path: ClientRoute.productModule,
    loadComponent: () => import('./product-module/product-module.component').then(x => x.ProductModuleComponent),
    loadChildren: () => import('./product-module/product-module.routes').then(x => x.productModuleRoutes),
    canActivate: [authGuard],
    data: { role: UserType.user },
  },
  {
    path: '',
    loadComponent: () => import('./shop-module/shop-module.component').then(x => x.ShopModuleComponent),
    loadChildren: () => import('./shop-module/shop-module.routes').then(x => x.shopModuleRoutes),
  },
  {
    path: ClientRoute.warehouseModule,
    loadComponent: () => import('./warehouse-module/warehouse-module.component').then(x => x.WarehouseModuleComponent),
    loadChildren: () => import('./warehouse-module/warehouse-module.routes').then(x => x.warehouseModuleRoutes),
    canActivate: [authGuard],
    data: { role: UserType.user },
  },
];
