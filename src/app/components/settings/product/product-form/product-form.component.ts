import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, switchMap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BaseFormComponent } from '../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../core/constants/client-routes/client.route';
import { ProductParameterDataService } from '../../../../core/data-services/product-parameter.data-service';
import { ProductPhotoDataService } from '../../../../core/data-services/product-photo.data-service';
import { ProductDataService } from '../../../../core/data-services/product.data-service';
import { ProductParameterValueFormDto } from '../../../../core/dtos/product-parameter-value.form-dto';
import { ProductPhotoFormDto } from '../../../../core/dtos/product-photo.form-dto';
import { ProductFormDto } from '../../../../core/dtos/product.form-dto';
import { ButtonLayout } from '../../../../core/enums/button-layout';
import { DataTableColumnModel } from '../../../../core/models/data-table-column.model';
import { ProductPhotoModel } from '../../../../core/models/product-photo.model';
import { SelectItemModel } from '../../../../core/models/select-item.model';
import { TempIdGenerator } from '../../../../core/utils/temp-id-generator';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputNumberComponent } from '../../../shared/input-number/input-number.component';
import { InputSelectComponent } from '../../../shared/input-select/input-select.component';
import { InputComponent } from '../../../shared/input/input.component';
import { DialogWindowComponent } from '../../../shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../shared/table/table.component';
import { PreviewProductPhotoComponent } from './preview-product-photo/preview-product-photo.component';
import { SetProductBaseFormComponent } from './set-product-base-form/set-product-base-form.component';
import { SetProductParameterValueComponent } from './set-product-parameter-value/set-product-parameter-value.component';
import { SetProductPhotoComponent } from './set-product-photo/set-product-photo.component';
import { DialogType, ProductFormUtils } from './utils/product-form.utils';

