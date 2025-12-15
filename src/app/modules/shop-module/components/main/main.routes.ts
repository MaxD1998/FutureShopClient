import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { basketResolver } from '../../core/resolvers/basket.resolver';
import { mainAdResolver } from '../../core/resolvers/main-ad.resolver';
import { adResolver } from '../../core/resolvers/main/ad.resolver';
import { productDetailsResolver } from '../../core/resolvers/product-details.resolver';
import { productShopListResolver } from '../../core/resolvers/product-shop-list.resolver';
import { purchaseListsResolver } from '../../core/resolvers/purchase-lists.resolver';

export const mainRoutes: Routes = [
  {
    path: ClientRoute.main,
    loadComponent: () => import('./main-content/main-content.component').then(x => x.MainContentComponent),
    resolve: {
      data: mainAdResolver,
    },
  },
  {
    path: `${ClientRoute.ad}/:id`,
    loadComponent: () => import('./ad/ad.component').then(x => x.AdComponent),
    resolve: {
      data: adResolver,
    },
  },
  {
    path: ClientRoute.basket,
    loadComponent: () => import('./basket/basket.component').then(x => x.BasketComponent),
    resolve: {
      data: basketResolver,
    },
  },
  {
    path: ClientRoute.order,
    loadComponent: () => import('./order/order.component').then(x => x.OrderComponent),
  },
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
  {
    path: ClientRoute.purchaseLists,
    loadComponent: () => import('./purchase-lists/purchase-lists.component').then(x => x.PurchaseListsComponent),
    resolve: {
      data: purchaseListsResolver,
    },
  },
];
