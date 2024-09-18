import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IBoard } from '../../interfaces/board';
import { selectAllBoards } from '../../shared/state/board/board.selectors';
import * as BoardActions from '../../shared/state/board/board.actions';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  boards$!: Observable<IBoard[]>;
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.boards$ = this.store.select(selectAllBoards);
  }
}
