import { ChangeDetectionStrategy, Component, inject, Injector, input, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { FileDataService } from '../../../../../../core/data-service/file.data-service';

@Component({
  selector: 'app-preview-product-photo',
  imports: [],
  templateUrl: './preview-product-photo.component.html',
  styleUrl: './preview-product-photo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewProductPhotoComponent {
  private readonly _injector = inject(Injector);
  private readonly _fileDataService = inject(FileDataService);
  id = input<string>();

  imageUrl = signal<string>('');
  isLoaded = signal<boolean>(false);

  constructor() {
    toObservable(this.id, { injector: this._injector })
      .pipe(
        switchMap(id => {
          this.isLoaded.set(false);
          return id ? this._fileDataService.getById(id) : of(null);
        }),
      )
      .subscribe({
        next: response => {
          this.imageUrl.set(response ? URL.createObjectURL(response) : '');
          if (this.id() != '') {
            this.isLoaded.set(true);
          }
        },
      });
  }
}
