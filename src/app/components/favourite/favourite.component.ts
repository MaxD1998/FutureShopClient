import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-favourite',
  standalone: true,
  imports: [],
  templateUrl: './favourite.component.html',
  styleUrl: './favourite.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavouriteComponent {

}
