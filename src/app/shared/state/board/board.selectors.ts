import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BoardState, boardAdapter } from './board.entity';
import { ITask } from '../../../interfaces/task';

export const selectedBoardState = createFeatureSelector<BoardState>('boards');

export const {
  selectIds: selectedIds,
  selectAll: selectAllBoards,
  selectTotal: selectTotalBoards,
  selectEntities: selectBoardEntity,
} = boardAdapter.getSelectors(selectedBoardState);

export const selectSelectedBoardId = createSelector(
  selectedBoardState,
  (state) => state.selectedBoardId
);

export const selectSelectedBoard = createSelector(
  selectedBoardState,
  selectSelectedBoardId,
  (state) => state.selectedBoard
);

export const selectColumnsForSelectedBoard = createSelector(
  selectSelectedBoard,
  (board) => board?.columns || []
);

export const selectNextId = createSelector(
  selectedBoardState,
  (state: BoardState) => state.selectedBoardId
);

export const selectTasksForColumn = (columnName: string) =>
  createSelector(
    selectColumnsForSelectedBoard,
    (columns) => columns.find((col) => col.name === columnName)?.tasks || []
  );

export const selectAllTasks = createSelector(
  selectColumnsForSelectedBoard,
  (columns): ITask[] =>
    columns.reduce<ITask[]>((allTasks, col) => [...allTasks, ...col.tasks], []) // Aggregate tasks from all columns
);
