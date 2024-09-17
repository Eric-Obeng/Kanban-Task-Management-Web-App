import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { MenuMobileComponent } from '../menu-mobile/menu-mobile.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenuMobileComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  showMenuModal: boolean = false;

  constructor(private apiServie: ApiService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.apiServie.getAllBoards().subscribe({
      next: (val) => console.log(val),
    });
  }

  onShowMenuModal() {
    this.showMenuModal = !this.showMenuModal;
  }
  onHideMenuModal() {
    this.showMenuModal = false;
  }
}
