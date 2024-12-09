import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { routes } from './app.routes';
import { ApiService } from './services/api.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { SubjectUtilService } from './services/subject-util.service';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(...[BrowserAnimationsModule], ApiService, HttpClientModule),
   MessageService, SubjectUtilService,
   { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },]
};
