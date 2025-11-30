import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClientRoute } from '../../../core/constants/client-routes/client.route';
import { LocalStorageConst } from '../../../core/constants/localstorage/localstorage.const';
import { AuthorizeDto } from '../../../core/dtos/authorize.dto';
import { ButtonLayout } from '../../../core/enums/button-layout';
import { IconType } from '../../../core/enums/icon-type';
import { UserType } from '../../../core/enums/user-type';
import { DropDownListItemModel } from '../../../core/models/drop-down-list-item.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../modules/auth-module/core/services/user.service';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { NavButtonDropdownComponent } from './nav-button-dropdown/nav-button-dropdown.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, RouterModule, NavButtonDropdownComponent, ButtonIconComponent],
})
export class NavComponent implements OnDestroy {
  private readonly _authService = inject(AuthService);
  private readonly _userService = inject(UserService);
  private readonly _router = inject(Router);
  private readonly _unsubscribe: Subject<void> = new Subject<void>();

  ClientRoute: typeof ClientRoute = ClientRoute;
  IconType: typeof IconType = IconType;
  ButtonLayout: typeof ButtonLayout = ButtonLayout;

  additionalUserItems = input<DropDownListItemModel[]>([]);
  setMenuButton = input<boolean>(false);

  onClickMenuButton = output<void>();

  isDropdownAccountVisible = signal<boolean>(false);
  isDropdownLanguageVisible = signal<boolean>(false);
  langItems = signal<DropDownListItemModel[]>(
    environment.availableLangs.map<DropDownListItemModel>(x => {
      const result: DropDownListItemModel = {
        id: x,
        value: `common.languages.${x}`,
        callback: this.changeLang.bind(this),
      };

      return result;
    }),
  );

  userItems = signal<DropDownListItemModel[]>([]);

  constructor() {
    afterNextRender(() => {
      this._userService.user$.pipe(takeUntil(this._unsubscribe), tap(this.setUserItems.bind(this))).subscribe();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }

  changeLang(item: DropDownListItemModel): void {
    this.isDropdownLanguageVisible.set(false);
    localStorage.setItem(LocalStorageConst.currentLang, item.id);
    window.location.reload();
  }

  login(): void {
    this.isDropdownAccountVisible.set(false);
    this._router.navigateByUrl(`${ClientRoute.authModule}/${ClientRoute.auth}/${ClientRoute.login}`);
  }

  logout(): void {
    this.isDropdownAccountVisible.set(false);
    this._authService.logout();
  }

  setDropdownAccountVisible(isVisible: boolean): void {
    this.isDropdownAccountVisible.set(isVisible);
  }

  setDropdownLanguageVisible(): void {
    this.isDropdownLanguageVisible.set(!this.isDropdownLanguageVisible());
  }

  private setUserItems(user: AuthorizeDto | undefined): void {
    if (user) {
      let array: DropDownListItemModel[] = [
        {
          id: '',
          value: 'nav-component.logout',
          callback: this.logout.bind(this),
        },
      ];

      if (
        user.authorizationPermissions.length > 0 ||
        user.productPermissions.length > 0 ||
        user.shopPermissions.length > 0 ||
        user.warehousePermissions.length > 0 ||
        user.roles.some(x => x == UserType.superAdmin)
      ) {
        const module: DropDownListItemModel[] = [
          {
            id: '',
            value: 'nav-component.modules',
            callback: () => {
              this._router.navigateByUrl(`${ClientRoute.module}`);
            },
          },
        ];

        array = module.concat(array);
      }

      this.userItems.set(array);
    } else {
      this.userItems.set([
        {
          id: '',
          value: 'nav-component.sign-in',
          callback: this.login.bind(this),
        },
      ]);
    }

    this.userItems.set(
      Array.from<DropDownListItemModel>([]).concat(this.additionalUserItems()).concat(this.userItems()),
    );
  }
}
