import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { FileDataService } from '../../../../../../core/data-services/file.data-service';
import { TableHeaderFloat } from '../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { TempIdGenerator } from '../../../../../../core/utils/temp-id-generator';
import { AdCampaignDataService } from '../../../../core/data-services/ad-campaign.data-service';
import { AdCampaignItemInfoDto } from '../../../../core/dtos/ad-campaign-item.info-dto';
import { AdCampaignFormDto } from '../../../../core/dtos/ad-campaign.form-dto';
import { SetAdCampaignItemComponent } from './set-ad-campaign-item/set-ad-campaign-item.component';

interface IAdCampaignForm {
  adCampaignItems: FormArray<FormControl<{ id?: string; lang: string; fileId: string }>>;
  end: FormControl<Date | null>;
  isActive: FormControl<boolean>;
  name: FormControl<string>;
  start: FormControl<Date | null>;
}

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
export class AdCampaignFormComponent extends BaseFormComponent<IAdCampaignForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _adCampaignDataService = inject(AdCampaignDataService);
  private readonly _fileDataService = inject(FileDataService);
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
      const { adCampaignItems, end, isActive, name, start } = this.adCampaign;
      this.form.patchValue({ adCampaignItems, end, isActive, name, start });
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

    const { adCampaignItems, end, isActive, name, start } = this.form.getRawValue();
    this.adCampaign = { adCampaignItems, end: end!, isActive, name, start: start! };

    const filesToAdd = this.adCampaignItems().filter(x => x.id.includes('temp') && x.file);
    const result$ =
      filesToAdd.length > 0
        ? this._fileDataService.addList(filesToAdd.map(x => x.file as Blob)).pipe(
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

  protected override setGroup(): FormGroup<IAdCampaignForm> {
    return this._formBuilder.group<IAdCampaignForm>({
      adCampaignItems: new FormArray<FormControl<{ id?: string; lang: string; fileId: string }>>([]),
      end: new FormControl(null, [Validators.required]),
      isActive: new FormControl(false, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
      start: new FormControl(null, [Validators.required]),
    });
  }

  private addOrUpdate$(): Observable<AdCampaignFormDto> {
    const adCampaign = this.adCampaign!;
    const adCampaignItems = this.adCampaignItems();

    adCampaign.adCampaignItems = adCampaign.adCampaignItems.filter(adCampaignItem =>
      adCampaignItems.map(x => x.id).includes(adCampaignItem.fileId),
    );

    adCampaign.adCampaignItems = adCampaignItems
      .filter(adCampaignItem => !adCampaign.adCampaignItems.map(x => x.fileId).includes(adCampaignItem.id))
      .map(x => ({ fileId: x.id, lang: x.lang }));

    return this.id
      ? this._adCampaignDataService.update(this.id, adCampaign)
      : this._adCampaignDataService.add(adCampaign);
  }
}

export enum DialogType {
  previewAdCampaignItem,
  adCampaignItem,
}
