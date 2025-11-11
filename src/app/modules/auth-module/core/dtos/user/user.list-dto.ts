import { UserType } from '../../../../../core/enums/user-type';

export interface UserListDto {
  id: string;
  firstName: string;
  lastName: string;
  type: UserType;
  userPermissionGroupCount: number;
}
