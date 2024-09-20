import { createAction, props } from '@ngrx/store';
import { IBoard } from '../../../interfaces/board';
import { ITask } from '../../../interfaces/task';
import { IColumn } from '../../../interfaces/column';

export const loadBoards = createAction('[Board] Load Boards');
export const loadBoardsSuccess = createAction(
  '[Board] Load Boards Success',
  props<{ boards: IBoard[] }>()
);
export const loadBoardsFailure = createAction(
  '[Board] Load Boards Failure',
  props<{ error: string }>()
);
// Board actions
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

// column actions
export const addColumn = createAction(
  '[Board] Add Column',
  props<{ boardId: string; column: IColumn }>()
);

export const updateColumn = createAction(
  '[Board] Add Column',
  props<{ boardId: string; column: IColumn }>()
);

export const selectBoard = createAction(
  '[Board] Select Board',
  props<{ boardId: string }>()
);

export const setSelectedBoard = createAction(
  '[Board] Set Selected Board',
  props<{ board: IBoard }>()
);
export const clearSelectedBoard = createAction('[Board] Clear Selected Board');
export const moveTaskInColumn = createAction(
  '[Board] Move Task In Column',
  props<{ columnId: string; previousIndex: number; currentIndex: number }>()
);

export const addTask = createAction(
  '[Board] Add Task',
  props<{
    boardId: string;
    columnName: string;
    task: ITask;
  }>()
);

export const updateTask = createAction(
  '[Task] Update Task',
  props<{
    boardId: number;
    columnName: string;
    task: ITask;
  }>()
);

export const moveTask = createAction(
  '[Board] Move Task',
  props<{
    boardId: string;
    sourceColumn: string;
    targetColumn: string;
    taskId: string;
  }>()
);
