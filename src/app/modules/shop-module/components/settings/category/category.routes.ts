import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { categoryFormResolver } from '../../../core/resolvers/category-form.resolver';
import { categoryListResolver } from '../../../core/resolvers/category-list.resolver';
export const categoryRoutes: Routes = [
  {
    path: '',
    redirectTo: ClientRoute.list,
    pathMatch: 'full',
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
    children: [
      {
        path: '',
        loadComponent: () => import('./category-list/category-list.component').then(x => x.CategoryListComponent),
        resolve: {
          pageCategories: categoryListResolver,
        },
      },
      {
        path: ':pageNumber',
        loadComponent: () => import('./category-list/category-list.component').then(x => x.CategoryListComponent),
        resolve: {
          pageCategories: categoryListResolver,
        },
      },
    ],
    runGuardsAndResolvers: 'always',
  },
];
