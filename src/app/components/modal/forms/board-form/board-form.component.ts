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
import { Subscription } from 'rxjs';
import { selectNextId } from '../../../../shared/state/board/board.selectors';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-board-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.scss'],
})
export class BoardFormComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  boardForm: FormGroup;
  nextId!: string;
  private nextIdSubscription: Subscription;
  @Input() board: IBoard | null | undefined;

  @Output() hideMenu = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private store: Store) {
    this.boardForm = this.createForm();
    this.nextIdSubscription = this.store
      .select(selectNextId)
      .subscribe((id) => (this.nextId = id));
  }

  ngOnInit() {
    // Ensure the form initializes correctly
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

  initializeColumns(): FormControl<string | null>[] {
    const columns = this.board?.columns || [];
    return columns.map((column) =>
      this.fb.control(column.name, Validators.required)
    );
  }

  initForm() {
    this.boardForm.patchValue({
      name: this.board?.name || '',
    });
    this.columns.clear(); // Clear previous columns

    // Add each initialized column to the FormArray
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
    this.columns.removeAt(index);
  }

  onSubmit() {
    if (this.boardForm.valid) {
      const newColumns = this.columns.value.map((columnName: string) => ({
        name: columnName,
        tasks: [], // Initialize tasks as needed
      }));

      const newBoard: IBoard = {
        id: this.board ? this.board.id : uuidv4(),
        name: this.boardForm.value.name,
        columns: newColumns,
      };

      if (this.board) {
        this.store.dispatch(BoardActions.updateBoard({ board: newBoard }));
      } else {
        this.store.dispatch(BoardActions.addBoard({ board: newBoard }));
      }

      // Reset the form for new board creation
      this.boardForm.reset();
      this.columns.clear(); // Clear columns if needed

      // Emit close to notify parent component
      this.close.emit();
    }
  }

  onCancel() {
    this.close.emit();
  }
}
