import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PurchaseListModel } from '../../../core/models/purchase-list.model';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-purchase-lists',
  standalone: true,
  imports: [TranslateModule, ButtonComponent],
  templateUrl: './purchase-lists.component.html',
  styleUrl: './purchase-lists.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseListsComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);

  purchaseLists = signal<PurchaseListModel[]>([]);

  constructor() {
    this.purchaseLists.set(this._activatedRoute.snapshot.data['data']);
  }

  create(): void {}
}
