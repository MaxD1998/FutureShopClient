import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { InputSelectComponent } from '../../../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../../../components/shared/input-select/models/select-item.model';
import { BaseFormComponent } from '../../../../../../../core/bases/base-form.component';
import { PromotionDataService } from '../../../../../core/data-services/promotion.data-service';
import { IAdCampaignForm } from '../ad-campaign-form.component';

interface IAdCampaignPromotionForm {
  promotionId: FormControl<string | null>;
}

@Component({
  selector: 'app-ad-campaign-promotion',
  imports: [ReactiveFormsModule, TranslateModule, InputSelectComponent],
  templateUrl: './ad-campaign-promotion.component.html',
  styleUrl: './ad-campaign-promotion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdCampaignPromotionComponent extends BaseFormComponent<IAdCampaignPromotionForm> {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _promotionDataService = inject(PromotionDataService);

  formGroup = input.required<FormGroup<IAdCampaignForm>>();

  isLoaded = signal<boolean>(false);
  promotionItems = signal<SelectItemModel[]>([]);

  constructor() {
    super();

    this._promotionDataService
      .getListIdName()
      .pipe(
        finalize(() => {
          const { promotionId } = this.formGroup().getRawValue();
          this.form.patchValue({ promotionId });
          this.isLoaded.set(true);
        }),
      )
      .subscribe({
        next: values => {
          const selectOption = [{ value: this._translateService.instant('common.input-select.select-option') }];
          const results = selectOption.concat(values.map(x => ({ id: x.id, value: x.name })));
          this.promotionItems.set(results);
        },
      });

    afterNextRender(() => {
      const { promotionId } = this.form.getRawValue();
      this.form.patchValue({ promotionId });

      this.formGroup().setControl('promotionId', this.form.controls.promotionId);
    });
  }

  protected override setGroup(): FormGroup<IAdCampaignPromotionForm> {
    return this._formBuilder.group<IAdCampaignPromotionForm>({
      promotionId: new FormControl(null, [Validators.required]),
    });
  }
}
