import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PageDto } from '../../../../../core/dtos/page.dto';
import { PermissionGroupDataService } from '../../data-service/permission-group.data-service';
import { PermissionGroupListDto } from '../../dtos/permission-group/permission-group.list-dto';

export const permissionGroupListResolver: ResolveFn<PageDto<PermissionGroupListDto>> = (route, state) => {
  const permissionDataService = inject(PermissionGroupDataService);
  const pageNumber: number = route.params['pageNumber'] ?? 1;

  return permissionDataService.getPage(pageNumber);
};
