import { Component } from '@angular/core';
import { MenuMobileComponent } from "../menu-mobile/menu-mobile.component";
import { ThemeComponent } from "../theme/theme.component";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MenuMobileComponent, ThemeComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {

}
