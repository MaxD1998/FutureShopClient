import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { codesInterceptor } from './core/interceptors/codes.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { langInterceptor } from './core/interceptors/lang.interceptor';
import { loadData, provideTranslation } from './core/services/init.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([codesInterceptor, jwtInterceptor, langInterceptor, errorInterceptor]),
    ),
    provideTranslation(),
    loadData(),
  ],
};
