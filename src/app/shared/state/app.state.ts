import { BoardState } from './board/board.entity';
import { ThemeState } from './theme/theme.state';

export interface AppState {
  board: BoardState;
  theme: ThemeState;
}
