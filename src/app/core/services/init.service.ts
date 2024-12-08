import { HttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../../../environments/environment';
import { LocalStorageConst } from '../constants/localstorage/localstorage.const';
import { AuthService } from './auth.service';

export function loadData(): Provider | EnvironmentProviders {
  return provideAppInitializer(() => {
    const initializerFn = ((authService: AuthService) => {
      return () => authService.refreshToken();
    })(inject(AuthService));
    return initializerFn();
  });
}

export function provideTranslation(): (Provider | EnvironmentProviders)[] {
  return [
    importProvidersFrom([
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
          deps: [HttpClient],
        },
      }),
    ]),
    provideAppInitializer(() => {
      const initializerFn = ((service: TranslateService) => {
        return () => {
          let lang = localStorage.getItem(LocalStorageConst.currentLang);

          if (!lang) {
            localStorage.setItem(LocalStorageConst.currentLang, environment.defaultLang);
            lang = environment.defaultLang;
          }

          service.use(lang as string);
        };
      })(inject(TranslateService));
      return initializerFn();
    }),
  ];
}
