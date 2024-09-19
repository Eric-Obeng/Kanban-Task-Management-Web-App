import { Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { TaskDeatilsComponent } from './components/modal/task-deatils/task-deatils.component';

export const routes: Routes = [
  {
    path: '',
    component: BoardComponent,
  },
  {
    path: 'task',
    component: TaskDeatilsComponent,
  },
];
