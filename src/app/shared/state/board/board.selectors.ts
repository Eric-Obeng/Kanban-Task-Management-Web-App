import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BoardState, boardAdapter } from './board.entity';

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
  (state, selectedBoard) => state.selectedBoard
);
