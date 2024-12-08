import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconType } from '../../../core/enums/icon-type';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
    selector: 'app-nav-button',
    templateUrl: './nav-button.component.html',
    styleUrl: './nav-button.component.css',
    imports: [RouterModule, IconComponent]
})
export class NavButtonComponent {
  @Input() iconName: IconType;
  @Input() label: string;
  @Input() routeLink: string;
}
