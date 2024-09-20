import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeComponent } from '../theme/theme.component';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../shared/services/board.service';
import { Store } from '@ngrx/store';
import {
  selectBoard,
  setSelectedBoard,
} from '../../shared/state/board/board.actions';
import { IBoard } from '../../interfaces/board';
import { Observable } from 'rxjs';
import { selectSelectedBoard } from '../../shared/state/board/board.selectors';

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
  selectedBoard$!: Observable<IBoard | undefined | null>;

  @Output() hideMenu = new EventEmitter<void>();
  @Input() showSideBar!: boolean;

  @Output() createBoardClicked = new EventEmitter<void>();

  constructor(private boardService: BoardService, private store: Store) {
    this.selectedBoard$ = this.store.select(selectSelectedBoard);
  }

  onHideMenu() {
    this.hideMenu.emit();
  }

  onBoardClick(board: IBoard) {
    this.store.dispatch(setSelectedBoard({ board }));
    localStorage.setItem('selectedBoard', JSON.stringify(board)); // Save to local storage
    console.log(board);
  }

  onCreateNewBoard() {
    this.createBoardClicked.emit();
  }
}
