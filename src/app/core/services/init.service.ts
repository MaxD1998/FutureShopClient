import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, EnvironmentProviders, Provider, importProvidersFrom } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../../../environments/environment';
import { LocalStorageConst } from '../constants/localstorage/localstorage.const';
import { AuthService } from './auth.service';

export function autoLogin(): Provider | EnvironmentProviders {
  return {
    provide: APP_INITIALIZER,
    useFactory(service: AuthService) {
      return () => service.refreshToken();
    },
    deps: [AuthService],
    multi: true,
  };
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
    {
      provide: APP_INITIALIZER,
      useFactory(service: TranslateService) {
        return () => {
          let lang = localStorage.getItem(LocalStorageConst.currentLang);

          if (!lang) {
            localStorage.setItem(LocalStorageConst.currentLang, environment.defaultLang);
            lang = environment.defaultLang;
          }

          service.use(lang as string);
        };
      },
      deps: [TranslateService],
      multi: true,
    },
  ];
}
