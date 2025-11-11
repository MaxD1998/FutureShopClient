import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { ShopPermission } from '../../../../../core/enums/permissions/shop-permission';
import { shopPermissionGuard } from '../../../core/guards/shop-permission.guard';
import { productBaseFormResolver } from '../../../core/resolvers/settings/product-base-form.resolver';
import { productBaseListResolver } from '../../../core/resolvers/settings/product-base-list.resolver';
export const productBaseRoutes: Routes = [
  {
    path: `${ClientRoute.form}/:id`,
    loadComponent: () =>
      import('./product-base-form/product-base-form.component').then(x => x.ProductBaseFormComponent),
    resolve: {
      form: productBaseFormResolver,
    },
    canMatch: [shopPermissionGuard(ShopPermission.ProductBaseAddUpdate)],
  },
  {
    path: `${ClientRoute.list}`,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./product-base-list/product-base-list.component').then(x => x.ProductBaseListComponent),
        resolve: {
          pageProductBases: productBaseListResolver,
        },
      },
      {
        path: ':pageNumber',
        loadComponent: () =>
          import('./product-base-list/product-base-list.component').then(x => x.ProductBaseListComponent),
        resolve: {
          pageProductBases: productBaseListResolver,
        },
      },
    ],
    runGuardsAndResolvers: 'always',
  },
];
