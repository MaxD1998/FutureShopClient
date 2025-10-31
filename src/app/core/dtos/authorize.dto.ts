import { AuthorizationPermission } from '../enums/authorization-permission';
import { ProductPermission } from '../enums/product-permission';
import { ShopPermission } from '../enums/shop-permission';
import { UserType } from '../enums/user-type';
import { WarehousePermission } from '../enums/warehouse-permission';

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
