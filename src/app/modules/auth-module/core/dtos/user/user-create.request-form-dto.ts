import { UserUpdateRequestFormDto } from './user-update.request-form-dto';

export interface UserCreateRequestFormDto extends UserUpdateRequestFormDto {
  password: string;
}
