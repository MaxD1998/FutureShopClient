import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IconType } from '../../../core/enums/icon-type';
import { TableHeaderFloat } from '../../../core/enums/table-header-float';
import { TableTemplate } from '../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../core/models/data-table-column.model';
import { PaginationModel } from '../../../core/models/pagination.model';
import { IconComponent } from '../icon/icon.component';
import { TableActionFieldComponent } from './table-field-templates/table-action-field/table-action-field.component';
import { TableBooleanFieldComponent } from './table-field-templates/table-boolean-field/table-boolean-field.component';
import { TableTextFieldComponent } from './table-field-templates/table-text-field/table-text-field.component';
import { TablePaginationComponent } from './table-pagination/table-pagination.component';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrl: './table.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TableActionFieldComponent,
        TableBooleanFieldComponent,
        TableTextFieldComponent,
        TranslateModule,
        IconComponent,
        TablePaginationComponent,
    ]
})
export class TableComponent {
  columns = input.required<DataTableColumnModel[]>();
  idName = input.required<string>();
  items = input.required<any[]>();
  page = input<PaginationModel>();

  isDetailAction = input<boolean>(false);
  isEditAction = input<boolean>(false);
  isRemoveAction = input<boolean>(false);

  onDetailAction = output<string>();
  onEditAction = output<string>();
  onPageClick = output<number>();
  onRemoveAction = output<string>();

  TableTemplate: typeof TableTemplate = TableTemplate;
  IconType: typeof IconType = IconType;

  rowId: string = '';
  pageModel = computed<PaginationModel>(() => {
    return (
      this.page() ?? {
        currentPage: 1,
        totalPages: 1,
      }
    );
  });

  actionColumnWidth(): string {
    const array = [this.isDetailAction(), this.isEditAction(), this.isRemoveAction()];
    if (array.filter(x => x).length == 3) {
      return 'w-25';
    }

    if (array.filter(x => x).length == 2) {
      return 'w-18';
    }

    if (array.filter(x => x).length == 1) {
      return 'w-11';
    }

    return '';
  }

  headerFloat(float?: TableHeaderFloat): string {
    switch (float) {
      case TableHeaderFloat.left: {
        return 'justify-start';
      }
      case TableHeaderFloat.right: {
        return 'justify-end';
      }
      default: {
        return 'justify-center';
      }
    }
  }

  detailAction(id: string): void {
    this.onDetailAction.emit(id);
  }

  editAction(id: string): void {
    this.onEditAction.emit(id);
  }

  removeAction(id: string): void {
    this.onRemoveAction.emit(id);
  }
}
