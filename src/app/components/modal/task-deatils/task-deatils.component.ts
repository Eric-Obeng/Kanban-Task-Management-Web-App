import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActionsComponent } from '../actions/actions.component';
import { ITask } from '../../../interfaces/task';

@Component({
  selector: 'app-task-deatils',
  standalone: true,
  imports: [ActionsComponent],
  templateUrl: './task-deatils.component.html',
  styleUrl: './task-deatils.component.scss',
})
export class TaskDeatilsComponent {
  @Output() hideMenu = new EventEmitter<void>();
  @Input() task!: ITask;

  onHideMenu() {
    this.hideMenu.emit();
  }
}
