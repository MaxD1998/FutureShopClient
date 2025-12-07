import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WindowSizeService {
  private readonly _mobileWidth = 768;

  private _width$ = new BehaviorSubject<number>(window.innerWidth);

  isMobile$ = this._width$.pipe(map(width => width <= this._mobileWidth));
  widthChanges$ = this._width$.asObservable();

  updateWidth(width: number) {
    if (this._width$.value != width) {
      this._width$.next(width);
    }
  }
}
