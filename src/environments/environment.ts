import { CompanyIdentifierNumberType } from '../app/modules/shop-module/core/enums/company-identifier-number-type';

export const environment = {
  production: true,
  api: 'https://localhost:6021/',
  defaultLang: 'en',
  availableLangs: ['en', 'pl'],
  defaultCompanyIdentifier: CompanyIdentifierNumberType.NIP_PL,
  availableCompanyIdentifier: [CompanyIdentifierNumberType.NIP_PL],
};
