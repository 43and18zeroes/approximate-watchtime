import { Component, computed, effect, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('crud');
  darkMode = signal(false);
  collapsed = signal(false);

  sidenavWidth = computed(() => (this.collapsed() ? '65px' : '250px'));

  ngOnInit() {
    this.loadDarkModeFromStorageOrSystem();
    this.listenToSystemPreferenceChanges();
  }

  private loadDarkModeFromStorageOrSystem(): void {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      this.darkMode.set(saved === 'true');
    } else {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      this.darkMode.set(prefersDark);
    }
  }

  private listenToSystemPreferenceChanges(): void {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const saved = localStorage.getItem('darkMode');
      if (saved === null) {
        this.darkMode.set(e.matches);
      }
    });
  }

  toggleDarkMode = effect(() => {
    const dark = this.darkMode();
    document.body.classList.toggle('darkMode', dark);
    document.body.classList.toggle('lightMode', !dark);
    localStorage.setItem('darkMode', dark.toString());
  });
}
