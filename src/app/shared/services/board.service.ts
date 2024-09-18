import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBoard } from '../../interfaces/board';
import { Store } from '@ngrx/store';
import {
  selectAllBoards,
  selectTotalBoards,
} from '../state/board/board.selectors';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  totalBoards$!: Observable<number>;
  boards$!: Observable<IBoard[]>;

  constructor(private store: Store) {
    this.totalBoards$ = this.store.select(selectTotalBoards);
    this.boards$ = this.store.select(selectAllBoards);
  }
}
