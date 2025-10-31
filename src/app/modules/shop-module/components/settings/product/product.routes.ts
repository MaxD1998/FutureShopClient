import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { ShopPermission } from '../../../../../core/enums/shop-permission';
import { shopPermissionGuard } from '../../../core/guards/shop-permission.guard';
import { productFormResolver } from '../../../core/resolvers/settings/product-form.resolver';
import { productListResolver } from '../../../core/resolvers/settings/product-list.resolver';
export const productRoutes: Routes = [
  {
    path: `${ClientRoute.form}/:id`,
    loadComponent: () => import('./product-form/product-form.component').then(x => x.ProductFormComponent),
    resolve: {
      form: productFormResolver,
    },
    canMatch: [shopPermissionGuard(ShopPermission.ProductAddUpdate)],
  },
  {
    path: ClientRoute.list,
    children: [
      {
        path: '',
        loadComponent: () => import('./product-list/product-list.component').then(x => x.ProductListComponent),
        resolve: {
          pageProducts: productListResolver,
        },
      },
      {
        path: ':pageNumber',
        loadComponent: () => import('./product-list/product-list.component').then(x => x.ProductListComponent),
        resolve: {
          pageProducts: productListResolver,
        },
      },
    ],
    runGuardsAndResolvers: 'always',
  },
];
