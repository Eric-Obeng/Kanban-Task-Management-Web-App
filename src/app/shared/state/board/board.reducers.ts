import { createReducer, on } from '@ngrx/store';
import * as BoardActions from './board.actions';
import { boardAdapter, initialBoardState } from '../board/board.entity';
import { ITask } from '../../../interfaces/task';
import { IBoard } from '../../../interfaces/board';

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
  on(BoardActions.updateBoard, (state, { board }) => {
    const newState = boardAdapter.updateOne(
      { id: board.id, changes: board },
      state
    );

    // Update localStorage
    const updatedSelectedBoard =
      newState.selectedBoard?.id === board.id ? board : newState.selectedBoard;
    localStorage.setItem('selectedBoard', JSON.stringify(updatedSelectedBoard));

    return {
      ...newState,
      selectedBoard: updatedSelectedBoard,
    };
  }),
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
    if (!board) return state;

    // Add the task to the specified column
    const updatedColumns = board.columns.map((col) =>
      col.name === columnName ? { ...col, tasks: [...col.tasks, task] } : col
    );

    // Create the updated board with the new task added to the column
    const updatedBoard = {
      ...board,
      columns: updatedColumns,
    };

    // Update the state with the updated board entity
    const newState = boardAdapter.updateOne(
      { id: board.id, changes: updatedBoard },
      state
    );

    // Update selectedBoard if the boardId matches
    const updatedSelectedBoard =
      newState.selectedBoard?.id === boardId
        ? updatedBoard
        : newState.selectedBoard;

    // Persist the updated selectedBoard in localStorage
    localStorage.setItem('selectedBoard', JSON.stringify(updatedSelectedBoard));

    // Return the new state with updated selectedBoard
    return {
      ...newState,
      selectedBoard: updatedSelectedBoard,
    };
  }),
  on(BoardActions.updateTask, (state, { boardId, columnName, task }) => {
    const board = state.entities[boardId];
    if (!board) return state;

    // Update the task in the specified column
    const updatedColumns = board.columns.map((col) =>
      col.name === columnName
        ? {
            ...col,
            tasks: col.tasks.map((t) => (t.title === task.title ? task : t)),
          }
        : col
    );

    // Create the updated board with modified columns
    const updatedBoard = {
      ...board,
      columns: updatedColumns,
    };

    // Update selectedBoard if the boardId matches
    const updatedSelectedBoard =
      state.selectedBoard?.id === boardId ? updatedBoard : state.selectedBoard;

    // Persist the updated selectedBoard in localStorage
    localStorage.setItem('selectedBoard', JSON.stringify(updatedSelectedBoard));

    // Update both the board entity and the selectedBoard
    return boardAdapter.updateOne(
      { id: board.id, changes: updatedBoard },
      {
        ...state,
        selectedBoard: updatedSelectedBoard,
      }
    );
  }),
  // Move task between columns
  on(
    BoardActions.moveTask,
    (state, { boardId, sourceColumn, targetColumn, taskId }) => {
      const board = state.entities[boardId];
      if (!board) return state;

      // Remove task from the source column and add to the target column
      const updatedColumns = board.columns.map((col) => {
        if (col.name === sourceColumn) {
          return {
            ...col,
            tasks: col.tasks.filter((task) => task.title !== taskId),
          };
        } else if (col.name === targetColumn) {
          const task = board.columns
            .find((col) => col.name === sourceColumn)
            ?.tasks.find((task) => task.title === taskId);
          return task ? { ...col, tasks: [...col.tasks, task] } : col;
        } else {
          return col;
        }
      });

      const updatedBoard = { ...board, columns: updatedColumns };

      // Update localStorage
      const updatedBoards = updateBoardInStorage(boardId, updatedBoard);

      return {
        ...state,
        entities: { ...state.entities, [boardId]: updatedBoard },
        selectedBoard: updatedBoard,
      };
    }
  )
);

export const { selectAll, selectEntities } = boardAdapter.getSelectors();

function updateBoardInStorage(boardId: string, updatedBoard: IBoard) {
  const boards = JSON.parse(localStorage.getItem('boards') || '[]');
  const updatedBoards = boards.map((b: IBoard) =>
    b.id === boardId ? updatedBoard : b
  );
  localStorage.setItem('boards', JSON.stringify(updatedBoards));
  localStorage.setItem('selectedBoard', JSON.stringify(updatedBoard));
  return updatedBoards;
}
