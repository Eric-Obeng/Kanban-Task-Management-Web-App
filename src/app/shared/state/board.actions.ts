import { createAction, props } from '@ngrx/store';
import { IBoard } from '../../interfaces/board';

export const loadBoards = createAction('[Board] Load Boards');
export const loadBoardsSuccess = createAction(
  '[Board] Load Boards Success',
  props<{ boards: IBoard[] }>()
);
export const loadBoardsFailure = createAction(
  '[Board] Load Boards Failure',
  props<{ error: string }>()
);
