import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BoardService } from '../../../shared/services/board.service';
import { IBoard } from '../../../interfaces/board';
import { ITask } from '../../../interfaces/task';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss',
})
export class DeleteComponent {
  @Input() board: IBoard | null | undefined;
  @Input() task!: ITask;
  @Output() close = new EventEmitter<void>();

  @Output() hideMenu = new EventEmitter();

  constructor(public boardService: BoardService) {}

  delete() {
    if (this.board) {
      this.boardService.deleteBoard(this.board.id);
    } else if (this.task) {
      this.boardService.deleteTask(this.task.title);
    }
    this.close.emit();
  }

  cancel() {
    this.close.emit();
  }

  onHideMenu(event: MouseEvent) {
    const clickedInsideForm = (event.target as HTMLElement).closest(
      '.board-form'
    );
    if (!clickedInsideForm) {
      this.close.emit();
    }
  }
}
