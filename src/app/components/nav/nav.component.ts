import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';
import { LocalStorageConst } from '../../core/constants/localstorage/localstorage.const';
import { DropDownListModel } from '../../core/models/drop-down-list-model';
import { DropDownListComponent } from '../shared/drop-down-list/drop-down-list.component';
import { NavButtonComponent } from '../shared/nav-button/nav-button.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  imports: [NavButtonComponent, TranslateModule, DropDownListComponent],
})
export class NavComponent {
  isDropdownLanguageVisible = false;
  langItems: DropDownListModel[] = [];

  constructor(private _translateService: TranslateService) {
    this.initLangItems();
  }

  changeLang(item: DropDownListModel): void {
    localStorage.setItem(LocalStorageConst.currentLang, item.Id);
    this._translateService.use(item.Id);
    this.initLangItems();
  }

  setDropdownLanguageVisible(): void {
    this.isDropdownLanguageVisible = !this.isDropdownLanguageVisible;
  }

  private initLangItems(): void {
    this._translateService
      .get('common.languages')
      .pipe(
        map(values =>
          Object.entries(values).map<DropDownListModel>(([id, value]) => ({ Id: id as string, Value: value as string }))
        )
      )
      .subscribe(response => (this.langItems = response));
  }
}
