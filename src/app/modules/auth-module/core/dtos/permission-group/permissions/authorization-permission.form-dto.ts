import { AuthorizationPermission } from '../../../../../../core/enums/permissions/authorization-permission';
import { BasePermissionFormDto } from '../../../bases/base-permission.form-dto';

export interface AuthorizationPermissionFormDto extends BasePermissionFormDto<AuthorizationPermission> {
  id?: string;
}
