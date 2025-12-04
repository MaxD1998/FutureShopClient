import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { accountSettingsResolver } from '../../core/resolvers/user-settings/account-settings.resolver';
import { orderDataResolver } from '../../core/resolvers/user-settings/order-data.resolver';

export const userSettingsRoutes: Routes = [
  {
    path: ClientRoute.accountSettings,
    loadComponent: () => import('./account-settings/account-settings.component').then(x => x.AccountSettingsComponent),
    resolve: {
      userBasicInfo: accountSettingsResolver,
    },
  },
  {
    path: ClientRoute.orderData,
    loadComponent: () => import('./order-data/order-data.component').then(x => x.OrderDataComponent),
    resolve: {
      orderData: orderDataResolver,
    },
  },
];
