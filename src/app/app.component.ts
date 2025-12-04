import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WindowSizeService } from './core/services/window-size.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
})
export class AppComponent {
  private readonly _windowSizeService = inject(WindowSizeService);

  @HostListener('window:resize')
  onResize() {
    this._windowSizeService.updateWidth(window.innerWidth);
  }
}
