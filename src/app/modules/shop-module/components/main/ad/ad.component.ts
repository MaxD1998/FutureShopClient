import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdFileDto } from '../../../../../core/dtos/id-file.dto';
import { AdCampaignDto } from '../../../core/dtos/ad-campaign/ad-campaign.dto';
import { AdCampaignType } from '../../../core/enums/ad-campaign-type';
import { ProductListModel } from '../../../core/models/product-shop.list-model';
import { AdProductShopListComponent } from './ad-product-shop-list/ad-product-shop-list.component';

@Component({
  selector: 'app-ad',
  imports: [AdProductShopListComponent],
  templateUrl: './ad.component.html',
  styleUrl: './ad.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);

  AdCampaignType: typeof AdCampaignType = AdCampaignType;

  ad = signal<AdCampaignDto & IdFileDto>(this._activatedRoute.snapshot.data['data']);

  products = computed<ProductListModel[]>(() => {
    const products = {
      [AdCampaignType.Product]: () => this.ad().products.map(p => new ProductListModel(p)),
      [AdCampaignType.Promotion]: () => this.ad().promotion.products.map(p => new ProductListModel(p)),
    };

    return products[this.ad().type]();
  });

  constructor() {}
}
