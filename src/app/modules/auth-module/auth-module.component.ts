import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from '../../components/shared/nav/nav.component';

@Component({
  selector: 'app-auth-module',
  imports: [RouterOutlet, NavComponent],
  templateUrl: './auth-module.component.html',
  styleUrl: './auth-module.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModuleComponent {}
