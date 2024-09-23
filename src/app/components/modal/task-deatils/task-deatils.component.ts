import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionsComponent } from '../actions/actions.component';
import { ITask } from '../../../interfaces/task';
import { TaskFormComponent } from "../forms/task-form/task-form.component";

@Component({
  selector: 'app-task-deatils',
  standalone: true,
  imports: [ActionsComponent, TaskFormComponent],
  templateUrl: './task-deatils.component.html',
  styleUrl: './task-deatils.component.scss',
})
export class TaskDeatilsComponent {
  @Output() hideMenu = new EventEmitter<void>();
  @Input() task!: ITask;

  showTaskForm = false;

  openForm() {
    this.showTaskForm = true;
  }

  onHideMenu() {
    this.hideMenu.emit();
  }
}
