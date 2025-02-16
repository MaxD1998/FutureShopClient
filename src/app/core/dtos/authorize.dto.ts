import { UserType } from '../enums/user-type';
import { UserModuleDto } from './user-module.dto';

export interface AuthorizeDto {
  id: string;
  modules: UserModuleDto[];
  roles: UserType[];
  token: string;
  username: string;
}
