import { createReducer, on } from '@ngrx/store';
import * as BoardActions from './board.actions';
import { boardAdapter, initialBoardState } from './board.entity';

export const boardReducer = createReducer(
  initialBoardState,
  on(BoardActions.loadBoardsSuccess, (state, { boards }) => {
    console.log('Reducer', boards);
    return boardAdapter.setAll(boards, state);
  })
);
