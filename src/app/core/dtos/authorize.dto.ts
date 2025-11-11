import { AuthorizationPermission } from '../enums/permissions/authorization-permission';
import { ProductPermission } from '../enums/permissions/product-permission';
import { ShopPermission } from '../enums/permissions/shop-permission';
import { WarehousePermission } from '../enums/permissions/warehouse-permission';
import { UserType } from '../enums/user-type';

export interface AuthorizeDto {
  id: string;
  roles: UserType[];
  token: string;
  username: string;
  authorizationPermissions: AuthorizationPermission[];
  productPermissions: ProductPermission[];
  shopPermissions: ShopPermission[];
  warehousePermissions: WarehousePermission[];
}
