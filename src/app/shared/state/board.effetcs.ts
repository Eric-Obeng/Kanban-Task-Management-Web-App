import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../services/api.service';
import * as BoardActions from './board.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { IBoardData } from '../../interfaces/board-data';
import { IBoard } from '../../interfaces/board';

@Injectable()
export class BoardEffects {
  constructor(private apiService: ApiService, private actions$: Actions) {}

  loadBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.loadBoards),
      mergeMap(() => {
        const saveLocalStorage = localStorage.getItem('boards');

        if (saveLocalStorage) {
          const boards: IBoard[] = JSON.parse(saveLocalStorage);
          return of(BoardActions.loadBoardsSuccess({ boards }));
        } else {
          // Fetch boards from the API
          return this.apiService.getAllBoards().pipe(
            map((response) => {
              const boards: IBoard[] = response.boards;
              return BoardActions.loadBoardsSuccess({ boards });
            }),
            catchError((error) =>
              of(BoardActions.loadBoardsFailure({ error: error.message }))
            )
          );
        }
      })
    )
  );
}
