import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IBoard } from '../../../../interfaces/board';
import { Store } from '@ngrx/store';
import {
  addTask,
  updateTask,
} from '../../../../shared/state/board/board.actions';
import { selectSelectedBoard } from '../../../../shared/state/board/board.selectors';
import { CommonModule } from '@angular/common';
import { ITask } from '../../../../interfaces/task';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit, OnDestroy {
  taskForm: FormGroup;
  board$: Observable<IBoard | null | undefined>;
  statuses: string[] = [];
  currentBoardId!: string;
  private boardSubscription!: Subscription;

  @Input() task: ITask | null = null;
  @Input() taskIndex: number | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() hideMenu = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private store: Store) {
    this.taskForm = this.fb.group({});
    this.board$ = this.store.select(selectSelectedBoard);
  }

  onHideMenu(event: MouseEvent) {
    const clickedInsideForm = (event.target as HTMLElement).closest(
      '.board-form'
    );
    if (!clickedInsideForm) {
      this.close.emit();
    }
  }

  ngOnInit() {
    this.initForm();
    this.boardSubscription = this.board$.subscribe((board) => {
      this.statuses = [];
      if (board) {
        this.currentBoardId = board.id;
        this.statuses = board.columns.map((column) => column.name);
      }
    });

    if (this.task) {
      this.populateFormForEdit();
    }
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      subtasks: this.fb.array([this.fb.control('', Validators.required)]),
      status: ['', Validators.required],
    });
  }

  populateFormForEdit() {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
      });

      this.subtasks.clear();
      this.task.subtasks.forEach((subtask) => {
        this.subtasks.push(this.fb.control(subtask.title, Validators.required));
      });
    }
  }

  get subtasks() {
    return this.taskForm.get('subtasks') as FormArray;
  }

  addSubtask() {
    this.subtasks.push(this.fb.control('', Validators.required));
  }

  removeSubtask(index: number) {
    this.subtasks.removeAt(index);
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const newSubtasks = this.taskForm.value.subtasks.map(
        (subtask: string) => ({ title: subtask, isCompleted: false })
      );

      const taskData: ITask = {
        ...this.taskForm.value,
        subtasks: newSubtasks,
      };

      if (this.task) {
        this.store.dispatch(
          updateTask({
            boardId: this.currentBoardId,
            columnName: this.taskForm.value.status,
            task: taskData,
          })
        );
        console.log('updated task', taskData);
      } else {
        this.store.dispatch(
          addTask({
            boardId: this.currentBoardId,
            columnName: this.taskForm.value.status,
            task: taskData,
          })
        );
      }

      this.taskForm.reset();
      this.close.emit();
    }
  }

  ngOnDestroy() {
    if (this.boardSubscription) {
      this.boardSubscription.unsubscribe();
    }
  }
}
