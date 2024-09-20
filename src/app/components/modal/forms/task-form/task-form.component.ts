import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { addTask } from '../../../../shared/state/board/board.actions';
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
export class TaskFormComponent {
  taskForm: FormGroup;
  board$: Observable<IBoard | null | undefined>;
  statuses: string[] = [];
  currentBoardId!: string;
  private boardSubscription!: Subscription;

  @Input() task!: ITask
  @Output() close = new EventEmitter<void>();
  @Output() hideMenu = new EventEmitter<void>();

  onHideMenu(event: MouseEvent) {
    if (event) {
      const clickedInsideForm = (event.target as HTMLElement).closest(
        '.board-task'
      );
      if (!clickedInsideForm) {
        this.close.emit();
      }
    }
    console.log('hide me');
  }

  constructor(private fb: FormBuilder, private store: Store) {
    this.taskForm = this.fb.group({});
    this.board$ = this.store.select(selectSelectedBoard);
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
  }

  initForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      subtasks: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
      status: ['', Validators.required],
    });
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
        (subtask: string) => {
          return { title: subtask, isCompleted: false };
        }
      );
      console.log(this.taskForm.value);
      this.store.dispatch(
        addTask({
          boardId: this.currentBoardId,
          columnName: this.taskForm.value.status,
          task: {
            ...this.taskForm.value,
            subtasks: newSubtasks,
          },
        })
      );
      this.taskForm.reset();
    } else {
      console.log(this.taskForm.errors);
    }
  }

  ngOnDestroy() {
    if (this.boardSubscription) {
      this.boardSubscription.unsubscribe();
    }
  }
}
