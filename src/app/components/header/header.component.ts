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
import { TaskFormComponent } from '../modal/forms/task-form/task-form.component';
import { DeleteComponent } from '../modal/delete/delete.component';
// import { selectSelectedBoard } from '../../shared/state/board/board.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenuMobileComponent,
    CommonModule,
    ActionsComponent,
    BoardFormComponent,
    TaskFormComponent,
    DeleteComponent,
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
  showDeleteModal = false;

  chevronDownPath: string = 'M1 1 5 5 9 1';
  chevronUpPath: string = 'M9 6 5 2 1 6';

  currentChevronPath: string = this.chevronDownPath;

  constructor(private apiServie: ApiService, private store: Store) {
    this.selectedBoards$ = this.store.select(selectSelectedBoard);
  }

  ngOnInit(): void {
    this.selectedBoards$.subscribe((board) => {
      this.selectedBoard = board;
    });
  }

  onShowMenuModal() {
    this.showMenuModal = true;
    console.log(this.showMenuModal);
    this.toggleChevron();
  }
  onHideMenuModal() {
    this.showMenuModal = false;
    this.showBoardForm = false;
    this.showDeleteModal = false;
    this.toggleChevron();
  }

  toggleChevron() {
    this.currentChevronPath =
      this.currentChevronPath === this.chevronDownPath
        ? this.chevronUpPath
        : this.chevronDownPath; // Toggle between chevron paths
  }

  openForm() {
    this.showBoardForm = true;
    this.showMenuModal = false;
  }

  closeForm() {
    this.showBoardForm = false;
    this.showTaskForm = false;
  }

  onShowTaskForm() {
    this.showTaskForm = true;
  }

  openDeleteModal() {
    this.showDeleteModal = !this.showDeleteModal;
  }
}
