import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { LocalStorageConst } from '../../core/constants/localstorage/localstorage.const';
import { DropDownListOrientation } from '../../core/enums/drop-down-list-orientation';
import { IconType } from '../../core/enums/icon-type';
import { DropDownListItemModel } from '../../core/models/drop-down-list-item.model';
import { AuthService } from '../../core/services/auth.service';
import { DropDownListItemComponent } from '../shared/drop-down-list/drop-down-list-item/drop-down-list-item.component';
import { DropDownListComponent } from '../shared/drop-down-list/drop-down-list.component';
import { NavButtonComponent } from './nav-button/nav-button.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavButtonComponent,
    TranslateModule,
    DropDownListComponent,
    RouterModule,
    DropDownListItemComponent,
    AsyncPipe,
  ],
})
export class NavComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _translateService = inject(TranslateService);

  ClientRoute: typeof ClientRoute = ClientRoute;
  DropDownListOrientation: typeof DropDownListOrientation = DropDownListOrientation;
  IconType: typeof IconType = IconType;

  isDropdownAccountVisible = signal<boolean>(false);
  isDropdownLanguageVisible = signal<boolean>(false);
  langItems = signal<DropDownListItemModel[]>(
    environment.availableLangs.map<DropDownListItemModel>(x => {
      const result: DropDownListItemModel = {
        id: x,
        value: `common.languages.${x}`,
      };

      return result;
    }),
  );

  isSignedIn$ = this._authService.user$.pipe(map(user => !!user));

  changeLang(item: DropDownListItemModel): void {
    this.isDropdownLanguageVisible.set(false);
    localStorage.setItem(LocalStorageConst.currentLang, item.id);
    window.location.reload();
  }

  login(): void {
    this.isDropdownAccountVisible.set(false);
    this._router.navigateByUrl(`${ClientRoute.auth}/${ClientRoute.login}`);
  }

  logout(): void {
    this.isDropdownAccountVisible.set(false);
    this._authService.logout();
  }

  navigateToSettings(): void {
    this._router.navigateByUrl(ClientRoute.settings);
  }

  setDropdownAccountVisible(isVisible: boolean): void {
    this.isDropdownAccountVisible.set(isVisible);
  }

  setDropdownLanguageVisible(): void {
    this.isDropdownLanguageVisible.set(!this.isDropdownLanguageVisible());
  }
}
