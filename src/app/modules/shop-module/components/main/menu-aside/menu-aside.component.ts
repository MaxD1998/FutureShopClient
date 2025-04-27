import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AsideComponent } from '../../../../../components/shared/aside/aside.component';
import { AsideItemModel } from '../../../../../core/models/aside-item.model';

@Component({
  selector: 'app-menu-aside',
  templateUrl: './menu-aside.component.html',
  styleUrl: './menu-aside.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, AsideComponent],
})
export class MenuAsideComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);

  onCloseMenu = output<void>();

  categories = signal<AsideItemModel[]>(this._activatedRoute.snapshot.data['categories'] ?? []);
}
