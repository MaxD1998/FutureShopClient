import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonLayout } from '../../core/enums/button-layout';
import { IconType } from '../../core/enums/icon-type';
import { ButtonComponent } from '../shared/button/button.component';
import { IconComponent } from '../shared/icon/icon.component';
import { InputComponent } from '../shared/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [InputComponent, TranslateModule, ButtonComponent, IconComponent],
})
export class LoginComponent {
  ButtonLayout: typeof ButtonLayout = ButtonLayout;
  IconType: typeof IconType = IconType;
}
