import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdFileDto } from '../../../../../core/dtos/id-file.dto';

@Component({
  selector: 'app-ad',
  imports: [],
  templateUrl: './ad.component.html',
  styleUrl: './ad.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdComponent {
  private readonly _activatedRoute = inject(ActivatedRoute);

  ad = signal<IdFileDto>(this._activatedRoute.snapshot.data['data']);

  constructor() {}
}
