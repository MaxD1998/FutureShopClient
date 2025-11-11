import { AuthorizationPermission } from '../../../../core/enums/permissions/authorization-permission';
import { ProductPermission } from '../../../../core/enums/permissions/product-permission';
import { ShopPermission } from '../../../../core/enums/permissions/shop-permission';
import { WarehousePermission } from '../../../../core/enums/permissions/warehouse-permission';

export interface PermissionListModel {
  name: string;
  permissions: {
    key: string;
    value: boolean;
    permission: AuthorizationPermission | ProductPermission | ShopPermission | WarehousePermission;
  }[];
}
