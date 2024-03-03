import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { langInterceptor } from './core/interceptors/lang.interceptor';
import { autoLogin, provideTranslation } from './core/services/init.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([jwtInterceptor, langInterceptor])),
    provideTranslation(),
    autoLogin(),
  ],
};
