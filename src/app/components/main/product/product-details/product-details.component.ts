import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ProductPhotoDataService } from '../../../../core/data-services/product-photo.data-service';
import { ProductDataService } from '../../../../core/data-services/product.data-service';
import { ProductDto } from '../../../../core/dtos/product.dto';
import { IconType } from '../../../../core/enums/icon-type';
import { TableHeaderFloat } from '../../../../core/enums/table-header-float';
import { TableTemplate } from '../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../core/models/data-table-column.model';
import { ButtonComponent } from '../../../shared/button/button.component';
import { InputPlusMinusComponent } from '../../../shared/input-plus-minus/input-plus-minus.component';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [TranslateModule, ButtonComponent, InputPlusMinusComponent, TableComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productDataService = inject(ProductDataService);
  private readonly _productPhotoDataService = inject(ProductPhotoDataService);
  private readonly _translateService = inject(TranslateService);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  images = signal<{ source: string; isShowed: boolean }[]>([]);
  product = signal<ProductDto | undefined>(undefined);

  image = computed<string>(() => {
    const image = this.images().find(x => x.isShowed);

    return image?.source ?? '';
  });

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerFloat: TableHeaderFloat.left,
      headerText: 'product-details.component.table.name',
      template: TableTemplate.text,
    },
    {
      field: 'value',
      headerFloat: TableHeaderFloat.left,
      headerText: 'product-details.component.table.value',
      template: TableTemplate.text,
    },
  ];

  IconType: typeof IconType = IconType;

  constructor() {
    this.product.set(this._activatedRoute.snapshot.data['data']['product']);
    this.images.set(this._activatedRoute.snapshot.data['data']['images']);
    const product = this.product();
    if (!product) {
      return;
    }

    this._translateService.onLangChange
      .pipe(
        takeUntil(this._unsubscribe),
        switchMap(() => {
          return this._productDataService.getDetailsById(product.id);
        }),
      )
      .subscribe({
        next: reponse => {
          this.product.set(reponse);
        },
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  showImage(index: number): void {
    const image = this.images().find(x => x.isShowed);

    if (image) {
      image.isShowed = false;
      this.images()[index].isShowed = true;
      this.images.set(Array.from(this.images()));
    }
  }
}
