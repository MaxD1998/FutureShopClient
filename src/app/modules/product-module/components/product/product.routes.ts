import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { ProductPermission } from '../../../../core/enums/permissions/product-permission';
import { productPermissionGuard } from '../../core/guards/product-permission.guard';
import { productFormResolver } from '../../core/resolvers/product-form.resolver';
import { productListResolver } from '../../core/resolvers/product-list.resolver';
export const productRoutes: Routes = [
  {
    path: ClientRoute.form,
    children: [
      {
        path: '',
        loadComponent: () => import('./product-form/product-form.component').then(x => x.ProductFormComponent),
        resolve: {
          form: productFormResolver,
        },
      },
      {
        path: ':id',
        loadComponent: () => import('./product-form/product-form.component').then(x => x.ProductFormComponent),
        resolve: {
          form: productFormResolver,
        },
      },
    ],
    canMatch: [productPermissionGuard(ProductPermission.ProductAddUpdate)],
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
