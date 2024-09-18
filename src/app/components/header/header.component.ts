import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { MenuMobileComponent } from '../menu-mobile/menu-mobile.component';
import { Observable } from 'rxjs';
import { IBoard } from '../../interfaces/board';
import { Store } from '@ngrx/store';
// import { selectSelectedBoard } from '../../shared/state/board/board.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenuMobileComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  selectedBoards$!: Observable<IBoard>
  showMenuModal: boolean = false;

  constructor(private apiServie: ApiService, private store: Store) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.apiServie.getAllBoards().subscribe({
      next: (val) => console.log(val),
    });

    // this.selectedBoards$ = this.store.select(selectSelectedBoard)
  }

  onShowMenuModal() {
    this.showMenuModal = !this.showMenuModal;
  }
  onHideMenuModal() {
    this.showMenuModal = false;
  }
}
