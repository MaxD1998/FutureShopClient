import { Routes } from '@angular/router';
import { ClientRoute } from '../../../core/constants/client-routes/client.route';
import { categoryFormResolver } from '../../../core/resolvers/category-form.resolver';
import { categoryListResolver } from '../../../core/resolvers/category-list.resolver';

export const categoryRoutes: Routes = [
  {
    path: `${ClientRoute.details}/:id`,
    loadComponent: () => import('./category-details/category-details.component').then(x => x.CategoryDetailsComponent),
  },
  {
    path: `${ClientRoute.form}`,
    loadComponent: () => import('./category-form/category-form.component').then(x => x.CategoryFormComponent),
    resolve: {
      form: categoryFormResolver,
    },
  },
  {
    path: `${ClientRoute.form}/:id`,
    loadComponent: () => import('./category-form/category-form.component').then(x => x.CategoryFormComponent),
    resolve: {
      form: categoryFormResolver,
    },
  },
  {
    path: ClientRoute.list,
    loadComponent: () => import('./category-list/category-list.component').then(x => x.CategoryListComponent),
    runGuardsAndResolvers: 'always',
    resolve: {
      categories: categoryListResolver,
    },
  },
];
