import { UserUpdateRequestFormDto } from './user-update.request-form-dto';

export interface UserResponseFormDto extends UserUpdateRequestFormDto {
  id: string;
}
