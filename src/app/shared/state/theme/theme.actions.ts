import { createAction, props } from '@ngrx/store';

export const toggleTheme = createAction('[Theme] Toggle Theme');
export const setTheme = createAction(
  '[Theme] Set Theme',
  props<{ theme: string }>()
);
export const loadTheme = createAction('[Theme] Load Theme');
