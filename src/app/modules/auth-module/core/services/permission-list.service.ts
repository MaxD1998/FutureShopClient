import { Injectable } from '@angular/core';
import { AuthorizationPermission } from '../../../../core/enums/permissions/authorization-permission';
import { ProductPermission } from '../../../../core/enums/permissions/product-permission';
import { ShopPermission } from '../../../../core/enums/permissions/shop-permission';
import { PermissionKey } from '../enums/permission-key';
import { PermissionListModel } from '../models/permission-list.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionListService {
  listAuthorizationPermissions(): PermissionListModel[] {
    return [
      {
        name: 'common.permission-names.authorization.users',
        permissions: [
          { key: PermissionKey.read, value: false, permission: AuthorizationPermission.UserRead },
          { key: PermissionKey.addUpdate, value: false, permission: AuthorizationPermission.UserAddUpdate },
          { key: PermissionKey.delete, value: false, permission: AuthorizationPermission.UserDelete },
        ],
      },
      {
        name: 'common.permission-names.authorization.permission-groups',
        permissions: [
          { key: PermissionKey.read, value: false, permission: AuthorizationPermission.PermissionGroupRead },
          { key: PermissionKey.addUpdate, value: false, permission: AuthorizationPermission.PermissionGroupAddUpdate },
          { key: PermissionKey.delete, value: false, permission: AuthorizationPermission.PermissionGroupDelete },
        ],
      },
    ];
  }

  listProductPermissions(): PermissionListModel[] {
    return [
      {
        name: 'common.permission-names.product.categories',
        permissions: [
          { key: PermissionKey.read, value: false, permission: ProductPermission.CategoryRead },
          { key: PermissionKey.addUpdate, value: false, permission: ProductPermission.CategoryAddUpdate },
          { key: PermissionKey.delete, value: false, permission: ProductPermission.CategoryDelete },
        ],
      },
      {
        name: 'common.permission-names.product.product-bases',
        permissions: [
          { key: PermissionKey.read, value: false, permission: ProductPermission.ProductBaseRead },
          { key: PermissionKey.addUpdate, value: false, permission: ProductPermission.ProductBaseAddUpdate },
          { key: PermissionKey.delete, value: false, permission: ProductPermission.ProductBaseDelete },
        ],
      },
      {
        name: 'common.permission-names.product.products',
        permissions: [
          { key: PermissionKey.read, value: false, permission: ProductPermission.ProductRead },
          { key: PermissionKey.addUpdate, value: false, permission: ProductPermission.ProductAddUpdate },
          { key: PermissionKey.delete, value: false, permission: ProductPermission.ProductDelete },
        ],
      },
    ];
  }

  listShopPermissions(): PermissionListModel[] {
    return [
      {
        name: 'common.permission-names.shop.categories',
        permissions: [
          { key: PermissionKey.read, value: false, permission: ShopPermission.CategoryRead },
          { key: PermissionKey.addUpdate, value: false, permission: ShopPermission.CategoryAddUpdate },
        ],
      },
      {
        name: 'common.permission-names.shop.product-bases',
        permissions: [
          { key: PermissionKey.read, value: false, permission: ShopPermission.ProductBaseRead },
          { key: PermissionKey.addUpdate, value: false, permission: ShopPermission.ProductBaseAddUpdate },
        ],
      },
      {
        name: 'common.permission-names.shop.products',
        permissions: [
          { key: PermissionKey.read, value: false, permission: ShopPermission.ProductRead },
          { key: PermissionKey.addUpdate, value: false, permission: ShopPermission.ProductAddUpdate },
        ],
      },
      {
        name: 'common.permission-names.shop.ad-campaigns',
        permissions: [
          { key: PermissionKey.read, value: false, permission: ShopPermission.AdCamaignRead },
          { key: PermissionKey.addUpdate, value: false, permission: ShopPermission.AdCamaignAddUpdate },
          { key: PermissionKey.delete, value: false, permission: ShopPermission.AdCamaignDelete },
        ],
      },
      {
        name: 'common.permission-names.shop.promotions',
        permissions: [
          { key: PermissionKey.read, value: false, permission: ShopPermission.PromotionRead },
          { key: PermissionKey.addUpdate, value: false, permission: ShopPermission.PromotionAddUpdate },
          { key: PermissionKey.delete, value: false, permission: ShopPermission.PromotionDelete },
        ],
      },
    ];
  }

  listWarehousePermissions(): PermissionListModel[] {
    return [];
  }
}
