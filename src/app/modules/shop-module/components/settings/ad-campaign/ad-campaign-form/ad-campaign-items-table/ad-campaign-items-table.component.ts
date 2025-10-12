import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DialogWindowComponent } from '../../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../../../components/shared/table/table.component';
import { TableHeaderFloat } from '../../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../../core/models/data-table-column.model';
import { AdCampaignItemInfoDto } from '../../../../../core/dtos/ad-campaign/ad-campaign-item.info-dto';
import { IAdCampaignForm } from '../ad-campaign-form.component';
import { SetAdCampaignItemComponent } from './set-ad-campaign-item/set-ad-campaign-item.component';

@Component({
  selector: 'app-ad-campaign-items-table',
  imports: [TableComponent, DialogWindowComponent, SetAdCampaignItemComponent],
  templateUrl: './ad-campaign-items-table.component.html',
  styleUrl: './ad-campaign-items-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdCampaignItemsTableComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly _translateService = inject(TranslateService);

  formGroup = input.required<FormGroup<IAdCampaignForm>>();

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.ad-campaign-items-table-component.table-columns.name',
      template: TableTemplate.text,
    },
    {
      field: 'lang',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.ad-campaign-items-table-component.table-columns.language',
      template: TableTemplate.text,
    },
    {
      field: 'type',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.ad-campaign-items-table-component.table-columns.type',
      template: TableTemplate.text,
    },
    {
      field: 'size',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.ad-campaign-items-table-component.table-columns.size',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  adCampaignItems = signal<AdCampaignItemInfoDto[]>([]);
  isDialogActive = signal<boolean>(false);

  constructor() {
    afterNextRender(() => {
      this.adCampaignItems.set(
        this.formGroup()
          .getRawValue()
          .adCampaignItems.map(x => x.fileDetails),
      );

      this.formGroup()
        .controls.adCampaignItems.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: values => {
            var items = values.map(x => x.fileDetails);
            this.adCampaignItems.set(Array.from(items));
          },
        });
    });
  }

  setAdCampaignItem(dto: { lang: string; file: File }): void {
    const item = {
      lang: dto.lang,
      fileDetails: {
        id: '',
        lang: this._translateService.instant(`common.languages.${dto.lang}`),
        originalLang: dto.lang,
        name: dto.file.name,
        size: `${(dto.file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: dto.file.type,
        file: dto.file,
      },
    };

    this.formGroup().controls.adCampaignItems.push(new FormControl(item, { nonNullable: true }));
    this.isDialogActive.set(false);
  }

  removeAdCampaignItem(lang: string): void {
    const index = this.formGroup()
      .getRawValue()
      .adCampaignItems.findIndex(x => x.lang === lang);
    if (index < 0) {
      return;
    }

    this.formGroup().controls.adCampaignItems.removeAt(index);
  }
}
