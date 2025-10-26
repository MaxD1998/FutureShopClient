import { ChangeDetectionStrategy, Component, input, model, signal } from '@angular/core';

@Component({
  selector: 'app-rating',
  imports: [],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingComponent {
  ratingOptions = [1, 2, 3, 4, 5];

  isDisabled = input<boolean>(false);
  rating = model<number>(0);

  hoveredIndex = signal<number>(0);

  setBgSky600(index: number): string {
    if (index < (this.hoveredIndex() || this.rating())) {
      return 'bg-sky-600';
    }
    return '';
  }

  setRating(index: number): void {
    if (this.isDisabled()) {
      return;
    }

    if (this.rating() != index + 1) {
      this.rating.set(index + 1);
      return;
    }

    this.rating.set(0);
  }
}