@Component({
  selector: 'app-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent,
    InputComponent,
    InputNumberComponent,
    InputSelectComponent,
    DialogWindowComponent,
    SetProductBaseFormComponent,
    TableComponent,
    SetProductParameterValueComponent,
    SetProductPhotoComponent,
    PreviewProductPhotoComponent,
  ],
})
export class ProductFormComponent extends BaseFormComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _location = inject(Location);
  private readonly _productDataService = inject(ProductDataService);
  private readonly _productParamterDataService = inject(ProductParameterDataService);
  private readonly _productPhotoDataService = inject(ProductPhotoDataService);
  private readonly _router = inject(Router);
  private readonly _tempIdGenerator = new TempIdGenerator();

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  DialogType: typeof DialogType = DialogType;

  id?: string;

  dialogType = signal<DialogType>(DialogType.productBase);
  header = signal<string>('');
  isDialogActive = signal<boolean>(true);
  fileId = signal<string>('');
  productBaseItems = signal<SelectItemModel[]>([]);
  productParameter = signal<{ productParameterId: string; value?: string } | undefined>(undefined);
  productParameters = signal<{ id: string; name: string; value?: string }[]>([]);
  productPhotos = signal<ProductPhotoModel[]>([]);
  translations = signal<FormArray>(this.form.controls['translations'] as FormArray);

  dialogHeader = computed(() => ProductFormUtils.getDialogHeader(this.dialogType()));

  productParameterColumns: DataTableColumnModel[] = ProductFormUtils.getProductParameterColumns();
  productPhotoColumns: DataTableColumnModel[] = ProductFormUtils.getProductPhotoColumns();

  constructor() {
    super();
    this.setLangs();
    this.id = this._activatedRoute.snapshot.params['id'];
    this.isDialogActive.set(!this.id);
    this.header.set(this.id ? 'product-form-component.edit-product' : 'product-form-component.create-product');
    const form = this._activatedRoute.snapshot.data['form'];

    if (!form.product && !form.productBases) {
      this.dialogClose();
    }

    if (form.productBases) {
      this.productBaseItems.set(form.productBases);
    }

    if (form.productParameters) {
      this.productParameters.set(form.productParameters);
    }

    if (form.files) {
      this.productPhotos.set(form.files);
    }

    this.fillForm(form.product);
  }

  dialogClose(): void {
    if (this.dialogType() == DialogType.productBase) {
      this._location.back();
    } else if (this.dialogType() == DialogType.productParameterValue) {
      this.productParameter.set(undefined);
      this.isDialogActive.set(false);
    } else {
      if (this.fileId() != '') {
        this.fileId.set('');
      }

      this.isDialogActive.set(false);
    }
  }

  openSetParameterValueDialog(id: string): void {
    if (this.dialogType() != DialogType.productParameterValue) {
      this.dialogType.set(DialogType.productParameterValue);
    }

    const productParameter = this.productParameters().find(x => x.id == id);

    if (productParameter) {
      this.productParameter.set({
        productParameterId: productParameter.id,
        value: productParameter.value,
      });

      this.isDialogActive.set(true);
    }
  }

  openSetPhotoDialog(): void {
    if (this.dialogType() != DialogType.productPhoto) {
      this.dialogType.set(DialogType.productPhoto);
    }

    this.isDialogActive.set(true);
  }

  previewPhoto(id: string): void {
    if (this.dialogType() != DialogType.previewProductPhoto) {
      this.dialogType.set(DialogType.previewProductPhoto);
    }

    this.fileId.set(id);
    this.isDialogActive.set(true);
  }

  removeParameterValue(id: string): void {
    const productParameter = this.productParameters().find(x => x.id == id);
    const array = this.form.controls['productParameterValues'] as FormArray;
    const arrayValues = array.value as { productParameterId: string; value?: string }[];
    const index = arrayValues.findIndex(x => x.productParameterId == id);

    if (productParameter) {
      productParameter.value = undefined;
    }

    if (index > -1) {
      array.removeAt(index);
    }
  }

  removeProductPhoto(id: string) {
    this.productPhotos.set(this.productPhotos().filter(x => x.id != id));
    const array = this.form.controls['productPhotos'] as FormArray;
    const arrayValues = array.value as ProductPhotoFormDto[];
    const index = arrayValues.findIndex(x => x.fileId == id);

    if (index > -1) {
      array.removeAt(index);
    }
  }

  setProductBase(value: SelectItemModel): void {
    if (!value.id) {
      this.dialogClose();
      return;
    }

    this._productParamterDataService.getsByProductBaseId(value.id).subscribe({
      next: response => {
        this.productParameters.set(
          response.map(x => {
            return {
              id: x.id,
              name: x.name,
            };
          }),
        );
        this.form.controls['productBaseId'].setValue(value.id);
        this.isDialogActive.set(false);
      },
    });
  }

  setProductParameterValue(parameterValue: ProductParameterValueFormDto): void {
    const array = this.form.controls['productParameterValues'] as FormArray;
    const arrayValues = array.value as { productParameterId: string; value?: string }[];
    const value = arrayValues.find(x => x.productParameterId == parameterValue.productParameterId);

    if (value) {
      value.value = parameterValue.value;
    } else {
      array.push(new FormControl(parameterValue));
    }

    const productParameters = this.productParameters();
    const productParameter = productParameters.find(x => x.id == parameterValue.productParameterId);
    if (productParameter) {
      productParameter.value = parameterValue.value;
      this.productParameters.set(productParameters.slice());
    }

    this.isDialogActive.set(false);
    this.productParameter.set(undefined);
  }

  setProductPhoto(file: File): void {
    this.productPhotos().push({
      id: this._tempIdGenerator.assingId(),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.type,
      file: file,
    });

    this.productPhotos.set(Array.from(this.productPhotos()));
    this.isDialogActive.set(false);
  }

  submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const files = this.productPhotos()
      .filter(x => x.id.includes('temp') && x.file)
      .map(x => x.file) as Blob[];

    const result$ =
      files.length > 0
        ? this._productPhotoDataService.addList(files).pipe(
            switchMap(response => {
              return this.addOrUpdateProduct$(response);
            }),
          )
        : this.addOrUpdateProduct$();

    result$.subscribe({
      next: () => {
        this._router.navigateByUrl(`${ClientRoute.settings}/${ClientRoute.product}/${ClientRoute.list}`);
      },
    });
  }

  private addOrUpdateProduct$(fileIds?: string[]): Observable<ProductFormDto> {
    this.updateFormProductPhoto(fileIds);

    const value = this.form.value as ProductFormDto;

    value.translations = value.translations.filter(x => x.translation);

    return !this.id ? this._productDataService.add(value) : this._productDataService.update(this.id, value);
  }

  private fillForm(product?: ProductFormDto): void {
    if (!product) {
      return;
    }

    const form = this.form.controls;
    form['name'].setValue(product.name);
    form['price'].setValue(product.price);
    form['productBaseId'].setValue(product.productBaseId);

    this.productParameters.update(x => {
      product.productParameterValues.forEach(y => {
        const productParameter = x.find(z => z.id == y.productParameterId);
        if (productParameter) {
          (form['productParameterValues'] as FormArray).push(
            new FormControl({
              id: y.id,
              productParameterId: y.productParameterId,
              value: y.value,
            }),
          );
          productParameter.value = y.value;
        }
      });

      return x;
    });

    product.productPhotos.forEach(x => {
      (form['productPhotos'] as FormArray).push(new FormControl(x));
    });

    this.translations.update(x => {
      (x.controls as FormGroup[]).forEach(y => {
        const transaltion = product.translations.find(z => z.lang == y.controls['lang'].value);
        if (transaltion) {
          y.controls['id'].setValue(transaltion.id);
          y.controls['translation'].setValue(transaltion.translation);
        }
      });

      return x;
    });
  }

  private setLangs(): void {
    environment.availableLangs.forEach(x => {
      this.translations.update(y => {
        y.push(
          this._formBuilder.group({
            id: [null],
            lang: [x, [Validators.required]],
            translation: [null],
          }),
        );
        return y;
      });
    });
  }

  private updateFormProductPhoto(fileIds?: string[]): void {
    if (fileIds && fileIds.length > 0) {
      const files = this.productPhotos().filter(x => x.id.includes('temp') && x.file);

      if (fileIds.length == files.length) {
        fileIds.forEach((x, index) => {
          files[index].id = x;
        });
      }
    }

    if (this.productPhotos().length > 0) {
      const form = this.form.controls;
      const productPhotos = form['productPhotos'] as FormArray;
      const productPhotoValues = productPhotos.controls as FormControl[];

      this.productPhotos().forEach(x => {
        if (!productPhotoValues.some(y => y.value['fileId'] == x.id)) {
          productPhotos.push(
            new FormControl({
              id: null,
              fileId: x.id,
            }),
          );
        }
      });
    }
  }

  protected override setFormControls(): {} {
    return {
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      productBaseId: [null, [Validators.required]],
      productParameterValues: new FormArray([]),
      productPhotos: new FormArray([]),
      translations: new FormArray([]),
    };
  }
}
