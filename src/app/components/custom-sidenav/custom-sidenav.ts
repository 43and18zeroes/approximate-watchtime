import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-custom-sidenav',
  imports: [],
  templateUrl: './custom-sidenav.html',
  styleUrl: './custom-sidenav.scss',
})
export class CustomSidenav {
  sideNavCollapsed = signal(false);

  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }
}
