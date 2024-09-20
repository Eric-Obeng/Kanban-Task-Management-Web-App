import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../services/api.service';
import * as BoardActions from './board.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { IBoard } from '../../../interfaces/board';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BoardEffects {
  constructor(private apiService: ApiService, private actions$: Actions) {}

  loadBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.loadBoards),
      mergeMap(() => {
        const savedLocalStorage = localStorage.getItem('boards');

        if (savedLocalStorage) {
          const boards: IBoard[] = JSON.parse(savedLocalStorage);
          return of(BoardActions.loadBoardsSuccess({ boards }));
        } else {
          // Fetch boards from the API if not found in localStorage
          return this.apiService.getAllBoards().pipe(
            map((response) => {
              const boards: IBoard[] = response.boards.map((board) => ({
                ...board,
                id: uuidv4(),
              }));
              return boards;
            }),
            tap((boards: IBoard[]) => {
              // Save the boards to localStorage
              localStorage.setItem('boards', JSON.stringify(boards));
            }),
            map((boards: IBoard[]) =>
              BoardActions.loadBoardsSuccess({ boards })
            ),
            catchError((error) =>
              of(BoardActions.loadBoardsFailure({ error: error.message }))
            )
          );
        }
      })
    )
  );
}
