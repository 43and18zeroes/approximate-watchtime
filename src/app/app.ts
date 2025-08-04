import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CustomSidenav } from './components/custom-sidenav/custom-sidenav';
import { ThemeService } from './services/theme-service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatSlideToggleModule,
    CustomSidenav,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('crud');
  themeService = inject(ThemeService);
  collapsed = signal(true);

  sidenavWidth = computed(() => (this.collapsed() ? '81px' : '250px'));

  constructor() {
    this.themeService.initTheme();
  }

  collapseSidenav() {
    this.collapsed.set(true);
  }
}
