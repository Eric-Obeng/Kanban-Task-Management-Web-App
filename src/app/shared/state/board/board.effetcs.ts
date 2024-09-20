import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../services/api.service';
import * as BoardActions from './board.actions';
import { catchError, map, mergeMap, of, switchMap, take, tap } from 'rxjs';
import { IBoard } from '../../../interfaces/board';
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageService } from '../../services/localStorage/local-storage.service';
import { selectAll } from './board.reducers';
import { select, Store } from '@ngrx/store';
import { selectAllBoards } from './board.selectors';

@Injectable()
export class BoardEffects {
  constructor(
    private apiService: ApiService,
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private store: Store
  ) {}

  loadBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.loadBoards),
      mergeMap(() => {
        const savedLocalStorage = localStorage.getItem('boards');
        if (savedLocalStorage) {
          const boards: IBoard[] = JSON.parse(savedLocalStorage);
          return of(BoardActions.loadBoardsSuccess({ boards }));
        } else {
          return this.apiService.getAllBoards().pipe(
            map((response) => {
              const boards: IBoard[] = response.boards.map((board) => ({
                ...board,
                id: uuidv4(),
              }));
              return boards;
            }),
            tap((boards: IBoard[]) => {
              this.localStorageService.setItem('boards', boards);
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

  saveBoardsToLocalStorage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          BoardActions.addBoard,
          BoardActions.updateBoard,
          BoardActions.deleteBoard,
          BoardActions.loadBoardsSuccess
        ),
        switchMap(() =>
          this.store.pipe(
            select(selectAllBoards),
            take(1),
            tap((boards) => this.localStorageService.setItem('boards', boards)),
            catchError((error) => {
              console.error('Error saving boards to local storage', error);
              return of();
            })
          )
        )
      ),
    { dispatch: false }
  );
}
