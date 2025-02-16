import { ModuleType } from '../enums/module-type';

export interface UserModuleDto {
  canDelete: boolean;
  canEdit: boolean;
  moduleType: ModuleType;
}
