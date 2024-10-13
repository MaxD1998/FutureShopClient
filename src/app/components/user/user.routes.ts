import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { purchaseListResolver as purchaseListsResolver } from '../../core/resolvers/purchase-lists.resolver';

export const userRoutes: Routes = [
  {
    path: ClientRoute.purchaseLists,
    loadComponent: () => import('./purchase-lists/purchase-lists.component').then(x => x.PurchaseListsComponent),
    resolve: {
      data: purchaseListsResolver,
    },
  },
];
