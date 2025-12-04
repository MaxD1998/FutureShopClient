import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { forkJoin } from 'rxjs';
import { UserCompanyDetailsDataService } from '../../data-services/user-company-details.data-service';
import { UserDeliveryAddressDataService } from '../../data-services/user-delivery-address.data-service';
import { UserCompanyDetailsResponseFormDto } from '../../dtos/user-company-details/user-company-details.response-form-dto';
import { UserDeliveryAddressResponseFormDto } from '../../dtos/user-delivery-address/user-delivery-address.response-form.dto';

export const orderDataResolver: ResolveFn<{
  userCompanyDetails: UserCompanyDetailsResponseFormDto[];
  userDeliveryAddresses: UserDeliveryAddressResponseFormDto[];
}> = (route, state) => {
  const userCompanyDetailsDataService = inject(UserCompanyDetailsDataService);
  const userDeliveryAddressDataService = inject(UserDeliveryAddressDataService);

  return forkJoin({
    userCompanyDetails: userCompanyDetailsDataService.getList(),
    userDeliveryAddresses: userDeliveryAddressDataService.getList(),
  });
};
