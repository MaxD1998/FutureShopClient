import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { defaultIfEmpty, forkJoin, map, of, switchMap } from 'rxjs';
import { ProductPhotoDataService } from '../data-services/product-photo.data-service';
import { ProductDataService } from '../data-services/product.data-service';
import { ProductDto } from '../dtos/product.dto';

export const productDetailsResolver: ResolveFn<{
  product: ProductDto;
  images: { source: string; isShowed: boolean }[];
}> = (route, state) => {
  const productDataService = inject(ProductDataService);
  const productPhotoDataService = inject(ProductPhotoDataService);

  return productDataService.getDetailsById(route.params['id']).pipe(
    switchMap(response => {
      return forkJoin({
        product: of(response),
        images: response
          ? of(response.fileIds).pipe(
              switchMap(fileIds => {
                const requests = fileIds.map(x =>
                  productPhotoDataService.getById(x).pipe(
                    map((image, index) => {
                      return {
                        source: URL.createObjectURL(image),
                        isShowed: index == 0,
                      };
                    }),
                  ),
                );
                return forkJoin(requests).pipe(defaultIfEmpty([]));
              }),
            )
          : of([]),
      });
    }),
  );
};
