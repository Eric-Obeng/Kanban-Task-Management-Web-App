import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import * as BoardActions from '../../../../shared/state/board/board.actions';
import { IBoard } from '../../../../interfaces/board';
import { IColumn } from '../../../../interfaces/column';
import { v4 as uuidv4 } from 'uuid';
import { BoardService } from '../../../../shared/services/board.service';

@Component({
  selector: 'app-board-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.scss'],
})
export class BoardFormComponent implements OnInit {
  @Output() close = new EventEmitter();
  boardForm: FormGroup;

  @Input() board: IBoard | null | undefined;

  @Output() hideMenu = new EventEmitter();

  columnsMarkedForDeletion: Set<number> = new Set();

  constructor(
    private fb: FormBuilder,
    private boardService: BoardService,
    private store: Store
  ) {
    this.boardForm = this.createForm();
  }

  ngOnInit() {
    if (this.board) {
      this.initForm();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      columns: this.fb.array([]),
    });
  }

  onHideMenu(event: MouseEvent) {
    const clickedInsideForm = (event.target as HTMLElement).closest(
      '.board-form'
    );
    if (!clickedInsideForm) {
      this.close.emit();
    }
  }

  initializeColumns(): FormControl[] {
    const columns = this.board?.columns || [];
    return columns.map((column) =>
      this.fb.control(column.name, Validators.required)
    );
  }

  initForm() {
    this.boardForm.patchValue({
      name: this.board?.name || '',
    });
    this.columns.clear();
    const initializedColumns = this.initializeColumns();
    for (const control of initializedColumns) {
      this.columns.push(control);
    }
  }

  get columns() {
    return this.boardForm.get('columns') as FormArray;
  }

  addColumn() {
    this.columns.push(this.fb.control('', Validators.required));
  }

  removeColumn(index: number) {
    this.columnsMarkedForDeletion.add(index);
  }

  isColumnMarkedForDeletion(index: number): boolean {
    return this.columnsMarkedForDeletion.has(index);
  }

  onSubmit() {
    if (this.boardForm.valid) {
      let newColumns: IColumn[] = [];
      let tasksToRedistribute: any[] = [];

      this.columns.controls.forEach((control, index) => {
        // Only keep columns that are not marked for deletion
        if (!this.isColumnMarkedForDeletion(index)) {
          const columnName = control.value;
          const existingColumn = this.board?.columns[index];
          newColumns.push({
            name: columnName,
            tasks: existingColumn ? [...existingColumn.tasks] : [],
          });
        } else if (this.board?.columns[index]?.tasks?.length) {
          // Collect tasks from deleted columns to redistribute
          tasksToRedistribute.push(...this.board.columns[index].tasks);
        }
      });

      // Redistribute tasks from deleted columns to the first column (if any)
      if (tasksToRedistribute.length && newColumns.length) {
        newColumns[0].tasks = [...newColumns[0].tasks, ...tasksToRedistribute];
      }

      // Create or update the board
      const newBoard: IBoard = {
        id: this.board ? this.board.id : uuidv4(),
        name: this.boardForm.value.name,
        columns: newColumns,
      };

      // Update or add the board based on whether it's an existing board or a new one
      if (this.board) {
        this.boardService.updateBoard(newBoard);
      } else {
        this.boardService.addBoard(newBoard);
      }

      // Reset the form and clear marked columns after saving
      this.boardForm.reset();
      this.columns.clear();
      this.columnsMarkedForDeletion.clear();
      this.close.emit();
    }
  }

  onCancel() {
    this.close.emit();
  }
}
