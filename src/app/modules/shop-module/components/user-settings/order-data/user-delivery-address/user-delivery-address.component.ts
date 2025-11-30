import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../../../../../components/shared/button/button.component';
import { ButtonLayout } from '../../../../../../core/enums/button-layout';
import { UserDeliveryAddressResponseFormDto } from '../../../../core/dtos/user-delivery-address/user-delivery-address.response-form.dto';

@Component({
  selector: 'app-user-delivery-address',
  imports: [TranslateModule, ButtonComponent],
  templateUrl: './user-delivery-address.component.html',
  styleUrl: './user-delivery-address.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDeliveryAddressComponent {
  userDeliveryAddresses = input.required<UserDeliveryAddressResponseFormDto[]>();
  userDeliveryAddresses2 = input<UserDeliveryAddressResponseFormDto[]>([
    {
      id: 'addr_001',
      firstName: 'Jan',
      lastName: 'Kowalski',
      apartamentNumber: '12A',
      city: 'Warszawa',
      email: 'jan.kowalski@example.com',
      houseNumber: '45',
      isDefault: true,
      phoneNumber: '+48500111222',
      postalCode: '00-123',
      street: 'Marszałkowska',
    },
    {
      id: 'addr_002',
      firstName: 'Anna',
      lastName: 'Nowak',
      apartamentNumber: '7',
      city: 'Kraków',
      email: 'anna.nowak@example.com',
      houseNumber: '10B',
      isDefault: false,
      phoneNumber: '+48500555444',
      postalCode: '31-456',
      street: 'Długa',
    },
    {
      id: 'addr_003',
      firstName: 'Paweł',
      lastName: 'Wiśniewski',
      city: 'Gdańsk',
      email: 'pawel.wisniewski@example.com',
      houseNumber: '8',
      isDefault: false,
      phoneNumber: '+48500999888',
      postalCode: '80-215',
      street: 'Grunwaldzka',
    },
    {
      id: 'addr_004',
      firstName: 'Kasia',
      lastName: 'Zielińska',
      apartamentNumber: '22',
      city: 'Wrocław',
      email: 'kasia.zielinska@example.com',
      houseNumber: '3C',
      isDefault: false,
      phoneNumber: '+48500222333',
      postalCode: '50-001',
      street: 'Świdnicka',
    },
    {
      id: 'addr_005',
      firstName: 'Marek',
      lastName: 'Kaczmarek',
      city: 'Poznań',
      email: 'marek.kaczmarek@example.com',
      houseNumber: '19',
      isDefault: true,
      phoneNumber: '+48500444666',
      postalCode: '60-702',
      street: 'Głogowska',
    },
  ]);

  ButtonLayout: typeof ButtonLayout = ButtonLayout;
}
