import { CompanyIdentifierNumberType } from '../../enums/company-identifier-number-type';

export interface UserCompanyDetailsRequestFormDto {
  apartamentNumber: string;
  city: string;
  companyIdentifierNumber: string;
  companyName: string;
  houseNumber: string;
  isDefault: boolean;
  postalCode: string;
  street: string;
  type: CompanyIdentifierNumberType;
}
