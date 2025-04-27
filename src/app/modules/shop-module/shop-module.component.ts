import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shop-module',
  imports: [RouterOutlet],
  templateUrl: './shop-module.component.html',
  styleUrl: './shop-module.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopModuleComponent {}
