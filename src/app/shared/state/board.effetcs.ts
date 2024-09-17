import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../services/api.service';
import * as BoardActions from './board.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { IBoardData } from '../../interfaces/board-data';

@Injectable()
export class BoardEffects {
  constructor(private apiService: ApiService, private actions$: Actions) {}

  loadBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.loadBoards),
      mergeMap(() =>
        this.apiService.getAllBoards().pipe(
          map((response: IBoardData) =>
            // Extract the boards array from the response and pass it to the action
            BoardActions.loadBoardsSuccess({ boards: response.boards })
          ),
          catchError((error) =>
            of(BoardActions.loadBoardsFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
