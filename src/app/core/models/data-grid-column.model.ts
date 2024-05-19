import { GridTemplate } from '../enums/grid-template';

export interface DataGridColumnModel {
  field: string;
  headerText: string;
  template?: GridTemplate;
}
