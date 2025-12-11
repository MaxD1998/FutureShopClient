import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../../../../components/shared/nav/nav.component';

@Component({
  selector: 'app-authorization',
  imports: [RouterOutlet, NavComponent],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent {}
