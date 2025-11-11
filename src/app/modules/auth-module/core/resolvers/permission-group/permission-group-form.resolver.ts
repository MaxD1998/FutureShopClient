import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { PermissionGroupDataService } from '../../data-service/permission-group.data-service';
import { PermissionGroupResponseFormDto } from '../../dtos/permission-group/permission-group.response-form-dto';

export const permissionGroupFormResolver: ResolveFn<PermissionGroupResponseFormDto | undefined> = (route, state) => {
  const permissionDataService = inject(PermissionGroupDataService);
  const id: string = route.params['id'];

  return id ? permissionDataService.getById(id) : of(undefined);
};
