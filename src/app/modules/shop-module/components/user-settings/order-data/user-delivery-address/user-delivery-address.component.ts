import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { DialogWindowComponent } from '../../../../../../components/shared/modals/dialog-window/dialog-window.component';
import { ButtonLayout } from '../../../../../../core/enums/button-layout';
import { UserDeliveryAddressDataService } from '../../../../core/data-services/user-delivery-address.data-service';
import { UserDeliveryAddressResponseFormDto } from '../../../../core/dtos/user-delivery-address/user-delivery-address.response-form.dto';
import { AddUserDeliveryAddressComponent } from './add-user-delivery-address/add-user-delivery-address.component';

@Component({
  selector: 'app-user-delivery-address',
  imports: [TranslateModule, ButtonComponent, DialogWindowComponent, AddUserDeliveryAddressComponent],
  templateUrl: './user-delivery-address.component.html',
  styleUrl: './user-delivery-address.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDeliveryAddressComponent {
  private readonly _userDeliveryAddressDataService = inject(UserDeliveryAddressDataService);

  userDeliveryAddresses = model.required<UserDeliveryAddressResponseFormDto[]>();

  ButtonLayout: typeof ButtonLayout = ButtonLayout;

  userDeliveryAddressId = signal<string | undefined>(undefined);
  isDialogActive = signal<boolean>(false);

  edit(dto: UserDeliveryAddressResponseFormDto): void {
    this.userDeliveryAddressId.set(dto.id);
    this.isDialogActive.set(true);
  }

  delete(id: string): void {
    this._userDeliveryAddressDataService.delete(id).subscribe({
      next: () => {
        const array = this.userDeliveryAddresses().filter(x => x.id !== id);
        this.userDeliveryAddresses.set(Array.from(array));
      },
    });
  }
}
