import { Component } from '@angular/core';
import { ThemeService } from '../../shared/services/theme.service';
import { Store } from '@ngrx/store';
import * as ThemeActions from '../../shared/state/theme/theme.actions';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [],
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss',
})
export class ThemeComponent {
  isDarkMode: boolean = false;
  hideSideBar: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService, private store: Store) {
    this.themeService.isDarkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDark) => {
        this.isDarkMode = isDark;
      });
  }

  onSwitchTheme() {
    this.store.dispatch(ThemeActions.toggleTheme());
  }

  

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.next();
    this.destroy$.complete();
  }
}
