import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, switchMap } from 'rxjs';
import { ButtonComponent } from '../../../../../components/shared/button/button.component';
import { InputSelectComponent } from '../../../../../components/shared/input-select/input-select.component';
import { SelectItemModel } from '../../../../../components/shared/input-select/models/select-item.model';
import { InputComponent } from '../../../../../components/shared/input/input.component';
import { DialogWindowComponent } from '../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { TableComponent } from '../../../../../components/shared/table/table.component';
import { BaseFormComponent } from '../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { FileDataService } from '../../../../../core/data-service/file.data-service';
import { ButtonLayout } from '../../../../../core/enums/button-layout';
import { TableHeaderFloat } from '../../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../core/models/data-table-column.model';
import { TempIdGenerator } from '../../../../../core/utils/temp-id-generator';
import { ProductDataService } from '../../../core/data-service/product.data-service';
import { ProductPhotoInfoDto } from '../../../core/dtos/product/product-photo.info-dto';
import { ProductRequestFormDto } from '../../../core/dtos/product/product.request-form-dto';
import { PreviewProductPhotoComponent } from './preview-product-photo/preview-product-photo.component';
import { SetProductPhotoComponent } from './set-product-photo/set-product-photo.component';

interface IProductForm {
  name: FormControl<string>;
  productBaseId: FormControl<string>;
  productPhotos: FormArray<FormControl<{ id?: string; fileId: string }>>;
}

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
export class ProductFormComponent extends BaseFormComponent<IProductForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productDataService = inject(ProductDataService);
  private readonly _fileDataService = inject(FileDataService);
  private readonly _router = inject(Router);
  private readonly _tempIdGenerator = new TempIdGenerator();

  private readonly _snapshot = this._activatedRoute.snapshot;
  private readonly _resolverData = this._snapshot.data['form'];
  private readonly _id?: string = this._snapshot.params['id'];
  private _product?: ProductRequestFormDto = this._resolverData['product'];

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  DialogType: typeof DialogType = DialogType;

  header = this._id
    ? 'product-module.product-form-component.edit-product'
    : 'product-module.product-form-component.create-product';

  productBaseItems: SelectItemModel[] = this._resolverData['productBases'] ?? [];
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
  productPhotos = signal<ProductPhotoInfoDto[]>(this._resolverData['files'] ?? []);

  constructor() {
    super();
    if (this._product) {
      const { name, productBaseId, productPhotos } = this._product;
      this.form.patchValue({ name, productBaseId, productPhotos });
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

    const { name, productBaseId, productPhotos } = this.form.getRawValue();
    this._product = { name, productBaseId, productPhotos };

    const files = this.productPhotos().filter(x => x.id.includes('temp') && x.file);
    const result$ =
      files.length > 0
        ? this._fileDataService.addList(files.map(x => x.file as Blob)).pipe(
            switchMap(fileIds => {
              fileIds.forEach((flieId, index) => {
                const file = files[index];
                file.id = flieId;
              });
              return this.addOrUpdateProduct$();
            }),
          )
        : this.addOrUpdateProduct$();

    result$.subscribe({
      next: () => {
        this._router.navigateByUrl(`${ClientRoute.productModule}/${ClientRoute.product}/${ClientRoute.list}`);
      },
    });
  }

  private addOrUpdateProduct$(): Observable<ProductRequestFormDto> {
    const product = this._product!;
    const productPhotos = this.productPhotos();

    product.productPhotos = product.productPhotos.filter(productPhoto =>
      productPhotos.map(x => x.id).includes(productPhoto.fileId),
    );
    product.productPhotos = productPhotos
      .filter(productPhoto => !product.productPhotos.map(x => x.fileId).includes(productPhoto.id))
      .map(x => ({ fileId: x.id }));

    return !this._id ? this._productDataService.create(product) : this._productDataService.update(this._id, product);
  }

  protected override setGroup(): FormGroup<IProductForm> {
    return this._formBuilder.group<IProductForm>({
      name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      productBaseId: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      productPhotos: new FormArray<FormControl<{ id?: string; fileId: string }>>([]),
    });
  }
}

export enum DialogType {
  previewProductPhoto,
  productPhoto,
}
