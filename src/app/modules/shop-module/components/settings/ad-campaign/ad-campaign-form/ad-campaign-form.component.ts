import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, switchMap } from 'rxjs';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputDateComponent } from '../../../../../../components/shared/input-date/input-date.component';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { ToggleComponent } from '../../../../../../components/shared/toggle/toggle.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { FileDataService } from '../../../../../../core/data-services/file.data-service';
import { AdCampaignDataService } from '../../../../core/data-services/ad-campaign.data-service';
import { AdCampaignItemInfoDto } from '../../../../core/dtos/ad-campaign/ad-campaign-item.info-dto';
import { AdCampaignRequestFormDto } from '../../../../core/dtos/ad-campaign/ad-campaign.request-form-dto';
import { AdCampaignItemsTableComponent } from './ad-campaign-items-table/ad-campaign-items-table.component';

export interface IAdCampaignForm {
  adCampaignItems: FormArray<FormControl<IAdCampaignItemForm>>;
  end: FormControl<Date | null>;
  isActive: FormControl<boolean>;
  name: FormControl<string>;
  start: FormControl<Date | null>;
}

interface IAdCampaignItemForm {
  id?: string;
  lang: string;
  fileId?: string;
  fileDetails: AdCampaignItemInfoDto & { originalLang: string };
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
    InputSelectComponent,
    AdCampaignItemsTableComponent,
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

  adCampaign?: AdCampaignRequestFormDto = this._activatedRoute.snapshot.data['form']['adCampaign'];
  adCampaignItems = signal<AdCampaignItemInfoDto[]>(this._activatedRoute.snapshot.data['form']['files']);
  header = this.id
    ? 'shop-module.ad-campaign-form-component.edit-ad-campaign'
    : 'shop-module.ad-campaign-form-component.create-ad-campaign';
  id?: string = this._activatedRoute.snapshot.params['id'];

  constructor() {
    super();

    if (this.adCampaign) {
      const { adCampaignItems, end, isActive, name, start } = this.adCampaign;
      this.form.patchValue({ end, isActive, name, start });

      adCampaignItems.forEach(item => {
        const info = this.adCampaignItems().find(x => x.id == item.fileId)!;
        const formControl = new FormControl(
          {
            ...item,
            fileDetails: { ...info, originalLang: item.lang },
          },
          { nonNullable: true },
        );

        this.form.controls.adCampaignItems.push(formControl);
      });
    }
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { adCampaignItems, end, isActive, name, start } = this.form.getRawValue();
    this.adCampaign = { adCampaignItems: [], end: end!, isActive, name, start: start! };

    const filesToAdd = adCampaignItems.filter(x => !x.id && x.fileDetails.file);
    const result$ =
      filesToAdd.length > 0
        ? this._fileDataService.addList(filesToAdd.map(x => x.fileDetails.file as Blob)).pipe(
            switchMap(fileIds => {
              fileIds.forEach((flieId, index) => {
                const file = filesToAdd[index];
                file.fileId = flieId;
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
      adCampaignItems: new FormArray<FormControl<IAdCampaignItemForm>>([]),
      end: new FormControl(null, [Validators.required]),
      isActive: new FormControl(false, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
      start: new FormControl(null, [Validators.required]),
    });
  }

  private addOrUpdate$(): Observable<AdCampaignRequestFormDto> {
    const { adCampaignItems, end, isActive, name, start } = this.form.getRawValue();
    this.adCampaign = {
      adCampaignItems: adCampaignItems.map(x => ({ id: x.id, lang: x.lang, fileId: x.fileId! })),
      end: end!,
      isActive,
      name,
      start: start!,
    };

    return this.id
      ? this._adCampaignDataService.update(this.id, this.adCampaign)
      : this._adCampaignDataService.add(this.adCampaign);
  }
}
