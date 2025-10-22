import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputDateComponent } from '../../../../../../components/shared/input-date/input-date.component';
import { InputSelectComponent } from '../../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../../components/shared/input-select/models/select-item.model';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { DialogWindowComponent } from '../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { ToggleComponent } from '../../../../../../components/shared/toggle/toggle.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { TableHeaderFloat } from '../../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { CustomValidators } from '../../../../../../core/utils/custom-validators';
import { PromotionDataService } from '../../../../core/data-services/promotion.data-service';
import { PromotionProductFormDto } from '../../../../core/dtos/promotion/promotion-product.form-dto';
import { PromotionRequestFormDto } from '../../../../core/dtos/promotion/promotion.request-form-dto';
import { PromotionResponseFormDto } from '../../../../core/dtos/promotion/promotion.response-form-dto';
import { PromotionType } from '../../../../core/enums/promotion-type';
import { IPercentValueForm, PercentValueComponent } from './percent-value/percent-value.component';
import { SetPromotionProductComponent } from './set-promotion-product/set-promotion-product.component';

export interface IPromotionForm {
  adCampaignId: FormControl<string | null>;
  code: FormControl<string>;
  end: FormControl<Date | null>;
  isActive: FormControl<boolean>;
  name: FormControl<string>;
  promotionProducts: FormArray<FormControl<PromotionProductFormDto>>;
  start: FormControl<Date | null>;
  type: FormControl<string | null>;
  value: FormGroup<any>;
}

@Component({
  selector: 'app-promotion-form',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent,
    InputComponent,
    InputDateComponent,
    TableComponent,
    ToggleComponent,
    DialogWindowComponent,
    SetPromotionProductComponent,
    PercentValueComponent,
    InputSelectComponent,
  ],
  templateUrl: './promotion-form.component.html',
  styleUrl: './promotion-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionFormComponent extends BaseFormComponent<IPromotionForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _promotionDataService = inject(PromotionDataService);
  private readonly _router = inject(Router);

  PromotionType: typeof PromotionType = PromotionType;

  columns: DataTableColumnModel[] = [
    {
      field: 'productName',
      headerFloat: TableHeaderFloat.left,
      headerText: 'shop-module.promotion-form-component.table-columns.name',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  adCampaignItems: SelectItemModel[] = this._activatedRoute.snapshot.data['form']['adCampaigns'];
  header = this.id
    ? 'shop-module.promotion-form-component.edit-promotion'
    : 'shop-module.promotion-form-component.create-promotion';
  id?: string = this._activatedRoute.snapshot.params['id'];
  promotion?: PromotionResponseFormDto = this._activatedRoute.snapshot.data['form']['promotion'];
  promotionTypeItems: SelectItemModel[] = [
    {
      value: this._translateService.instant('common.input-select.select-option'),
    },
    {
      id: PromotionType.Percent.toString(),
      value: this._translateService.instant('shop-module.promotion-form-component.type-items.percent'),
    },
  ];

  isDialogActive = signal<boolean>(false);
  isInit = signal<boolean>(true);

  constructor() {
    super();

    if (this.promotion) {
      const { code, end, isActive, name, promotionProducts, start, type, value } = this.promotion;
      this.form.patchValue({
        code,
        end,
        isActive,
        name,
        start,
        type: type.toString(),
      });

      promotionProducts.forEach(x => {
        this.form.controls.promotionProducts.push(new FormControl(x, { nonNullable: true }));
      });

      if (PromotionType.Percent === this.promotion.type) {
        this.form.controls.value = this._formBuilder.group<IPercentValueForm>({
          percent: new FormControl(value['percent']),
        });
      }

      this.form.controls.promotionProducts.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
        this.form.controls.isActive.markAsTouched();
        this.form.controls.isActive.updateValueAndValidity();
      });
    }

    afterNextRender(() => {
      this.isInit.set(false);
    });
  }

  removeItem(productId: string): void {
    const index = this.form.getRawValue().promotionProducts.findIndex(x => x.productId === productId);

    if (index >= 0) {
      this.form.controls.promotionProducts.removeAt(index);
    }
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const { code, end, isActive, name, promotionProducts, start, type, value } = this.form.getRawValue();
    const dto: PromotionRequestFormDto = {
      code,
      end: end!,
      isActive,
      name,
      promotionProducts,
      start: start!,
      type: Number.parseInt(type!),
      value: value,
    };

    const request = !this.id ? this._promotionDataService.create(dto) : this._promotionDataService.update(this.id, dto);
    request.subscribe({
      next: () => {
        this._router.navigateByUrl(
          `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.promotion}/${ClientRoute.list}`,
        );
      },
    });
  }

  protected override setGroup(): FormGroup<IPromotionForm> {
    return this._formBuilder.group<IPromotionForm>({
      adCampaignId: new FormControl(null),
      code: new FormControl('', { nonNullable: true }),
      end: new FormControl(null, [Validators.required]),
      isActive: new FormControl(false, {
        nonNullable: true,
        validators: CustomValidators.arrayIsNotEmpty('promotionProducts'),
      }),
      name: new FormControl('', { nonNullable: true }),
      promotionProducts: new FormArray<FormControl<PromotionProductFormDto>>([]),
      start: new FormControl(null, [Validators.required]),
      type: new FormControl(null, [Validators.required]),
      value: new FormGroup({}),
    });
  }
}
