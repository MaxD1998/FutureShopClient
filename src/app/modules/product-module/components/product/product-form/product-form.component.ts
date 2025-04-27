import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, switchMap } from 'rxjs';
import { ButtonComponent } from '../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../components/shared/input-select/input-select.component';
import { InputComponent } from '../../../../../components/shared/input/input.component';
import { DialogWindowComponent } from '../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../components/shared/table/table.component';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { ButtonLayout } from '../../../../../core/enums/button-layout';
import { TableHeaderFloat } from '../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../core/models/data-table-column.model';
import { SelectItemModel } from '../../../../../core/models/select-item.model';
import { TempIdGenerator } from '../../../../../core/utils/temp-id-generator';
import { ProductPhotoDataService } from '../../../core/data-service/product-photo.data-service';
import { ProductDataService } from '../../../core/data-service/product.data-service';
import { ProductPhotoFormDto } from '../../../core/dtos/product-photo.form-dto';
import { ProductPhotoInfoDto } from '../../../core/dtos/product-photo.info-dto';
import { ProductFormDto } from '../../../core/dtos/product.form-dto';
import { PreviewProductPhotoComponent } from './preview-product-photo/preview-product-photo.component';
import { SetProductPhotoComponent } from './set-product-photo/set-product-photo.component';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    ButtonComponent,
    InputComponent,
    InputSelectComponent,
    DialogWindowComponent,
    TableComponent,
    SetProductPhotoComponent,
    PreviewProductPhotoComponent,
  ],
})
export class ProductFormComponent extends BaseFormComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productDataService = inject(ProductDataService);
  private readonly _productPhotoDataService = inject(ProductPhotoDataService);
  private readonly _router = inject(Router);
  private readonly _tempIdGenerator = new TempIdGenerator();

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  DialogType: typeof DialogType = DialogType;

  header = this.id
    ? 'product-module.product-form-component.edit-product'
    : 'product-module.product-form-component.create-product';

  id?: string = this._activatedRoute.snapshot.params['id'];
  product?: ProductFormDto = this._activatedRoute.snapshot.data['form']['product'];
  productBaseItems: SelectItemModel[] = this._activatedRoute.snapshot.data['form']['productBases'] ?? [];
  productPhotoColumns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'product-module.product-form-component.product-photo-table-columns.name',
      template: TableTemplate.text,
    },
    {
      field: 'type',
      headerFloat: TableHeaderFloat.left,
      headerText: 'product-module.product-form-component.product-photo-table-columns.type',
      template: TableTemplate.text,
    },
    {
      field: 'size',
      headerFloat: TableHeaderFloat.left,
      headerText: 'product-module.product-form-component.product-photo-table-columns.size',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  dialogType = signal<DialogType>(DialogType.productPhoto);
  isDialogActive = signal<boolean>(false);
  fileId = signal<string>('');
  productPhotos = signal<ProductPhotoInfoDto[]>(this._activatedRoute.snapshot.data['form']['files'] ?? []);

  constructor() {
    super();
    if (this.product) {
      const form = this.form.controls;
      form['name'].setValue(this.product.name);
      form['productBaseId'].setValue(this.product.productBaseId);

      this.product.productPhotos.forEach(x => {
        (form['productPhotos'] as FormArray).push(new FormControl(x));
      });
    }
  }

  dialogClose(): void {
    if (this.fileId() != '') {
      this.fileId.set('');
    }

    this.isDialogActive.set(false);
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

  removeProductPhoto(id: string) {
    this.productPhotos.set(this.productPhotos().filter(x => x.id != id));
    const array = this.form.controls['productPhotos'] as FormArray;
    const arrayValues = array.value as ProductPhotoFormDto[];
    const index = arrayValues.findIndex(x => x.fileId == id);

    if (index > -1) {
      array.removeAt(index);
    }
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
        this._router.navigateByUrl(`${ClientRoute.productModule}/${ClientRoute.product}/${ClientRoute.list}`);
      },
    });
  }

  private addOrUpdateProduct$(fileIds?: string[]): Observable<ProductFormDto> {
    this.updateFormProductPhoto(fileIds);

    const value = this.form.value as ProductFormDto;
    return !this.id ? this._productDataService.add(value) : this._productDataService.update(this.id, value);
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
      productBaseId: [null, [Validators.required]],
      productPhotos: new FormArray([]),
    };
  }
}

export enum DialogType {
  previewProductPhoto,
  productPhoto,
}
