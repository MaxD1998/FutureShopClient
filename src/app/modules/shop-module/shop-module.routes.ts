import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { authEmployeeGuard } from '../../core/guards/auth-employee.guard';
import { mainCategoryListResolver } from './core/resolvers/main/main-category-list.resolver';
import { mainPromotionCodesResolver } from './core/resolvers/main/main-promotion-codes.resolver';

export const shopModuleRoutes: Routes = [
  {
    path: ClientRoute.main,
    loadComponent: () => import('./components/main/main.component').then(x => x.MainComponent),
    loadChildren: () => import('./components/main/main.routes').then(x => x.mainRoutes),
    resolve: {
      categories: mainCategoryListResolver,
      promotionCodes: mainPromotionCodesResolver,
    },
  },
  {
    path: `${ClientRoute.shopModule}/${ClientRoute.settings}`,
    loadComponent: () => import('./components/settings/settings.component').then(x => x.SettingsComponent),
    loadChildren: () => import('./components/settings/settings.routes').then(x => x.settingsRoutes),
    canMatch: [authEmployeeGuard],
  },
  {
    path: ClientRoute.userSettings,
    loadComponent: () =>
      import('./components/user-settings/user-settings.component').then(x => x.UserSettingsComponent),
    loadChildren: () => import('./components/user-settings/user-settings.routes').then(x => x.userSettingsRoutes),
    canMatch: [authEmployeeGuard],
  },
];
