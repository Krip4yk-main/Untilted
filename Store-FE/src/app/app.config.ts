import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { intercept } from './core/guards/auth.interseptor';
import { definePreset } from '@primeuix/themes';

const MIARPreset = definePreset(Aura, {
    semantic: {
        primary: {
            '50': '#fefdfa',
            '100': '#fcf7e8',
            '200': '#f9f1d7',
            '300': '#f7ebc5',
            '400': '#f4e4b3',
            '500': '#f2dea1',
            '600': '#cebd89',
            '700': '#a99b71',
            '800': '#857a59',
            '900': '#615940',
            '950': '#3d3828',
        },
        colorScheme: {
            dark: {
                surface: {
                    '0': '#ffffff',
                    '50': '#fafafa',
                    '100': '#e5e5e5',
                    '200': '#d0d0d0',
                    '300': '#bbbbbb',
                    '400': '#a6a6a6',
                    '500': '#919191',
                    '600': '#7b7b7b',
                    '700': '#7b7b7b',
                    '800': '#505050',
                    '900': '#3a3a3a',
                    '950': '#242424',
                },
            },
        },
    },
});

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes),
        provideHttpClient(withInterceptors([intercept])),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: MIARPreset,
                options: {
                    darkModeSelector: '.dark-mode',
                },
            },
        }),
    ],
};
