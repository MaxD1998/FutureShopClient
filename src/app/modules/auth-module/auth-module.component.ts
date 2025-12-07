import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-module',
  imports: [RouterOutlet],
  templateUrl: './auth-module.component.html',
  styleUrl: './auth-module.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthModuleComponent {}
