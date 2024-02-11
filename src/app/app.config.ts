import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { autoLogin, provideTranslation } from './core/services/init.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withFetch()), provideTranslation(), autoLogin()],
};
