import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-ad',
  imports: [],
  templateUrl: './ad.component.html',
  styleUrl: './ad.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdComponent {
  ad = signal<string>('');
}
