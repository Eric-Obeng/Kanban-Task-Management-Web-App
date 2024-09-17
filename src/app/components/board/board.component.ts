import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  constructor(private store: Store) {}
}
