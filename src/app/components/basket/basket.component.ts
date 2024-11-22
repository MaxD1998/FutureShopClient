import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasketComponent {

}
