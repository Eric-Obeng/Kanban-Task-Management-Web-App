import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { MenuMobileComponent } from '../menu-mobile/menu-mobile.component';
import { Observable } from 'rxjs';
import { IBoard } from '../../interfaces/board';
import { Store } from '@ngrx/store';
import { selectSelectedBoard } from '../../shared/state/board/board.selectors';
import { CommonModule } from '@angular/common';
import { ActionsComponent } from '../modal/actions/actions.component';
import { BoardComponent } from '../board/board.component';
import { BoardFormComponent } from '../modal/forms/board-form/board-form.component';
import { TaskFormComponent } from "../modal/forms/task-form/task-form.component";
// import { selectSelectedBoard } from '../../shared/state/board/board.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenuMobileComponent,
    CommonModule,
    ActionsComponent,
    BoardFormComponent,
    TaskFormComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  selectedBoards$!: Observable<IBoard | null | undefined>;
  selectedBoard: IBoard | null | undefined;

  showMenuModal: boolean = false;
  showBoardForm = false;
  showTaskForm = false;

  constructor(private apiServie: ApiService, private store: Store) {
    this.selectedBoards$ = this.store.select(selectSelectedBoard);
  }

  ngOnInit(): void {
    this.selectedBoards$.subscribe((board) => {
      this.selectedBoard = board;
    });
  }

  onShowMenuModal() {
    this.showMenuModal = !this.showMenuModal;
  }
  onHideMenuModal() {
    this.showMenuModal = false;
    this.showBoardForm = false;
  }

  openBoardForm() {
    this.showBoardForm = true;
  }

  closeBoardForm() {
    this.showBoardForm = false; // Set to false to close the form
  }

  onShowTaskForm() {
    this.showTaskForm = true;
  }
}
