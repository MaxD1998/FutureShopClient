import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconType } from '../../../../core/enums/icon-type';
import { IconComponent } from '../../icon/icon.component';

@Component({
  selector: 'app-nav-button',
  templateUrl: './nav-button.component.html',
  styleUrl: './nav-button.component.css',
  imports: [RouterModule, IconComponent],
})
export class NavButtonComponent {
  iconName = input.required<IconType>();
  routeLink = input<string>();
}
