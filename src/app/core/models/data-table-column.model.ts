import { TableHeaderFloat } from '../enums/table-header-float';
import { TableTemplate } from '../enums/table-template';

export interface DataTableColumnModel {
  field: string;
  headerFloat?: TableHeaderFloat;
  headerText: string;
  template?: TableTemplate;
}
