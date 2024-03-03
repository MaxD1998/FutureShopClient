import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { ClientRoute } from '../../core/constants/client-routes/client.route';
import { LocalStorageConst } from '../../core/constants/localstorage/localstorage.const';
import { DropDownListOrientation } from '../../core/enums/drop-down-list-orientation';
import { IconType } from '../../core/enums/icon-type';
import { DropDownListItemModel } from '../../core/models/drop-down-list-item.model';
import { AuthService } from '../../core/services/auth.service';
import { LangNext } from '../../core/services/language.service';
import { DropDownListItemComponent } from '../shared/drop-down-list/drop-down-list-item/drop-down-list-item.component';
import { DropDownListComponent } from '../shared/drop-down-list/drop-down-list.component';
import { NavButtonComponent } from './nav-button/nav-button.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  imports: [NavButtonComponent, TranslateModule, DropDownListComponent, RouterModule, DropDownListItemComponent],
})
export class NavComponent {
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _translateService = inject(TranslateService);

  ClientRoute: typeof ClientRoute = ClientRoute;
  DropDownListOrientation: typeof DropDownListOrientation = DropDownListOrientation;
  IconType: typeof IconType = IconType;
  isDropdownAccountVisible = false;
  isDropdownLanguageVisible = false;
  langItems: DropDownListItemModel[] = [];

  constructor() {
    this.initLangItems();
  }

  get isSignedIn(): boolean {
    return this._authService.isSignedIn;
  }

  changeLang(item: DropDownListItemModel): void {
    localStorage.setItem(LocalStorageConst.currentLang, item.id);
    LangNext();
    this._translateService.use(item.id);
    this.initLangItems();
  }

  login(): void {
    this.isDropdownAccountVisible = false;
    this._router.navigateByUrl(ClientRoute.login);
  }

  logout(): void {
    this.isDropdownAccountVisible = false;
    this._authService.logout();
  }

  setDropdownAccountVisible(isVisible: boolean): void {
    this.isDropdownAccountVisible = isVisible;
  }

  setDropdownLanguageVisible(): void {
    this.isDropdownLanguageVisible = !this.isDropdownLanguageVisible;
  }

  private initLangItems(): void {
    this.isDropdownLanguageVisible = false;
    this.langItems = environment.availableLangs.map<DropDownListItemModel>(x => {
      const result: DropDownListItemModel = {
        id: x,
        value: `common.languages.${x}`,
      };
      return result;
    });
  }
}
