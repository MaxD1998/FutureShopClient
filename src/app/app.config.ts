import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { localStorageInterceptor } from './core/interceptors/localStorage.interceptor';
import { loadData, provideTranslation } from './core/services/init.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor, localStorageInterceptor, errorInterceptor])),
    provideTranslation(),
    loadData(),
  ],
};
