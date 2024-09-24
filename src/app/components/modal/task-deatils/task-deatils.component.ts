import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ChangeDetectorRef,
  OnInit,
  OnChanges,
} from '@angular/core';
import { ActionsComponent } from '../actions/actions.component';
import { ITask } from '../../../interfaces/task';
import { TaskFormComponent } from '../forms/task-form/task-form.component';
import { IBoard } from '../../../interfaces/board';
import { BoardService } from '../../../shared/services/board.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as BoardActions from '../../../shared/state/board/board.actions';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [ActionsComponent, TaskFormComponent, CommonModule],
  templateUrl: './task-deatils.component.html',
  styleUrls: ['./task-deatils.component.scss'],
})
export class TaskDetailsComponent implements OnInit, OnChanges {
  @Output() hideMenu = new EventEmitter<void>();
  @Input() task!: ITask;
  @Output() taskChange = new EventEmitter<ITask>();
  board$!: Observable<IBoard | null | undefined>;
  completedSubtaskCount = 0;
  statuses: string[] = [];
  boardId!: string;

  showTaskForm = false;

  constructor(
    private boardService: BoardService,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.boardService.selectedBoard$.subscribe((board) => {
      if (board) {
        this.statuses = board.columns.map((column) => column.name);
        this.boardId = board.id;
      }
    });
    this.updateCompletedSubtaskCount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.updateCompletedSubtaskCount();
    }
  }

  markAsCompleted(index: number, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const isCompleted = checkbox.checked;

    const updatedTask = {
      ...this.task,
      subtasks: this.task.subtasks.map((subtask, i) =>
        i === index ? { ...subtask, isCompleted } : subtask
      ),
    };

    // Dispatch the action with the boardId
    this.store.dispatch(
      BoardActions.updateTask({
        boardId: this.boardId,
        columnName: this.task.status,
        task: updatedTask,
      })
    );

    this.taskChange.emit(updatedTask);
    this.updateCompletedSubtaskCount();
  }

  private updateCompletedSubtaskCount() {
    this.completedSubtaskCount = this.task.subtasks.filter(
      (subtask) => subtask.isCompleted
    ).length;
    this.cdr.detectChanges();
  }

  onStatusChange(event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    if (newStatus !== this.task.status) {
      this.store.dispatch(
        BoardActions.moveTask({
          boardId: this.boardId,
          sourceColumn: this.task.status,
          targetColumn: newStatus,
          taskId: this.task.title,
        })
      );

      // Emit the updated task with the new status
      this.taskChange.emit({ ...this.task, status: newStatus });
    }
  }

  openForm() {
    this.showTaskForm = true;
  }

  onHideMenu() {
    this.hideMenu.emit();
  }
}
