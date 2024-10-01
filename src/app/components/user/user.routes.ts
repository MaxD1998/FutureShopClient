import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';

export const userRoutes: Routes = [
  {
    path: ClientRoute.purchaseList,
    loadComponent: () => import('./purchase-lists/purchase-lists.component').then(x => x.PurchaseListsComponent),
  },
];
