import { createReducer, on } from '@ngrx/store';
import * as BoardActions from './board.actions';
import { boardAdapter, initialBoardState } from '../board/board.entity';

export const boardReducer = createReducer(
  initialBoardState,
  on(BoardActions.loadBoardsSuccess, (state, { boards }) => {
    console.log('Reducer', boards);
    return boardAdapter.setAll(boards, state);
  }),
  on(BoardActions.loadBoardsFailure, (state, { error }) => {
    console.error('Error loading boards:', error);
    return state;
  }),
  on(BoardActions.addBoard, (state, { board }) =>
    boardAdapter.addOne(board, state)
  ),
  on(BoardActions.updateBoard, (state, { board }) =>
    boardAdapter.updateOne({ id: board.id, changes: board }, state)
  ),
  on(BoardActions.deleteBoard, (state, { id }) =>
    boardAdapter.removeOne(id, state)
  ),
  on(
    BoardActions.setSelectedBoard,
    (state, { board }) => (
      console.log(state),
      {
        ...state,
        selectedBoard: board,
      }
    )
  )
);

export const { selectAll, selectEntities } = boardAdapter.getSelectors();
