import { createReducer, on } from '@ngrx/store';
import * as ThemeActions from './theme.actions';
import { initialThemeState } from './theme.state';

export const themeReducer = createReducer(
  initialThemeState,
  on(ThemeActions.toggleTheme, (state) => ({
    ...state,
    currentTheme: state.theme === 'light' ? 'dark' : 'light',
  })),
  on(ThemeActions.setTheme, (state, { theme }) => ({ ...state, theme }))
);
