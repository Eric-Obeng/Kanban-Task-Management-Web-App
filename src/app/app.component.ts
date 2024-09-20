import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MenuMobileComponent } from './components/menu-mobile/menu-mobile.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { Store } from '@ngrx/store';
import { ApiService } from './shared/services/api.service';
import { loadBoards } from './shared/state/board/board.actions';
import { loadTheme } from './shared/state/theme/theme.actions';
import { CommonModule } from '@angular/common';
import { BoardFormComponent } from "./components/modal/forms/board-form/board-form.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MenuMobileComponent,
    SideBarComponent,
    CommonModule,
    BoardFormComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Kanban-Task-Managment-Web-App';
  showBoardForm: boolean = false;

  onCreateBoard() {
    this.showBoardForm = true;
  }

  closeBoardForm() {
    this.showBoardForm = false;
  }

  constructor(private store: Store, private apiService: ApiService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.store.dispatch(loadBoards());
    this.store.dispatch(loadTheme());
  }
}
