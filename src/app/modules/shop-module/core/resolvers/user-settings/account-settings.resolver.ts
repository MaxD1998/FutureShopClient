import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserDataService } from '../../../../auth-module/core/data-service/user.data-service';
import { UserBasicInfoFormDto } from '../../../../auth-module/core/dtos/user/user-basic-info.form-dto';

export const accountSettingsResolver: ResolveFn<UserBasicInfoFormDto> = (route, state) => {
  return inject(UserDataService).getOwnBasicInfo();
};
