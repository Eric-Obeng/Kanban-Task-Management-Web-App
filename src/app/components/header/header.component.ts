import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { MenuMobileComponent } from '../menu-mobile/menu-mobile.component';
import { Observable } from 'rxjs';
import { IBoard } from '../../interfaces/board';
import { Store } from '@ngrx/store';
import { selectSelectedBoard } from '../../shared/state/board/board.selectors';
import { CommonModule } from '@angular/common';
import { ActionsComponent } from "../modal/actions/actions.component";
// import { selectSelectedBoard } from '../../shared/state/board/board.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenuMobileComponent, CommonModule, ActionsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  selectedBoards$!: Observable<IBoard | null>;
  showMenuModal: boolean = false;

  constructor(private apiServie: ApiService, private store: Store) {
    this.selectedBoards$ = this.store.select(selectSelectedBoard);
  }

  onShowMenuModal() {
    this.showMenuModal = !this.showMenuModal;
  }
  onHideMenuModal() {
    this.showMenuModal = false;
  }
}
