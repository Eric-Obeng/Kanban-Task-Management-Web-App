import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IBoard } from '../../interfaces/board';
import {
  selectAllBoards,
  selectSelectedBoard,
} from '../../shared/state/board/board.selectors';
import * as BoardActions from '../../shared/state/board/board.actions';
import { AsyncPipe, CommonModule } from '@angular/common';
import { BoardItemComponent } from './board-item/board-item.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, AsyncPipe, BoardItemComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  boards$!: Observable<IBoard | null | undefined>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.boards$ = this.store.select(selectSelectedBoard)
    console.log(this.boards$);
  }
}
