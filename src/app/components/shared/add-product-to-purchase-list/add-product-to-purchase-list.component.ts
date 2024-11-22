import { AsyncPipe } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { filter, Subject, takeUntil } from 'rxjs';
import { BaseFormComponent } from '../../../core/bases/base-form.component';
import { PurchaseListDto } from '../../../core/dtos/purchase-list.dto';
import { ButtonLayout } from '../../../core/enums/button-layout';
import { IconType } from '../../../core/enums/icon-type';
import { AuthService } from '../../../core/services/auth.service';
import { PurchaseListService } from '../../../core/services/purchase-list.service';
import { ButtonComponent } from '../button/button.component';
import { IconComponent } from '../icon/icon.component';
import { SmallPurchaseListFormComponent } from './small-purchase-list-form/small-purchase-list-form.component';

@Component({
  selector: 'app-add-product-to-purchase-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    IconComponent,
    ButtonComponent,
    SmallPurchaseListFormComponent,
    AsyncPipe,
  ],
  templateUrl: './add-product-to-purchase-list.component.html',
  styleUrl: './add-product-to-purchase-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductToPurchaseListComponent extends BaseFormComponent implements OnDestroy {
  private readonly _injector = inject(Injector);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  authService = inject(AuthService);
  purchaseListService = inject(PurchaseListService);

  isVisible = input.required<boolean>();
  productId = input.required<string>();

  purchaseLists = signal<PurchaseListDto[]>([]);
  purchaseListsForm = signal<FormArray>(this.form.controls['purchaseLists'] as FormArray);

  isInPurchaseListChange = output<boolean>();
  onClose = output<boolean>();

  isOpenAddForm = signal<boolean>(false);

  IconType: typeof IconType = IconType;
  ButtonLayout: typeof ButtonLayout = ButtonLayout;

  constructor() {
    super();
    toObservable(this.isVisible, { injector: this._injector }).subscribe({
      next: () => {
        this.isOpenAddForm.set(false);
        this.fillForm();
      },
    });

    afterNextRender(() => {
      this.purchaseListService.purchaseLists$
        .pipe(
          filter(x => x.length > 0),
          takeUntil(this._unsubscribe),
        )
        .subscribe({
          next: purchaseLists => {
            this.purchaseLists.set(purchaseLists);
            if (this.isVisible()) {
              this.fillForm();
            }
          },
        });
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  close(): void {
    this.onClose.emit(false);
  }

  submit(): void {
    const array = this.form.controls['purchaseLists'] as FormArray;
    const formValues = array.value as boolean[];
    const ids: string[] = [];

    formValues.forEach((x, i) => {
      const purchaseList = this.purchaseLists()[i];

      if (x) {
        ids.push(purchaseList.id);
      }
    });

    this.purchaseListService.addOrRemovePurchaseListItem(ids, this.productId(), () => {
      this.isInPurchaseListChange.emit(
        this.purchaseLists()
          .flatMap(x => x.purchaseListItems)
          .some(x => x.productId == this.productId()),
      );
    });
    this.close();
  }

  protected override setFormControls(): {} {
    return {
      purchaseLists: new FormArray([]),
    };
  }

  private fillForm(): void {
    this.form.setControl('purchaseLists', new FormArray([]));
    this.purchaseListsForm.set(this.form.controls['purchaseLists'] as FormArray);

    const array = this.form.controls['purchaseLists'] as FormArray;

    this.purchaseLists().forEach(purchaseList => {
      array.push(
        new FormControl(
          purchaseList.purchaseListItems.some(x => x.productId == this.productId()) ||
            (!this.purchaseLists()
              .flatMap(x => x.purchaseListItems)
              .some(x => x.productId == this.productId()) &&
              purchaseList.isFavourite),
        ),
      );
    });
  }
}
