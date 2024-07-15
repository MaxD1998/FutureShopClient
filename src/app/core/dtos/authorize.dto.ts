import { UserType } from '../enums/user-type';

export interface AuthorizeDto {
  id: string;
  roles: UserType[];
  token: string;
  username: string;
}
