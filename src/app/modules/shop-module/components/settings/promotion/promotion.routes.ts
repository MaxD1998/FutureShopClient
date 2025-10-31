import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { ShopPermission } from '../../../../../core/enums/shop-permission';
import { shopPermissionGuard } from '../../../core/guards/shop-permission.guard';
import { promotionFormResolver } from '../../../core/resolvers/settings/promotion-form.resolver';
import { promotionListResolver } from '../../../core/resolvers/settings/promotion-list.resolver';

export const promotionRoutes: Routes = [
  {
    path: '',
    redirectTo: ClientRoute.list,
    pathMatch: 'full',
  },
  {
    path: ClientRoute.form,
    children: [
      {
        path: '',
        loadComponent: () => import('./promotion-form/promotion-form.component').then(x => x.PromotionFormComponent),
        resolve: {
          form: promotionFormResolver,
        },
      },
      {
        path: ':id',
        loadComponent: () => import('./promotion-form/promotion-form.component').then(x => x.PromotionFormComponent),
        resolve: {
          form: promotionFormResolver,
        },
      },
    ],
    canMatch: [shopPermissionGuard(ShopPermission.ProductAddUpdate)],
  },
  {
    path: `${ClientRoute.list}`,
    children: [
      {
        path: '',
        loadComponent: () => import('./promotion-list/promotion-list.component').then(x => x.PromotionListComponent),
        resolve: {
          pagePromotions: promotionListResolver,
        },
      },
      {
        path: ':pageNumber',
        loadComponent: () => import('./promotion-list/promotion-list.component').then(x => x.PromotionListComponent),
        resolve: {
          pagePromotions: promotionListResolver,
        },
      },
    ],
    runGuardsAndResolvers: 'always',
  },
];
