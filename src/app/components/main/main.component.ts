import { Component } from '@angular/core';
import { MenuAsideComponent } from './menu-aside/menu-aside.component';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  imports: [MenuAsideComponent],
})
export class MainComponent {}
