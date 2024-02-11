import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NavButtonComponent } from '../shared/nav-button/nav-button.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  imports: [NavButtonComponent, TranslateModule],
})
export class NavComponent {}
