import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { map, Subject, takeUntil } from 'rxjs';
import { BaseFormComponent } from '../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { ProductBaseDataService } from '../../../../core/data-services/product-base.data-service';
import { ProductBaseFormDto } from '../../../../core/dtos/product-base.form-dto';
import { ButtonLayout } from '../../../../core/enums/button-layout';
import { TableHeaderFloat } from '../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../core/models/data-table-column.model';
import { ProductBaseFormModel } from '../../../../core/models/product-base.form-model';
import { ProductParameterFormModel } from '../../../../core/models/product-parameter.form-model';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputSelectComponent } from '../../../shared/input-select/input-select.component';
import { InputComponent } from '../../../shared/input/input.component';
import { DialogWindowComponent } from '../../../shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../shared/table/table.component';
import { ProductPropertyFormComponent } from './product-property-form/product-property-form.component';

@Component({
    selector: 'app-product-base-form',
    templateUrl: './product-base-form.component.html',
    styleUrl: './product-base-form.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        TranslateModule,
        ReactiveFormsModule,
        ButtonComponent,
        InputComponent,
        InputSelectComponent,
        TableComponent,
        DialogWindowComponent,
        ProductPropertyFormComponent,
    ]
})
export class ProductBaseFormComponent extends BaseFormComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productBaseDataService = inject(ProductBaseDataService);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  private _productBase: ProductBaseFormModel;

  ButtonLayout: typeof ButtonLayout = ButtonLayout;

  id?: string = undefined;

  categoryItems = signal<SelectItemModel[]>([]);
  parameterToEdit = signal<ProductParameterFormModel | undefined>(undefined);
  header = signal<string>('');
  isDialogActive = signal<boolean>(false);
  isNewParameter = signal<boolean>(true);
  productParameters = signal<ProductParameterFormModel[]>([]);

  dialogTitle = computed<string>(() => {
    return this.isNewParameter()
      ? 'product-base-form-component.add-parameter'
      : 'product-base-form-component.edit-parameter';
  });

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'product-base-form-component.table-columns.name',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  constructor() {
    super();
    this.id = this._activatedRoute.snapshot.params['id'];
    this.header.set(
      this.id ? 'product-base-form-component.edit-product-base' : 'product-base-form-component.create-product-base',
    );
    const form = this._activatedRoute.snapshot.data['form'];
    this.categoryItems.set(form.categories);
    this.fillForm(form.productBase);
    this.setValueChangeEvent();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  closeDialog(): void {
    this.isDialogActive.set(false);
    this.parameterToEdit.set(undefined);
  }

  editParameter(id: string): void {
    this.isDialogActive.set(true);
    this.parameterToEdit.set(this.productParameters().find(x => x.index?.toString() == id));
  }

  openDialogWindow(event: Event): void {
    event.preventDefault();
    this.isDialogActive.set(true);
  }

  removeParamter(id: string): void {
    this.productParameters.set(Array.from(this.productParameters().filter(x => x.index?.toString() != id)));
  }

  submitProductParameter(value: ProductParameterFormModel): void {
    this.isDialogActive.set(false);
    if (!value) {
      return;
    }

    let productParameters = this.productParameters();
    const productParameter = this.parameterToEdit();
    if (productParameter) {
      productParameters[productParameter.index] = value;
    } else {
      productParameters = this.productParameters();
      value.index = productParameters.length + 1;
      productParameters.push(value);
    }

    this.productParameters.set(Array.from(productParameters));
    this.parameterToEdit.set(undefined);
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this._productBase.productParameters = this.productParameters();
    const result = this._productBase.mapToDto();

    const productBase$ = !this.id
      ? this._productBaseDataService.add(result)
      : this._productBaseDataService.update(this.id, result);

    productBase$.subscribe({
      next: () => {
        this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.productBase}/${ClientRoute.list}`);
      },
    });
  }

  private fillForm(productBase?: ProductBaseFormDto): void {
    if (!productBase) {
      this._productBase = new ProductBaseFormModel();
      return;
    }

    this._productBase = new ProductBaseFormModel(productBase);
    this.productParameters.set(this._productBase.productParameters);

    this.form.controls['name'].setValue(productBase.name);
    this.form.controls['categoryId'].setValue(productBase.categoryId);
  }

  private setValueChangeEvent(): void {
    this.form.controls['name'].valueChanges
      .pipe(
        takeUntil(this._unsubscribe),
        map(response => response as string),
      )
      .subscribe({
        next: response => {
          this._productBase.name = response;
        },
      });

    this.form.controls['categoryId'].valueChanges
      .pipe(
        takeUntil(this._unsubscribe),
        map(response => response as string),
      )
      .subscribe({
        next: response => {
          this._productBase.categoryId = response;
        },
      });
  }

  protected override setFormControls(): {} {
    return {
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
    };
  }
}
