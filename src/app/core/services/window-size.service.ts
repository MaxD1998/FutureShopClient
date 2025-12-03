import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WindowSizeService {
  private _width$ = new BehaviorSubject<number>(window.innerWidth);

  widthChanges$ = this._width$.asObservable();

  updateWidth(width: number) {
    if (this._width$.value != width) {
      this._width$.next(width);
    }
  }
}
