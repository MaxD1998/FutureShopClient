import { WarehousePermission } from '../../../../../../core/enums/permissions/warehouse-permission';
import { BasePermissionFormDto } from '../../../bases/base-permission.form-dto';

export interface WarehousePermissionFormDto extends BasePermissionFormDto<WarehousePermission> {
  id?: string;
}
