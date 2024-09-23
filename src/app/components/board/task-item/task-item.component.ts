import { Component, Input, SimpleChanges } from '@angular/core';
import { ITask } from '../../../interfaces/task';
import { CommonModule } from '@angular/common';
import { TaskDetailsComponent } from '../../modal/task-deatils/task-deatils.component';
import { BoardService } from '../../../shared/services/board.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [TaskDetailsComponent, CommonModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent {
  @Input() task!: ITask;
  showMenuModal: boolean = false;
  completedTaskCount: number = 0;

  constructor(private boardService: BoardService) {}

  ngOnInit() {
    this.updateCompletedTaskCount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.updateCompletedTaskCount();
    }
  }

  updateCompletedTaskCount() {
    if (!this.task) return;
    this.completedTaskCount = this.task.subtasks.filter(
      (subtask) => subtask.isCompleted
    ).length;
  }

  onShowMenuModal() {
    this.showMenuModal = !this.showMenuModal;
  }

  onHideMenuModal() {
    this.showMenuModal = false;
  }

  onTaskChange(updatedTask: ITask) {
    this.task = updatedTask;
    this.updateCompletedTaskCount();
    this.boardService.updateTask(updatedTask);
  }
}
