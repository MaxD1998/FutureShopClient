import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { adCampaignFormResolver } from '../../../core/resolvers/ad-campaign-form.resolver';
import { adCampaignListResolver } from '../../../core/resolvers/ad-campaign-list.resolver';
export const adCampaignRoutes: Routes = [
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
        loadComponent: () =>
          import('./ad-campaign-form/ad-campaign-form.component').then(x => x.AdCampaignFormComponent),
        resolve: {
          form: adCampaignFormResolver,
        },
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./ad-campaign-form/ad-campaign-form.component').then(x => x.AdCampaignFormComponent),
        resolve: {
          form: adCampaignFormResolver,
        },
      },
    ],
  },
  {
    path: ClientRoute.list,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./ad-campaign-list/ad-campaign-list.component').then(x => x.AdCampaignListComponent),
        resolve: {
          pageAdCampaigns: adCampaignListResolver,
        },
      },
      {
        path: ':pageNumber',
        loadComponent: () =>
          import('./ad-campaign-list/ad-campaign-list.component').then(x => x.AdCampaignListComponent),
        resolve: {
          pageAdCampaigns: adCampaignListResolver,
        },
      },
    ],
    runGuardsAndResolvers: 'always',
  },
];
