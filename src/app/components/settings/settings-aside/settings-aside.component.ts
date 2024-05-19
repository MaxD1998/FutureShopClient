import { Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClientRoute } from '../../../core/constants/client-routes/client.route';
import { AsideItemModel } from '../../../core/models/aside-item.model';
import { AsideComponent } from '../../shared/aside/aside.component';

@Component({
  selector: 'app-settings-aside',
  standalone: true,
  templateUrl: './settings-aside.component.html',
  styleUrl: './settings-aside.component.css',
  imports: [TranslateModule, AsideComponent],
})
export class SettingsAsideComponent {
  private readonly _translateService = inject(TranslateService);

  getItems(): AsideItemModel[] {
    const results: AsideItemModel[] = [
      {
        id: '1',
        name: this._translateService.instant('settings-aside-component.items.account'),
        hasSubCategories: false,
        link: '',
      },
      {
        id: '2',
        name: this._translateService.instant('settings-aside-component.items.categories'),
        hasSubCategories: false,
        link: `${ClientRoute.categories}/${ClientRoute.list}`,
      },
    ];

    return results;
  }
}
