import { AuthorizationPermissionFormDto } from './permissions/authorization-permission.form-dto';
import { ProductPermissionFormDto } from './permissions/product-permission.form-dto';
import { ShopPermissionFormDto } from './permissions/shop-permission.form-dto';
import { WarehousePermissionFormDto } from './permissions/warehouse-permission.form-dto';

export interface PermissionGroupRequestFormDto {
  authorizationPermissions: AuthorizationPermissionFormDto[];
  name: string;
  productPermissions: ProductPermissionFormDto[];
  shopPermissions: ShopPermissionFormDto[];
  warehousePermissions: WarehousePermissionFormDto[];
}
