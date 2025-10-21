import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, switchMap } from 'rxjs';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputDateComponent } from '../../../../../../components/shared/input-date/input-date.component';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../../components/shared/input-select/models/select-item.model';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { ToggleComponent } from '../../../../../../components/shared/toggle/toggle.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { FileDataService } from '../../../../../../core/data-services/file.data-service';
import { AdCampaignDataService } from '../../../../core/data-services/ad-campaign.data-service';
import { AdCampaignItemInfoDto } from '../../../../core/dtos/ad-campaign/ad-campaign-item.info-dto';
import { AdCampaignProductFormDto } from '../../../../core/dtos/ad-campaign/ad-campaign-product.form-dto';
import { AdCampaignRequestFormDto } from '../../../../core/dtos/ad-campaign/ad-campaign.request-form-dto';
import { AdCampaignType } from '../../../../core/enums/ad-campaign-type';
import { AdCampaignItemsTableComponent } from './ad-campaign-items-table/ad-campaign-items-table.component';
import { AdCampaignProductsTableComponent } from './ad-campaign-products-table/ad-campaign-products-table.component';
import { AdCampaignPromotionComponent } from './ad-campaign-promotion/ad-campaign-promotion.component';

export interface IAdCampaignForm {
  adCampaignItems: FormArray<FormControl<IAdCampaignItemForm>>;
  adCampaignProducts: FormArray<FormControl<AdCampaignProductFormDto>>;
  end: FormControl<Date | null>;
  isActive: FormControl<boolean>;
  name: FormControl<string>;
  promotionId: FormControl<string | null>;
  start: FormControl<Date | null>;
  type: FormControl<string | null>;
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
    AdCampaignPromotionComponent,
    AdCampaignProductsTableComponent,
  ],
  templateUrl: './ad-campaign-form.component.html',
  styleUrl: './ad-campaign-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdCampaignFormComponent extends BaseFormComponent<IAdCampaignForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _adCampaignDataService = inject(AdCampaignDataService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _fileDataService = inject(FileDataService);
  private readonly _router = inject(Router);

  AdCampaignType: typeof AdCampaignType = AdCampaignType;

  adCampaign?: AdCampaignRequestFormDto = this._activatedRoute.snapshot.data['form']['adCampaign'];
  adCampaignItems: AdCampaignItemInfoDto[] = this._activatedRoute.snapshot.data['form']['files'];
  header = this.id
    ? 'shop-module.ad-campaign-form-component.edit-ad-campaign'
    : 'shop-module.ad-campaign-form-component.create-ad-campaign';
  id?: string = this._activatedRoute.snapshot.params['id'];
  typeItems: SelectItemModel[] = [
    {
      value: this._translateService.instant('common.input-select.select-option'),
    },
    {
      id: AdCampaignType.Product.toString(),
      value: this._translateService.instant('shop-module.ad-campaign-form-component.types.product'),
    },
    {
      id: AdCampaignType.Promotion.toString(),
      value: this._translateService.instant('shop-module.ad-campaign-form-component.types.promotion'),
    },
  ];

  constructor() {
    super();

    if (this.adCampaign) {
      const { adCampaignItems, adCampaignProducts, end, isActive, name, promotionId, start, type } = this.adCampaign;
      this.form.patchValue({ end, isActive, name, promotionId, start, type: type.toString() });

      adCampaignItems.forEach(item => {
        const info = this.adCampaignItems.find(x => x.id == item.fileId)!;
        const formControl = new FormControl(
          {
            ...item,
            fileDetails: { ...info, originalLang: item.lang },
          },
          { nonNullable: true },
        );

        this.form.controls.adCampaignItems.push(formControl);
      });

      adCampaignProducts.forEach(product => {
        this.form.controls.adCampaignProducts.push(new FormControl(product, { nonNullable: true }));
      });

      this.form.controls.type.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
        next: value => {
          this.clearFormTypeDependencies();
        },
      });
    }
  }

  mapToAdCampaignType(value: string | null): AdCampaignType | undefined {
    if (!value) return undefined;

    const num = Number(value);
    if (!isNaN(num) && typeof (AdCampaignType as any)[num] === 'string') {
      return num as AdCampaignType;
    }

    return undefined;
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const { adCampaignItems, adCampaignProducts, end, isActive, name, start, type } = this.form.getRawValue();
    this.adCampaign = {
      adCampaignItems: [],
      adCampaignProducts: adCampaignProducts,
      end: end!,
      isActive,
      name,
      start: start!,
      type: this.mapToAdCampaignType(type)!,
    };

    const filesToAdd = adCampaignItems.filter(x => !x.id && x.fileDetails.file);
    const result$ =
      filesToAdd.length > 0
        ? this._fileDataService.addList(filesToAdd.map(x => x.fileDetails.file as Blob)).pipe(
            switchMap(fileIds => {
              fileIds.forEach((flieId, index) => {
                const file = filesToAdd[index];
                file.fileId = flieId;
              });

              this.adCampaign!.adCampaignItems.map(x => ({ id: x.id, lang: x.lang, fileId: x.fileId! }));

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

  protected override setGroup(): FormGroup<IAdCampaignForm> {
    return this._formBuilder.group<IAdCampaignForm>({
      adCampaignItems: new FormArray<FormControl<IAdCampaignItemForm>>([]),
      adCampaignProducts: new FormArray<FormControl<AdCampaignProductFormDto>>([]),
      end: new FormControl(null, [Validators.required]),
      isActive: new FormControl(false, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
      promotionId: new FormControl(null),
      start: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
    });
  }

  private addOrUpdate$(): Observable<AdCampaignRequestFormDto> {
    return this.id
      ? this._adCampaignDataService.update(this.id, this.adCampaign!)
      : this._adCampaignDataService.add(this.adCampaign!);
  }

  private clearFormTypeDependencies(): void {
    this.form.setControl('promotionId', new FormControl(null));
    this.form.setControl('adCampaignProducts', new FormArray<FormControl<AdCampaignProductFormDto>>([]));
  }
}
