import { createReducer, on } from '@ngrx/store';
import * as BoardActions from './board.actions';
import { boardAdapter, initialBoardState } from '../board/board.entity';

export const boardReducer = createReducer(
  initialBoardState,
  on(BoardActions.loadBoardsSuccess, (state, { boards }) => {
    console.log('Reducer', boards);
    return boardAdapter.setAll(boards, state);
  }),
  on(BoardActions.loadBoardsFailure, (state, { error }) => {
    console.error('Error loading boards:', error);
    return state;
  }),
  on(BoardActions.selectBoard, (state, { boardId }) => ({
    ...state,
    selectedBoardId: boardId,
    selectedBoard: state.entities[boardId] || null,
  })),
  on(BoardActions.addBoard, (state, { board }) =>
    boardAdapter.addOne(board, state)
  ),
  on(BoardActions.updateBoard, (state, { board }) =>
    boardAdapter.updateOne({ id: board.id, changes: board }, state)
  ),
  on(BoardActions.deleteBoard, (state, { id }) =>
    boardAdapter.removeOne(id, state)
  ),
  on(
    BoardActions.setSelectedBoard,
    (state, { board }) => (
      console.log(state),
      {
        ...state,
        selectedBoard: board,
      }
    )
  ),
  on(BoardActions.clearSelectedBoard, (state) => ({
    ...state,
    selectedBoard: null,
  })),
  // column reducers
  on(BoardActions.addColumn, (state, { boardId, column }) => {
    const board = state.entities[boardId];
    if (!board) return state;

    const updatedBoard = {
      ...board,
      columns: [...board.columns, column],
    };
    return boardAdapter.updateOne(
      { id: board.id, changes: updatedBoard },
      state
    );
  }),
  on(BoardActions.updateColumn, (state, { boardId, column }) => {
    const board = state.entities[boardId];
    if (!board) return state;

    const updatedColumns = board.columns.map((col) =>
      col.name === column.name ? column : col
    );

    const updatedBoard = {
      ...board,
      columns: updatedColumns,
    };

    return boardAdapter.updateOne(
      { id: board.id, changes: updatedBoard },
      state
    );
  }),

  // task reducers
  on(BoardActions.addTask, (state, { boardId, columnName, task }) => {
    const board = state.entities[boardId];

    if (!board) {
      return state;
    }
    const updatedColumns = board.columns.map((col) =>
      col.name === columnName ? { ...col, tasks: [...col.tasks, task] } : col
    );

    const updatedBoard = {
      ...board,
      columns: updatedColumns,
    };

    return boardAdapter.updateOne(
      { id: board.id, changes: updatedBoard },
      state
    );
  }),
  on(BoardActions.updateTask, (state, { boardId, columnName, task }) => {
    const board = state.entities[boardId];
    if (!board) return state;

    const updatedColumns = board.columns.map((col) =>
      col.name === columnName
        ? {
            ...col,
            tasks: col.tasks.map((t) => (t.title === task.title ? task : t)),
          }
        : col
    );

    const updatedBoard = {
      ...board,
      columns: updatedColumns,
    };

    return boardAdapter.updateOne(
      { id: board.id, changes: updatedBoard },
      state
    );
  }),
  // Move task between columns
  on(
    BoardActions.moveTask,
    (state, { boardId, sourceColumn, targetColumn, taskId }) => {
      const board = state.entities[boardId];
      if (!board) return state;

      const sourceCol = board.columns.find((col) => col.name === sourceColumn);
      const targetCol = board.columns.find((col) => col.name === targetColumn);
      if (!sourceCol || !targetCol) return state;

      const taskToMove = sourceCol.tasks.find((task) => task.title === taskId);
      if (!taskToMove) return state;

      const updatedSourceColumn = {
        ...sourceCol,
        tasks: sourceCol.tasks.filter((task) => task.title !== taskId),
      };

      const updatedTargetColumn = {
        ...targetCol,
        tasks: [...targetCol.tasks, taskToMove],
      };

      const updatedColumns = board.columns.map((col) =>
        col.name === sourceColumn
          ? updatedSourceColumn
          : col.name === targetColumn
          ? updatedTargetColumn
          : col
      );

      const updatedBoard = {
        ...board,
        columns: updatedColumns,
      };

      return boardAdapter.updateOne(
        { id: board.id, changes: updatedBoard },
        state
      );
    }
  )
);

export const { selectAll, selectEntities } = boardAdapter.getSelectors();
