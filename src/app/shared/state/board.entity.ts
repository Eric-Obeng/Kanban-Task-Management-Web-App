import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { IBoard } from '../../interfaces/board';

export interface BoardState extends EntityState<IBoard> {}

export const boardAdapter: EntityAdapter<IBoard> = createEntityAdapter<IBoard>({
  selectId: (board: IBoard) => board.id,
  sortComparer: (a: IBoard, b: IBoard) => a.name.localeCompare(b.name),
});

export const initialBoardState: BoardState = boardAdapter.getInitialState();
