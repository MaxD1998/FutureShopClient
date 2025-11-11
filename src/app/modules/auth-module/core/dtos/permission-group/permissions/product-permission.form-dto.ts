import { ProductPermission } from '../../../../../../core/enums/permissions/product-permission';
import { BasePermissionFormDto } from '../../../bases/base-permission.form-dto';

export interface ProductPermissionFormDto extends BasePermissionFormDto<ProductPermission> {
  id?: string;
}
