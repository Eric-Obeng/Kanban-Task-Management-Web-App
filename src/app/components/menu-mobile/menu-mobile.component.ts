import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeComponent } from '../theme/theme.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-mobile',
  standalone: true,
  imports: [ThemeComponent, CommonModule],
  templateUrl: './menu-mobile.component.html',
  styleUrl: './menu-mobile.component.scss',
})
export class MenuMobileComponent {
  @Output() hideMenu = new EventEmitter<void>();

  @Input() showSideBar!: boolean

  onHideMenu() {
    this.hideMenu.emit();
  }
}
