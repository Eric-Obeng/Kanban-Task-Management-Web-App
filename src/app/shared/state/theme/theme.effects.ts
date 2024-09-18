import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as ThemeActions from './theme.actions';
import { ThemeService } from '../../services/theme.service';

@Injectable()
export class ThemeEffect {
  constructor(private actions$: Actions, private themeService: ThemeService) {}

  loadTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeActions.loadTheme),
      map(() => {
        const currentTheme = this.themeService.getTheme();
        console.log(currentTheme);
        return ThemeActions.setTheme({ theme: currentTheme });
      })
    )
  );

  toggleTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeActions.toggleTheme),
      map(() => {
        const currentTheme = this.themeService.switchTheme(); // Get the updated theme
        return ThemeActions.setTheme({ theme: currentTheme }); // Dispatch setTheme with new theme
      })
    )
  );
}
