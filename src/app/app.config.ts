import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { MatPaginatorIntlPtBr } from './services/paginator-ptbr-i8n';

export const appConfig: ApplicationConfig = {
  providers: [
    {provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr},
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(), 
    provideAnimationsAsync(),
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    MatNativeDateModule
  ]
};
