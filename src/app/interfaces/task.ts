import { ISubtask } from './subtask';

export interface ITask {
  title: string;
  description: string;
  status: string;
  subtasks: ISubtask;
}
