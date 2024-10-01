import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { productDetailsResolver } from '../../core/resolvers/product-details.resolver';
import { productShopListResolver } from '../../core/resolvers/product-shop-list.resolver';

export const mainRoutes: Routes = [
  {
    path: `${ClientRoute.product}/:categoryId`,
    loadComponent: () =>
      import('./product/product-shop-list/product-shop-list.component').then(x => x.ProductShopListComponent),
    resolve: {
      data: productShopListResolver,
    },
  },
  {
    path: `${ClientRoute.product}/${ClientRoute.details}/:id`,
    loadComponent: () =>
      import('./product/product-details/product-details.component').then(x => x.ProductDetailsComponent),
    resolve: {
      data: productDetailsResolver,
    },
  },
];
