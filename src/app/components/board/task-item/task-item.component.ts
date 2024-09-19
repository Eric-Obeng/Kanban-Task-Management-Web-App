import { Component, Input } from '@angular/core';
import { ITask } from '../../../interfaces/task';
import { CommonModule } from '@angular/common';
import { TaskDeatilsComponent } from "../../modal/task-deatils/task-deatils.component";

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule, TaskDeatilsComponent],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent {
  @Input() task!: ITask;
  showMenuModal: boolean = false;

  onShowMenuModal() {
    this.showMenuModal = !this.showMenuModal;
  }
  onHideMenuModal() {
    this.showMenuModal = false;
  }
}
