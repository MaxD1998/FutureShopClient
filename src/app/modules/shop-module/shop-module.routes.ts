import { Routes } from '@angular/router';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { mainCategoryListResolver } from './core/resolvers/main-category-list.resolver';

export const shopModuleRoutes: Routes = [
  {
    path: ClientRoute.main,
    loadComponent: () => import('./components/main/main.component').then(x => x.MainComponent),
    loadChildren: () => import('./components/main/main.routes').then(x => x.mainRoutes),
    resolve: {
      categories: mainCategoryListResolver,
    },
  },
  {
    path: `${ClientRoute.shopModule}/${ClientRoute.settings}`,
    loadComponent: () => import('./components/settings/settings.component').then(x => x.SettingsComponent),
    loadChildren: () => import('./components/settings/settings.routes').then(x => x.settingsRoutes),
  },
];
