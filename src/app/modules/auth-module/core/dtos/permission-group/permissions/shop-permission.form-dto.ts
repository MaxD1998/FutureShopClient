import { ShopPermission } from '../../../../../../core/enums/permissions/shop-permission';
import { BasePermissionFormDto } from '../../../bases/base-permission.form-dto';

export interface ShopPermissionFormDto extends BasePermissionFormDto<ShopPermission> {
  id?: string;
}
