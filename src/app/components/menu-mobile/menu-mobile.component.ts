import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemeComponent } from '../theme/theme.component';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../shared/services/board.service';

@Component({
  selector: 'app-menu-mobile',
  standalone: true,
  imports: [ThemeComponent, CommonModule],
  templateUrl: './menu-mobile.component.html',
  styleUrl: './menu-mobile.component.scss',
})
export class MenuMobileComponent {
  boards = this.boardService.boards$;
  totalBoards = this.boardService.totalBoards$;

  @Output() hideMenu = new EventEmitter<void>();

  @Input() showSideBar!: boolean;

  constructor(private boardService: BoardService) {}

  onHideMenu() {
    this.hideMenu.emit();
  }
}
