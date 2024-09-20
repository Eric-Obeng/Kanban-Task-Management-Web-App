import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import * as BoardAsctions from '../../../../shared/state/board/board.actions';
import { IBoard } from '../../../../interfaces/board';
import { Subscription } from 'rxjs';
import { selectNextId } from '../../../../shared/state/board/board.selectors';

@Component({
  selector: 'app-board-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './board-form.component.html',
  styleUrl: './board-form.component.scss',
})
export class BoardFormComponent {
  @Output() close = new EventEmitter<void>();
  boardForm: FormGroup;
  nextId!: string;
  private nextIdSubscription: Subscription;
  @Input() board: IBoard | null | undefined;

  @Output() hideMenu = new EventEmitter<void>();

  onHideMenu(event: MouseEvent) {
    if (event) {
      const clickedInsideForm = (event.target as HTMLElement).closest(
        '.board-form'
      );
      if (!clickedInsideForm) {
        this.close.emit();
      }
    }
  }

  constructor(private fb: FormBuilder, private store: Store) {
    this.boardForm = this.fb.group({
      name: ['', Validators.required],
      columns: this.fb.array([]),
    });
    this.nextIdSubscription = this.store
      .select(selectNextId)
      .subscribe((id) => (this.nextId = id));
  }

  ngOnChanges(simpleChanges: any) {
    if (simpleChanges.board && this.board) {
      this.initForm();
    }
  }

  initializeColumns() {
    const columns = this.board?.columns || [];
    const columnFormControls = columns.map((column) =>
      this.fb.control(column.name, Validators.required)
    );
    return columnFormControls;
  }

  initForm() {
    this.boardForm = this.fb.group({
      name: [this.board?.name || '', Validators.required],
      columns: this.fb.array(this.initializeColumns()),
    });
  }

  get columns() {
    return this.boardForm.get('columns') as FormArray;
  }

  addColumn() {
    console.log('Adding column');
    this.columns.push(this.fb.control('', Validators.required));
  }

  removeColumn(index: number) {
    console.log(`Removing column at index ${index}`);
    this.columns.removeAt(index);
  }

  onSubmit() {
    if (this.boardForm.valid) {
      const newColumns = this.columns.value.map(
        (columnName: string, index: number) => {
          const existingTasks = this.board?.columns[index]?.tasks || [];
          return { name: columnName, tasks: existingTasks };
        }
      );

      const newBoard = {
        id: this.board ? this.board.id : this.nextId.toString(),
        name: this.boardForm.value.name,
        columns: newColumns,
      };

      if (this.board) {
        this.store.dispatch(BoardAsctions.updateBoard({ board: newBoard }));
      } else {
        this.store.dispatch(BoardAsctions.addBoard({ board: newBoard }));
      }

      this.boardForm.get('name')?.reset();
    }
    // this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }
}
