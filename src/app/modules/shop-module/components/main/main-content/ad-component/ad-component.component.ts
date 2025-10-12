import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonIconComponent } from '../../../../../../components/shared/button-icon/button-icon.component';
import { ClientRoute } from '../../../../../../core/constants/client-routes/client.route';
import { IdFileDto } from '../../../../../../core/dtos/id-file.dto';
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
  private readonly _router = inject(Router);

  ButtonLayout = ButtonLayout;
  IconType = IconType;

  ads = signal<IdFileDto[]>(this._activatedRoute.snapshot.data['data']);
  currentIndex = signal<number>(0);
  timer?: NodeJS.Timeout;

  constructor() {
    this.setAutoNextImage();
  }

  getFile(index: number): string {
    const file = this.ads()[index]?.file ?? '';
    return file;
  }

  goToImage(index: number): void {
    this.currentIndex.set(index);
  }

  navigateToAd(index: number): void {
    const ad = this.ads()[index];

    this._router.navigateByUrl(`${ClientRoute.ad}/${ad.id}`);
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
