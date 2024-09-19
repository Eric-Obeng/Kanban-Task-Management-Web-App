import { Component } from '@angular/core';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
})
export class ActionsComponent {
  showActions: boolean = false;

  onshowActions() {
    this.showActions = !this.showActions;
  }
  
}
