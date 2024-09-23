import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IBoard } from '../../interfaces/board';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TaskItemComponent } from './task-item/task-item.component';
import { BoardFormComponent } from '../modal/forms/board-form/board-form.component';
import { BoardService } from '../../shared/services/board.service';
import { getRandomColor } from '../../shared/state/utils/generateColors';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, AsyncPipe, TaskItemComponent, BoardFormComponent],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit, OnDestroy {
  selectedBoard$!: Observable<IBoard | null | undefined>;
  private subscription: Subscription = new Subscription();

  @Output() createNewColumnClicked = new EventEmitter<void>();
  color!: string;

  showBoardForm: boolean = false;

  constructor(public boardService: BoardService) {}

  ngOnInit(): void {
    this.selectedBoard$ = this.boardService.selectedBoard$;
    this.subscription.add(
      this.boardService.boards$.subscribe() // This ensures the board list is always up to date
    );
    this.color = getRandomColor();

    // Load the selected board from local storage
    const storedBoard = localStorage.getItem('selectedBoard');
    if (storedBoard) {
      const board = JSON.parse(storedBoard);
      this.boardService.selectBoard(board);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCreateBoard() {
    this.showBoardForm = true;
  }

  closeBoardForm() {
    this.showBoardForm = false;
  }

  onCreateNewColumn() {
    this.showBoardForm = true;
    this.createNewColumnClicked.emit();
  }
}
