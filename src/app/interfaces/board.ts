import { IColumn } from './column';

export interface IBoard {
  id: string,
  name: string;
  columns: IColumn;
}
