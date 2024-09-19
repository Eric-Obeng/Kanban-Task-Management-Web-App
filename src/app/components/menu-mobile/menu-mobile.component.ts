import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeComponent } from '../theme/theme.component';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../shared/services/board.service';
import { Store } from '@ngrx/store';
import { setSelectedBoard } from '../../shared/state/board/board.actions';
import { IBoard } from '../../interfaces/board';

@Component({
  selector: 'app-menu-mobile',
  standalone: true,
  imports: [ThemeComponent, CommonModule],
  templateUrl: './menu-mobile.component.html',
  styleUrl: './menu-mobile.component.scss',
})
export class MenuMobileComponent {
  boards = this.boardService.boards$;
  totalBoards = this.boardService.totalBoards$;

  @Output() hideMenu = new EventEmitter<void>();

  @Input() showSideBar!: boolean;

  constructor(private boardService: BoardService, private store: Store) {}

  onHideMenu() {
    this.hideMenu.emit();
  }

  onBoardClicK(board: IBoard) {
    this.store.dispatch(setSelectedBoard({ board }));
    console.log(board);
  }
}
