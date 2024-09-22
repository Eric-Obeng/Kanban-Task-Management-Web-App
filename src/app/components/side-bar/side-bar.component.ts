import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MenuMobileComponent } from '../menu-mobile/menu-mobile.component';
import { ThemeComponent } from '../theme/theme.component';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../shared/services/board.service';
import { Store } from '@ngrx/store';
import {
  selectBoard,
  setSelectedBoard,
} from '../../shared/state/board/board.actions';
import { IBoard } from '../../interfaces/board';
import {
  selectSelectedBoard,
  selectSelectedBoardId,
} from '../../shared/state/board/board.selectors';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MenuMobileComponent, ThemeComponent, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  dataService = inject(BoardService);

  boards = this.dataService.boards$;
  totalBoards = this.dataService.totalBoards$;
  selectedBoard$ = this.store.select(selectSelectedBoard);

  showSidebar: boolean = true;

  @Output() createBoardClicked = new EventEmitter<void>();

  constructor(private store: Store) {}

  onBoardClick(board: IBoard) {
    this.store.dispatch(setSelectedBoard({ board }));
    localStorage.setItem('selectedBoard', JSON.stringify(board));
    console.log(board);
    this.dataService.selectBoard(board);
    console.log('Board clicked and selected:', board);
  }

  hideSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  onCreateNewBoard() {
    this.createBoardClicked.emit();
  }
}
