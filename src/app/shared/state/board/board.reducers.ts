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

      // Find source and target columns
      const sourceCol = board.columns.find((col) => col.name === sourceColumn);
      const targetCol = board.columns.find((col) => col.name === targetColumn);
      if (!sourceCol || !targetCol) return state;

      // Find task to move from the source column
      const taskToMove = sourceCol.tasks.find((task) => task.title === taskId);
      if (!taskToMove) return state;

      // Remove task from the source column
      const updatedSourceColumn = {
        ...sourceCol,
        tasks: sourceCol.tasks.filter((task) => task.title !== taskId), // Remove task
      };

      // Add task to the target column at the last index
      const updatedTargetColumn = {
        ...targetCol,
        tasks: [...targetCol.tasks, taskToMove], // Append task to the end
      };

      // Update columns in the board
      const updatedColumns = board.columns.map((col) =>
        col.name === sourceColumn
          ? updatedSourceColumn
          : col.name === targetColumn
          ? updatedTargetColumn
          : col
      );

      // Update the board with the modified columns
      const updatedBoard = {
        ...board,
        columns: updatedColumns,
      };

      // Update selectedBoard in state
      const updatedSelectedBoard =
        state.selectedBoard?.id === boardId
          ? updatedBoard
          : state.selectedBoard;

      // Save the updated board to localStorage
      localStorage.setItem(
        'selectedBoard',
        JSON.stringify(updatedSelectedBoard)
      );

      // Update the board entity and selectedBoard
      return boardAdapter.updateOne(
        { id: board.id, changes: updatedBoard },
        {
          ...state,
          selectedBoard: updatedSelectedBoard,
        }
      );
    }
  )
);

export const { selectAll, selectEntities } = boardAdapter.getSelectors();
