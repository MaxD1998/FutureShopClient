import { Directive, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { take, tap } from 'rxjs';
import { UserService } from '../../modules/auth-module/core/services/user.service';
import { AuthorizeDto } from '../dtos/authorize.dto';
import { ModuleType } from '../enums/module-type';
import { UserType } from '../enums/user-type';

@Directive({
  selector: '[canEdit]',
})
export class CanEditDirective {
  private readonly _templateRef = inject(TemplateRef);
  private readonly _userService = inject(UserService);
  private readonly _viewContainer = inject(ViewContainerRef);

  canEdit = input.required<ModuleType>();

  constructor() {
    this._userService.user$.pipe(take(1), tap(this.updateView.bind(this))).subscribe();
  }

  updateView(user: AuthorizeDto | undefined) {
    if (
      user &&
      (user.modules.some(x => x.moduleType == this.canEdit() && x.canEdit) ||
        user.roles.some(x => x == UserType.superAdmin))
    ) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      this._viewContainer.clear();
    }
  }
}
