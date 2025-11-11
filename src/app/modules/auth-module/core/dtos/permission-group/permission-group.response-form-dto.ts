import { PermissionGroupRequestFormDto } from './permission-group.request-form-dto';

export interface PermissionGroupResponseFormDto extends PermissionGroupRequestFormDto {
  id: string;
}
