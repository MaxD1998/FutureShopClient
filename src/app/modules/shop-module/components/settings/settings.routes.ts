import { Routes } from '@angular/router';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { ShopPermission } from '../../../../core/enums/permissions/shop-permission';
import { shopPermissionGuard } from '../../core/guards/shop-permission.guard';

export const settingsRoutes: Routes = [
  {
    path: ClientRoute.adCampaign,
    loadChildren: () => import('./ad-campaign/ad-campaign.routes').then(x => x.adCampaignRoutes),
    canMatch: [shopPermissionGuard(ShopPermission.AdCamaignRead)],
  },
  {
    path: ClientRoute.category,
    loadChildren: () => import('./category/category.routes').then(x => x.categoryRoutes),
    canMatch: [shopPermissionGuard(ShopPermission.CategoryRead)],
  },
  {
    path: ClientRoute.product,
    loadChildren: () => import('./product/product.routes').then(x => x.productRoutes),
    canMatch: [shopPermissionGuard(ShopPermission.ProductRead)],
  },
  {
    path: ClientRoute.productBase,
    loadChildren: () => import('./product-base/product-base.routes').then(x => x.productBaseRoutes),
    canMatch: [shopPermissionGuard(ShopPermission.ProductBaseRead)],
  },
  {
    path: ClientRoute.promotion,
    loadChildren: () => import('./promotion/promotion.routes').then(x => x.promotionRoutes),
    canMatch: [shopPermissionGuard(ShopPermission.PromotionRead)],
  },
];
