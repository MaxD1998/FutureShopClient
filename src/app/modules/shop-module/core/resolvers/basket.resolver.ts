import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { take } from 'rxjs';
import { BasketItemDto } from '../dtos/basket/basket-item.dto';
import { BasketService } from '../services/basket.service';

export const basketResolver: ResolveFn<{
  basketItems: BasketItemDto[];
  images: Record<string, string>;
}> = (route, state) => {
  const basketService = inject(BasketService);

  return basketService.initBasketData().pipe(take(1));
};
