import { Routes } from '@angular/router';
import { DataEntryComponent } from './pages/data-entry-component/data-entry-component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'data-entry',
  },
  {
    path: 'data-entry',
    component: DataEntryComponent,
  },
];
