import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IBoard } from '../../interfaces/board';
import {
  selectSelectedBoard,
  selectSelectedBoardId,
} from '../../shared/state/board/board.selectors';
import * as BoardActions from '../../shared/state/board/board.actions';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TaskItemComponent } from './task-item/task-item.component';
import { BoardFormComponent } from '../modal/forms/board-form/board-form.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, AsyncPipe, TaskItemComponent, BoardFormComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  boards$: Observable<IBoard | null | undefined>;

  @Output() createNewColumnClicked = new EventEmitter<void>();

  showBoardForm: boolean = false;

  constructor(private store: Store) {
    this.boards$ = this.store.select(selectSelectedBoard);
  }

  ngOnInit(): void {
    this.store.dispatch(BoardActions.loadBoards()); 
  }

  onCreateBoard() {
    this.showBoardForm = true;
  }

  closeBoardForm() {
    this.showBoardForm = false;
  }

  onSelectBoard(boardId: string) {
    this.store.dispatch(BoardActions.selectBoard({ boardId }));
  }

  onCreateNewColumn() {
    this.createNewColumnClicked.emit();
  }
}
