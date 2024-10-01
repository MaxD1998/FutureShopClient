import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuAsideComponent } from './menu-aside/menu-aside.component';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  imports: [RouterModule, MenuAsideComponent],
})
export class MainComponent {}
