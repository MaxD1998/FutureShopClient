import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { PageDto } from '../../../../../../core/dtos/page.dto';
import { ShopPermission } from '../../../../../../core/enums/shop-permission';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { PaginationModel } from '../../../../../../core/models/pagination.model';
import { UserService } from '../../../../../auth-module/core/services/user.service';
import { PromotionDataService } from '../../../../core/data-services/promotion.data-service';
import { PromotionListDto } from '../../../../core/dtos/promotion/promotion-list.dto';

@Component({
  selector: 'app-promotion-list',
  imports: [AsyncPipe, TableComponent],
  templateUrl: './promotion-list.component.html',
  styleUrl: './promotion-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionListComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _promotionDataService = inject(PromotionDataService);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  readonly userService = inject(UserService);

  ShopPermission: typeof ShopPermission = ShopPermission;

  promotions = signal<PromotionListDto[]>([]);
  pagination = signal<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
  });

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerText: 'shop-module.promotion-list-component.name',
      template: TableTemplate.text,
    },
    {
      field: 'code',
      headerText: 'shop-module.promotion-list-component.promotion-code',
      template: TableTemplate.text,
    },
    {
      field: 'start',
      headerText: 'shop-module.promotion-list-component.start',
      template: TableTemplate.text,
    },
    {
      field: 'end',
      headerText: 'shop-module.promotion-list-component.end',
      template: TableTemplate.text,
    },
    {
      field: 'isActive',
      headerText: 'shop-module.promotion-list-component.is-active',
      template: TableTemplate.boolean,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  constructor() {
    this._activatedRoute.paramMap.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
      const pageAdCampaigns: PageDto<PromotionListDto> = this._activatedRoute.snapshot.data['pagePromotions'];
      this.setPageProduct(pageAdCampaigns);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  changePage(pageNumber: number): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.promotion}/${ClientRoute.list}/${pageNumber}`,
    );
  }

  navigateToCreate(): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.promotion}/${ClientRoute.form}`,
    );
  }

  navigateToEdit(id: string): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.promotion}/${ClientRoute.form}/${id}`,
    );
  }

  removeRecord(id: string): void {
    this._promotionDataService
      .delete(id)
      .pipe(
        switchMap(() => {
          const pageNumber = this._activatedRoute.snapshot.params['pageNumber'];
          return this._promotionDataService.getPage(pageNumber ?? 1);
        }),
      )
      .subscribe({
        next: response => {
          this.setPageProduct(response);
        },
      });
  }

  private setPageProduct(pageProducts: PageDto<PromotionListDto>): void {
    this.promotions.set(pageProducts.items);
    this.pagination.set({
      currentPage: pageProducts.currentPage,
      totalPages: pageProducts.totalPages,
    });
  }
}
