import { createAction, props } from '@ngrx/store';
import { IBoard } from '../../../interfaces/board';

export const loadBoards = createAction('[Board] Load Boards');
export const loadBoardsSuccess = createAction(
  '[Board] Load Boards Success',
  props<{ boards: IBoard[] }>()
);
export const loadBoardsFailure = createAction(
  '[Board] Load Boards Failure',
  props<{ error: string }>()
);
export const addBoard = createAction(
  '[Board] Add Board',
  props<{ board: IBoard }>()
);
export const updateBoard = createAction(
  '[Board] Update Board',
  props<{ board: IBoard }>()
);
export const deleteBoard = createAction(
  '[Board] Delete Board',
  props<{ id: string }>()
);
export const setSelectedBoard = createAction(
  '[Board] Set Selected Board',
  props<{ board: IBoard }>()
);
