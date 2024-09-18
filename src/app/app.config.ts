import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { BoardEffects } from './shared/state/board/board.effetcs';
import { boardReducer } from './shared/state/board/board.reducers';
import { ThemeEffect } from './shared/state/theme/theme.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideStore(),
    provideState({
      name: 'boards',
      reducer: boardReducer,
    }),
    provideEffects(BoardEffects, ThemeEffect),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
