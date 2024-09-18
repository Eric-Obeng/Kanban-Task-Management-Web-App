import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private THEME_KEY = 'isDarkMode';
  private darkMode = new BehaviorSubject<boolean>(this.loadTheme() === 'dark');

  isDarkMode$ = this.darkMode.asObservable();

  constructor() {
    this.applyTheme(this.darkMode.value);
  }

  switchTheme(): string {
    const isDark = !this.darkMode.value;
    this.darkMode.next(isDark);
    this.applyTheme(isDark);
    const newTheme = isDark ? 'dark' : 'light';
    this.saveTheme(newTheme);
    return newTheme;
  }

  private loadTheme() {
    return localStorage.getItem(this.THEME_KEY) || 'light';
  }

  private saveTheme(theme: string) {
    localStorage.setItem(this.THEME_KEY, theme);
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  getTheme(): string {
    return this.loadTheme(); // Retrieve the theme from localStorage
  }
}
