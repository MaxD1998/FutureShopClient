import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { InputComponent } from '../../../../../../components/shared/input/input.component';
import { BaseFormComponent } from '../../../../../../core/bases/base-form.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { AuthorizationPermission } from '../../../../../../core/enums/permissions/authorization-permission';
import { ProductPermission } from '../../../../../../core/enums/permissions/product-permission';
import { ShopPermission } from '../../../../../../core/enums/permissions/shop-permission';
import { BasePermissionFormDto } from '../../../../core/bases/base-permission.form-dto';
import { PermissionGroupDataService } from '../../../../core/data-service/permission-group.data-service';
import { PermissionGroupResponseFormDto } from '../../../../core/dtos/permission-group/permission-group.response-form-dto';
import { AuthorizationPermissionFormDto } from '../../../../core/dtos/permission-group/permissions/authorization-permission.form-dto';
import { ProductPermissionFormDto } from '../../../../core/dtos/permission-group/permissions/product-permission.form-dto';
import { ShopPermissionFormDto } from '../../../../core/dtos/permission-group/permissions/shop-permission.form-dto';
import { PermissionListModel } from '../../../../core/models/permission-list.model';
import { PermissionListService } from '../../../../core/services/permission-list.service';
import { PermissionGroupSectionComponent } from './permission-group-section/permission-group-section.component';

interface IPermissionGroupForm {
  name: FormControl<string>;
}
@Component({
  selector: 'app-permission-group-form',
  imports: [ReactiveFormsModule, TranslateModule, InputComponent, ButtonComponent, PermissionGroupSectionComponent],
  templateUrl: './permission-group-form.component.html',
  styleUrl: './permission-group-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionGroupFormComponent extends BaseFormComponent<IPermissionGroupForm> {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _permissionGroupDataService = inject(PermissionGroupDataService);
  private readonly _permissionListService = inject(PermissionListService);
  private readonly _router = inject(Router);

  authPermissionList = signal<PermissionListModel[]>(this._permissionListService.listAuthorizationPermissions());
  productPermissionList = signal<PermissionListModel[]>(this._permissionListService.listProductPermissions());
  shopPermissionList = signal<PermissionListModel[]>(this._permissionListService.listShopPermissions());

  header = this.id
    ? 'auth-module.permission-group-form-component.edit-permission-group'
    : 'auth-module.permission-group-form-component.create-permission-group';

  id?: string = this._activatedRoute.snapshot.params['id'];
  permissionGroup?: PermissionGroupResponseFormDto = this._activatedRoute.snapshot.data['form'];

  constructor() {
    super();

    if (this.id) {
      const { name, authorizationPermissions, productPermissions, shopPermissions, warehousePermissions } =
        this.permissionGroup!;

      this.form.patchValue({ name });

      this.authPermissionList()
        .flatMap(x => x.permissions)
        .forEach(x => {
          if (authorizationPermissions.map(y => y.permission).includes(x.permission as AuthorizationPermission)) {
            x.value = true;
          }
        });

      this.authPermissionList.set(Array.from(this.authPermissionList()));

      this.productPermissionList()
        .flatMap(x => x.permissions)
        .forEach(x => {
          if (productPermissions.map(y => y.permission).includes(x.permission as ProductPermission)) {
            x.value = true;
          }
        });

      this.productPermissionList.set(Array.from(this.productPermissionList()));

      this.shopPermissionList()
        .flatMap(x => x.permissions)
        .forEach(x => {
          if (shopPermissions.map(y => y.permission).includes(x.permission as ShopPermission)) {
            x.value = true;
          }
        });

      this.shopPermissionList.set(Array.from(this.shopPermissionList()));
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name } = this.form.getRawValue();

    if (!this.permissionGroup) {
      this.permissionGroup = {
        id: '',
        name,
        authorizationPermissions: [],
        productPermissions: [],
        shopPermissions: [],
        warehousePermissions: [],
      };
    }

    const authPermissions = this.authPermissionList()
      .flatMap(x => x.permissions)
      .filter(x => x.value)
      .map<AuthorizationPermissionFormDto>(x => ({ permission: x.permission as AuthorizationPermission }));
    const productPermissions = this.productPermissionList()
      .flatMap(x => x.permissions)
      .filter(x => x.value)
      .map<ProductPermissionFormDto>(x => ({ permission: x.permission as ProductPermission }));
    const shopPermissions = this.shopPermissionList()
      .flatMap(x => x.permissions)
      .filter(x => x.value)
      .map<ShopPermissionFormDto>(x => ({ permission: x.permission as ShopPermission }));

    this.permissionGroup.authorizationPermissions = this.updateArray(
      this.permissionGroup.authorizationPermissions,
      authPermissions,
    );
    this.permissionGroup.productPermissions = this.updateArray(
      this.permissionGroup.productPermissions,
      productPermissions,
    );
    this.permissionGroup.shopPermissions = this.updateArray(this.permissionGroup.shopPermissions, shopPermissions);

    const id = this.id;
    const result = id
      ? this._permissionGroupDataService.update(id, this.permissionGroup)
      : this._permissionGroupDataService.create(this.permissionGroup);

    result.subscribe({
      next: () => {
        const route: string[] = [
          ClientRoute.authModule,
          ClientRoute.settings,
          ClientRoute.permissionGroup,
          ClientRoute.list,
        ];

        this._router.navigate(route);
      },
    });
  }

  protected override setGroup(): FormGroup<IPermissionGroupForm> {
    return this._formBuilder.group<IPermissionGroupForm>({
      name: new FormControl<string>('', { nonNullable: true, validators: Validators.required }),
    });
  }

  private updateArray<T>(
    array: BasePermissionFormDto<T>[],
    updateArray: BasePermissionFormDto<T>[],
  ): BasePermissionFormDto<T>[] {
    const toAddItems = updateArray.filter(x => !array.includes(x));
    array = array.concat(toAddItems);
    array = array.filter(x => updateArray.includes(x));

    return array;
  }
}
