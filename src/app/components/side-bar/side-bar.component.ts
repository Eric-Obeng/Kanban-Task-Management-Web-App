import { Component } from '@angular/core';
import { MenuMobileComponent } from '../menu-mobile/menu-mobile.component';
import { ThemeComponent } from '../theme/theme.component';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../shared/services/board.service';
import { Store } from '@ngrx/store';
import { setSelectedBoard } from '../../shared/state/board/board.actions';
import { IBoard } from '../../interfaces/board';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MenuMobileComponent, ThemeComponent, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  boards = this.boardService.boards$;
  totalBoards = this.boardService.totalBoards$;

  constructor(private boardService: BoardService, private store: Store) {}

  onBoardClicK(board: IBoard) {
    this.store.dispatch(setSelectedBoard({ board }));
    console.log(board);
  }
}
