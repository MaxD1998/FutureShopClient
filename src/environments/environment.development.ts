import { CompanyIdentifierNumberType } from '../app/modules/shop-module/core/enums/company-identifier-number-type';

export const environment = {
  production: false,
  api: 'https://localhost:5001/',
  defaultLang: 'pl',
  availableLangs: ['en', 'pl'],
  defaultCompanyIdentifier: CompanyIdentifierNumberType.NIP_PL,
  availableCompanyIdentifier: [CompanyIdentifierNumberType.NIP_PL],
};
