import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { switchMap, take } from 'rxjs';
import { ButtonComponent } from '../../../../../components/shared/button/button.component';
import { IconComponent } from '../../../../../components/shared/icon/icon.component';
import { DialogWindowComponent } from '../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { ClientRoute } from '../../../../../core/constants/client-routes/client.route';
import { IconType } from '../../../../../core/enums/icon-type';
import { PurchaseListDataService } from '../../../core/data-services/purchase-list.data-service';
import { PurchaseListModel } from '../../../core/models/purchase-list.model';
import { PurchaseListService } from '../../../core/services/purchase-list.service';
import { AddPurchaseListComponent } from '../../shared/add-purchase-list/add-purchase-list.component';

@Component({
  selector: 'app-purchase-lists',
  imports: [
    TranslateModule,
    ButtonComponent,
    IconComponent,
    RouterLink,
    DialogWindowComponent,
    AddPurchaseListComponent,
  ],
  templateUrl: './purchase-lists.component.html',
  styleUrl: './purchase-lists.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseListsComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _purchaseListDataService = inject(PurchaseListDataService);
  private readonly _purchaseListService = inject(PurchaseListService);

  isDialogActive = signal<boolean>(false);
  purchaseLists = signal<PurchaseListModel[]>([]);

  IconType: typeof IconType = IconType;

  constructor() {
    this.purchaseLists.set(this._activatedRoute.snapshot.data['data']);
  }

  create(name: string): void {
    this.isDialogActive.set(false);
    this._purchaseListService.create(
      {
        name: name,
        isFavourite: false,
        purchaseListItems: [],
      },
      value => {
        const purchaseList = this.purchaseLists();
        purchaseList.push(new PurchaseListModel(value));

        const sortedList = purchaseList.sort((a, b) => {
          if (a.isFavourite > b.isFavourite) {
            return -1;
          }

          if (a.isFavourite < b.isFavourite) {
            return 1;
          }

          if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
          }

          if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
          }

          return 0;
        });

        this.purchaseLists.set(Array.from(sortedList));
      },
    );
  }

  createLink(id: string): string {
    return `/${ClientRoute.product}/${ClientRoute.details}/${id}`;
  }

  remove(id: string): void {
    this._purchaseListDataService
      .dalete(id)
      .pipe(
        switchMap(() => {
          return this._purchaseListService.purchaseLists$.pipe(take(1));
        }),
      )
      .subscribe({
        next: purchaseLists => {
          const newPurchaseLists = purchaseLists.filter(x => x.id != id);
          this._purchaseListService.purchaseLists$.next(newPurchaseLists);
          this.purchaseLists.set(Array.from(this.purchaseLists().filter(x => x.id != id)));
        },
      });
  }
}
