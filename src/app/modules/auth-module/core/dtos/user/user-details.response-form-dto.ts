import { UserDetailsRequestFormDto } from './user-details.request-form-dto';

export interface UserDetailsResponseFormDto extends UserDetailsRequestFormDto {
  id: string;
}
