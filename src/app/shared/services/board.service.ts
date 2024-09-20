import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IBoard } from '../../interfaces/board';
import { Store } from '@ngrx/store';
import {
  selectAllBoards,
  selectTotalBoards,
} from '../state/board/board.selectors';
import { setSelectedBoard } from '../state/board/board.actions';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  totalBoards$!: Observable<number>;
  boards$!: Observable<IBoard[]>;
  selectedBoard = new BehaviorSubject<IBoard | null | undefined>(null);

  constructor(private store: Store) {
    this.totalBoards$ = this.store.select(selectTotalBoards);
    this.boards$ = this.store.select(selectAllBoards);
    this.loadSelectedBoard();
  }

  private loadSelectedBoard() {
    const savedBoard = localStorage.getItem('selectedBoard');
    if (savedBoard) {
      const board: IBoard = JSON.parse(savedBoard);
      this.store.dispatch(setSelectedBoard({ board }));
    }
  }
}
