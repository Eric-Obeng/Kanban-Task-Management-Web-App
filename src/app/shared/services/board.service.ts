import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { IBoard } from '../../interfaces/board';
import { ITask } from '../../interfaces/task';
import * as BoardActions from '../state/board/board.actions';
import {
  selectAllBoards,
  selectSelectedBoard,
  selectTotalBoards,
} from '../state/board/board.selectors';
import { getRandomColor } from '../state/utils/generateColors';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private selectedBoardSubject = new BehaviorSubject<IBoard | null | undefined>(
    null
  );
  selectedBoard$: Observable<IBoard | null | undefined>;
  boards$: Observable<IBoard[]>;
  totalBoards$: Observable<number>;
  color: string[] = [];

  constructor(private store: Store) {
    this.selectedBoard$ = this.selectedBoardSubject.asObservable();
    this.boards$ = this.store.select(selectAllBoards);
    this.totalBoards$ = this.store.select(selectTotalBoards);

    this.store.select(selectSelectedBoard).subscribe((board) => {
      this.selectedBoardSubject.next(board);
    });
  }

  selectBoard(board: IBoard) {
    board.columns.forEach(() => {
      this.color.push(getRandomColor());
    });
    this.store.dispatch(BoardActions.setSelectedBoard({ board }));
  }

  addBoard(board: IBoard) {
    this.store.dispatch(BoardActions.addBoard({ board }));
    this.selectBoard(board);
  }

  updateBoard(board: IBoard) {
    this.store.dispatch(BoardActions.updateBoard({ board }));
    this.selectBoard(board);
  }

  updateTask(updatedTask: ITask) {
    this.store
      .select(selectSelectedBoard)
      .pipe(take(1))
      .subscribe((board) => {
        if (board) {
          const updatedBoard = {
            ...board,
            columns: board.columns.map((column) => ({
              ...column,
              tasks: column.tasks.map((task) =>
                task.title === updatedTask.title ? updatedTask : task
              ),
            })),
          };
          this.updateBoard(updatedBoard);
        }
      });
  }
}
