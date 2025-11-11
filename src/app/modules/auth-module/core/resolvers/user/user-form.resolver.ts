import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { UserDataService } from '../../data-service/user.data-service';
import { UserResponseFormDto } from '../../dtos/user/user.response-form-dto';

export const userFormResolver: ResolveFn<UserResponseFormDto | undefined> = (route, state) => {
  const userDataService = inject(UserDataService);
  const id: string = route.params['id'];

  return id ? userDataService.getById(id) : of(undefined);
};
