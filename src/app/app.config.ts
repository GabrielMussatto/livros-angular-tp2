import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { MatPaginatorIntlPtBr } from './services/paginator-ptbr-i8n';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr},
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(withInterceptorsFromDi()), 
    provideAnimationsAsync(),
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    MatNativeDateModule
  ]
};
