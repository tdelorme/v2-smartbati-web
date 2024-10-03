import {ApplicationConfig, importProvidersFrom, Provider, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import { JwtModule } from "@auth0/angular-jwt";

import {routes} from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi} from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpRequestInterceptor } from './shared/http.request.interceptor';

export function tokenGetter() {
  return localStorage.getItem('token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter
        }
      }),
    ),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    {provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true},
    provideAnimationsAsync(),
    provideAnimationsAsync()
  ]
};
