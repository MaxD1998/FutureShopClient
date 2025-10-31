import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { TableComponent } from '../../../../../../components/shared/table/table.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { PageDto } from '../../../../../../core/dtos/page.dto';
import { ShopPermission } from '../../../../../../core/enums/shop-permission';
import { TableTemplate } from '../../../../../../core/enums/table-template';
import { DataTableColumnModel } from '../../../../../../core/models/data-table-column.model';
import { PaginationModel } from '../../../../../../core/models/pagination.model';
import { UserService } from '../../../../../auth-module/core/services/user.service';
import { AdCampaignDataService } from '../../../../core/data-services/ad-campaign.data-service';
import { AdCampaignListDto } from '../../../../core/dtos/ad-campaign/ad-campaign-list.dto';

@Component({
  selector: 'app-ad-campaign-list',
  imports: [AsyncPipe, TranslateModule, TableComponent],
  templateUrl: './ad-campaign-list.component.html',
  styleUrl: './ad-campaign-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdCampaignListComponent implements OnDestroy {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _adCampaignDataService = inject(AdCampaignDataService);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  readonly userService = inject(UserService);

  ShopPermission: typeof ShopPermission = ShopPermission;

  adCampaigns = signal<AdCampaignListDto[]>([]);
  pagination = signal<PaginationModel>({
    currentPage: 1,
    totalPages: 1,
  });

  columns: DataTableColumnModel[] = [
    {
      field: 'name',
      headerText: 'shop-module.ad-campaign-list-component.name',
      template: TableTemplate.text,
    },
    {
      field: 'start',
      headerText: 'shop-module.ad-campaign-list-component.start',
      template: TableTemplate.text,
    },
    {
      field: 'end',
      headerText: 'shop-module.ad-campaign-list-component.end',
      template: TableTemplate.text,
    },
    {
      field: 'isActive',
      headerText: 'shop-module.ad-campaign-list-component.is-active',
      template: TableTemplate.boolean,
    },
    {
      field: 'adCampaignItemQuantity',
      headerText: 'shop-module.ad-campaign-list-component.number-of-ad-campaign-items',
      template: TableTemplate.text,
    },
    {
      field: 'actions',
      headerText: '',
      template: TableTemplate.action,
    },
  ];

  constructor() {
    this._activatedRoute.paramMap.pipe(takeUntil(this._unsubscribe)).subscribe(() => {
      const pageAdCampaigns: PageDto<AdCampaignListDto> = this._activatedRoute.snapshot.data['pageAdCampaigns'];
      this.setPageProduct(pageAdCampaigns);
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  changePage(pageNumber: number): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.adCampaign}/${ClientRoute.list}/${pageNumber}`,
    );
  }

  navigateToCreate(): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.adCampaign}/${ClientRoute.form}`,
    );
  }

  navigateToEdit(id: string): void {
    this._router.navigateByUrl(
      `${ClientRoute.shopModule}/${ClientRoute.settings}/${ClientRoute.adCampaign}/${ClientRoute.form}/${id}`,
    );
  }

  removeRecord(id: string): void {
    this._adCampaignDataService
      .delete(id)
      .pipe(
        switchMap(() => {
          const pageNumber = this._activatedRoute.snapshot.params['pageNumber'];
          return this._adCampaignDataService.getPage(pageNumber ?? 1);
        }),
      )
      .subscribe({
        next: response => {
          this.setPageProduct(response);
        },
      });
  }

  private setPageProduct(pageProducts: PageDto<AdCampaignListDto>): void {
    this.adCampaigns.set(pageProducts.items);
    this.pagination.set({
      currentPage: pageProducts.currentPage,
      totalPages: pageProducts.totalPages,
    });
  }
}
