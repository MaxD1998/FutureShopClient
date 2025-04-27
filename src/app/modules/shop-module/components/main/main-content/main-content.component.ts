import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdComponentComponent } from './ad-component/ad-component.component';

@Component({
  selector: 'app-main-content',
  imports: [AdComponentComponent],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContentComponent {}
