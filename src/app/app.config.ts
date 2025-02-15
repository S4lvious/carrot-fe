import { provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import  MyPreset  from '../mypreset'
import { authenticationInterceptor } from './interceptors/auth.iterceptor';
import { MessageService } from 'primeng/api';
import { Toast, ToastModule } from 'primeng/toast';
import { errorInterceptor } from './interceptors/error.interceptor';
export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withInterceptors([authenticationInterceptor, errorInterceptor])),
        provideAnimationsAsync(),
        MessageService,
        importProvidersFrom(ToastModule),
        providePrimeNG({ theme: { preset: MyPreset } }),
    ]
};