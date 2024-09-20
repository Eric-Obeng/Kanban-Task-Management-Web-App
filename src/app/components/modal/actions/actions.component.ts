import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBoard } from '../../../interfaces/board';
import { CommonModule } from '@angular/common';
import { BoardFormComponent } from '../forms/board-form/board-form.component';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [CommonModule, BoardFormComponent],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
})
export class ActionsComponent {
  @Input() actionType: 'board' | 'task' = 'board';
  @Output() editAction = new EventEmitter<void>();

  showActions: boolean = false;

  onshowActions() {
    this.showActions = !this.showActions;
  }

  closeModal() {}

  onEdit() {
    this.editAction.emit();
  }

  onDelete() {}
}
