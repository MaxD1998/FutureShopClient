import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonIconComponent } from '../../../../../../components/shared/button-icon/button-icon.component';
import { ButtonLayout } from '../../../../../../core/enums/button-layout';
import { IconType } from '../../../../../../core/enums/icon-type';

@Component({
  selector: 'app-ad-component',
  imports: [ButtonIconComponent],
  templateUrl: './ad-component.component.html',
  styleUrl: './ad-component.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdComponentComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);

  ButtonLayout = ButtonLayout;
  IconType = IconType;

  ads = signal<string[]>(this._activatedRoute.snapshot.data['ad']);

  currentIndex = signal<number>(0);
  timer?: NodeJS.Timeout;

  constructor() {
    this.setAutoNextImage();
  }

  goToImage(index: number): void {
    this.currentIndex.set(index);
  }

  nextImage(): void {
    this.currentIndex.set((this.currentIndex() + 1) % this.ads().length);
  }

  prevImage(): void {
    this.currentIndex.set((this.currentIndex() - 1 + this.ads().length) % this.ads().length);
  }

  setAutoNextImage(): void {
    if (!this.timer) {
      this.timer = setInterval(() => {
        this.nextImage();
      }, 5000);
    }
  }

  stopAutoNextImage(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
