import { Component } from '@angular/core';
import { ThemeComponent } from "../theme/theme.component";

@Component({
  selector: 'app-menu-mobile',
  standalone: true,
  imports: [ThemeComponent],
  templateUrl: './menu-mobile.component.html',
  styleUrl: './menu-mobile.component.scss'
})
export class MenuMobileComponent {

}
