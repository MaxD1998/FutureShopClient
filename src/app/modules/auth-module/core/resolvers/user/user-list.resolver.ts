import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PageDto } from '../../../../../core/dtos/page.dto';
import { UserDataService } from '../../data-service/user.data-service';
import { UserListDto } from '../../dtos/user/user.list-dto';

export const userListResolver: ResolveFn<PageDto<UserListDto>> = (route, state) => {
  const userDataService = inject(UserDataService);
  const pageNumber: number = route.params['pageNumber'] ?? 1;

  return userDataService.getPage(pageNumber);
};
