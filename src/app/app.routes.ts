import { Routes } from '@angular/router';
import { ClientRoute } from './core/constants/client-routes/client.route';
import { authGuard } from './core/guards/auth.guard';
import { unauthGuard } from './core/guards/unauth.guard';
import { basketResolver } from './core/resolvers/basket.resolver';
import { mainResolver as mainCategoryListResolver } from './core/resolvers/main-category-list.resolver';

export const routes: Routes = [
  {
    path: ClientRoute.auth,
    loadChildren: () => import('./components/authorization/authorization.routes').then(x => x.authRoutes),
    canActivate: [unauthGuard],
  },
  {
    path: ClientRoute.basket,
    loadComponent: () => import('./components/basket/basket.component').then(x => x.BasketComponent),
    resolve: {
      data: basketResolver,
    },
  },
  {
    path: ClientRoute.main,
    loadComponent: () => import('./components/main/main.component').then(x => x.MainComponent),
    loadChildren: () => import('./components/main/main.routes').then(x => x.mainRoutes),
    resolve: {
      categories: mainCategoryListResolver,
    },
  },
  {
    path: ClientRoute.settings,
    loadComponent: () => import('./components/settings/settings.component').then(x => x.SettingsComponent),
    loadChildren: () => import('./components/settings/settings.routes').then(x => x.settingsRoutes),
    canActivate: [authGuard],
  },
  {
    path: ClientRoute.user,
    loadComponent: () => import('./components/user/user.component').then(x => x.UserComponent),
    loadChildren: () => import('./components/user/user.routes').then(x => x.userRoutes),
  },
];
