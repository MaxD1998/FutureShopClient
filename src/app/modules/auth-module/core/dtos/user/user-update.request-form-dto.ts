import { UserType } from '../../../../../core/enums/user-type';
import { UserPermissionGroupFromDto } from './user-permission-group.form-dto';

export interface UserUpdateRequestFormDto {
  dateOfBirth: Date;
  email: string;
  firstName: string;
  lastName: string;
  type: UserType;
  userPermissionGroups: UserPermissionGroupFromDto[];
}
