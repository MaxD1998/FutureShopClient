import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsAsideComponent } from './settings-aside/settings-aside.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, SettingsAsideComponent],
})
export class SettingsComponent {}
