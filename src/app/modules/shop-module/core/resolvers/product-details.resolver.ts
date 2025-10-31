import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { defaultIfEmpty, forkJoin, map, of, switchMap } from 'rxjs';
import { FilePublicDataService } from '../../../../core/public-data-services/file.public-data-service';
import { ProductDto } from '../dtos/product/product.dto';
import { ProductPublicDataService } from '../public-data-services/product.public-data-service';

export const productDetailsResolver: ResolveFn<{
  product: ProductDto;
  images: { source: string; isShowed: boolean }[];
}> = (route, state) => {
  const productPublicDataService = inject(ProductPublicDataService);
  const filePublicDataService = inject(FilePublicDataService);

  return productPublicDataService.getDetailsById(route.params['id']).pipe(
    switchMap(response => {
      return forkJoin({
        product: of(response),
        images: response
          ? of(response.fileIds).pipe(
              switchMap(fileIds => {
                const requests = fileIds.map(x =>
                  filePublicDataService.getById(x).pipe(
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
