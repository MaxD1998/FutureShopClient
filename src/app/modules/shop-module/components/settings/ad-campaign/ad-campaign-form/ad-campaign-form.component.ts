import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, switchMap } from 'rxjs';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputDateComponent } from '../../../../../../components/shared/input-date/input-date.component';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { DialogWindowComponent } from '../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { ToggleComponent } from '../../../../../../components/shared/toggle/toggle.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { TableHeaderFloat } from '../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { TempIdGenerator } from '../../../../../../core/utils/temp-id-generator';
import { AdCampaignItemDataService } from '../../../../core/data-services/ad-campaign-item.data-service';
import { AdCampaignDataService } from '../../../../core/data-services/ad-campaign.data-service';
import { AdCampaignItemInfoDto } from '../../../../core/dtos/ad-campaign-item.info-dto';
import { AdCampaignFormDto } from '../../../../core/dtos/ad-campaign.form-dto';
import { SetAdCampaignItemComponent } from './set-ad-campaign-item/set-ad-campaign-item.component';

@Component({
  selector: 'app-ad-campaign-form',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent,
    InputComponent,
    ToggleComponent,
    InputDateComponent,
    TableComponent,
    DialogWindowComponent,
    SetAdCampaignItemComponent,
  ],
  templateUrl: './ad-campaign-form.component.html',
  styleUrl: './ad-campaign-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdCampaignFormComponent extends BaseFormComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _adCampaignDataService = inject(AdCampaignDataService);
  private readonly _adCampaignItemDataService = inject(AdCampaignItemDataService);
  private readonly _router = inject(Router);
  private readonly _tempIdGenerator = new TempIdGenerator();

  DialogType: typeof DialogType = DialogType;

  adCampaign?: AdCampaignFormDto = this._activatedRoute.snapshot.data['form']['adCampaign'];
  adCampaignItems = signal<AdCampaignItemInfoDto[]>(this._activatedRoute.snapshot.data['form']['files']);
  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.ad-campaign-form-component.table-columns.name',
      template: TableTemplate.text,
    },
    {
      field: 'lang',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.ad-campaign-form-component.table-columns.language',
      template: TableTemplate.text,
    },
    {
      field: 'type',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.ad-campaign-form-component.table-columns.type',
      template: TableTemplate.text,
    },
    {
      field: 'size',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.ad-campaign-form-component.table-columns.size',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];
  header = this.id
    ? 'shop-module.ad-campaign-form-component.edit-ad-campaign'
    : 'shop-module.ad-campaign-form-component.create-ad-campaign';
  id?: string = this._activatedRoute.snapshot.params['id'];

  dialogType = signal<DialogType>(DialogType.adCampaignItem);
  fileId = signal<string>('');
  isDialogActive = signal<boolean>(false);

  constructor() {
    super();

    if (this.adCampaign) {
      const { end, isActive, name, start } = this.adCampaign;
      this.form.patchValue({ end, isActive, name, start });

      console.log(this.form.controls);

      this.form.controls['adCampaignItems'] = new FormArray(
        this.adCampaign.adCampaignItems.map(x => new FormControl(x)),
      );
    }
  }

  dialogClose(): void {
    if (this.fileId() != '') {
      this.fileId.set('');
    }

    this.isDialogActive.set(false);
  }

  openSetPhotoDialog(): void {
    if (this.dialogType() != DialogType.adCampaignItem) {
      this.dialogType.set(DialogType.adCampaignItem);
    }

    this.isDialogActive.set(true);
  }

  setAdCampaignItem(dto: { lang: string; file: File }): void {
    this.adCampaignItems().push({
      id: this._tempIdGenerator.assingId(),
      lang: dto.lang,
      name: dto.file.name,
      size: `${(dto.file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: dto.file.type,
      file: dto.file,
    });

    this.adCampaignItems.set(Array.from(this.adCampaignItems()));
    this.isDialogActive.set(false);
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const filesToAdd = this.adCampaignItems().filter(x => x.id.includes('temp') && x.file);

    const result$ =
      filesToAdd.length > 0
        ? this._adCampaignItemDataService.addList(filesToAdd.map(x => x.file as Blob)).pipe(
            switchMap(fileIds => {
              fileIds.forEach((flieId, index) => {
                const file = filesToAdd[index];
                file.id = flieId;
              });

              return this.addOrUpdate$();
            }),
          )
        : this.addOrUpdate$();

    result$.subscribe({
      next: () => {
        this._router.navigateByUrl(
          `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.adCampaign}/${ClientRoute.list}`,
        );
      },
    });
  }

  removeAdCampaignItem(id: string): void {
    this.adCampaignItems.set(this.adCampaignItems().filter(x => x.id != id));
  }

  protected override setFormControls(): {} {
    return {
      adCampaignItems: new FormArray([]),
      end: [null, [Validators.required]],
      isActive: [false],
      name: [null, [Validators.required]],
      start: [null, [Validators.required]],
    };
  }

  private addOrUpdate$(): Observable<AdCampaignFormDto> {
    const value = this.form.value as AdCampaignFormDto;
    this.adCampaignItems()
      .filter(x => x.file)
      .forEach(x => {
        if (!value.adCampaignItems.some(item => item.fileId === x.id)) {
          value.adCampaignItems.push({
            fileId: x.id,
            lang: x.lang,
          });
        }
      });
    return this.id ? this._adCampaignDataService.update(this.id, value) : this._adCampaignDataService.add(value);
  }
}

export enum DialogType {
  previewAdCampaignItem,
  adCampaignItem,
}
