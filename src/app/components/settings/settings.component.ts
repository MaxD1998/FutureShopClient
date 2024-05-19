import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SettingsAsideComponent } from './settings-aside/settings-aside.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  imports: [RouterOutlet, SettingsAsideComponent],
})
export class SettingsComponent {}
