import { Component, Input } from '@angular/core';
import { IBoard } from '../../../interfaces/board';

@Component({
  selector: 'app-board-item',
  standalone: true,
  imports: [],
  templateUrl: './board-item.component.html',
  styleUrl: './board-item.component.scss',
})
export class BoardItemComponent {
  @Input('board') board!: IBoard;
}
