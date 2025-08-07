import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-data-entry-component',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './data-entry-component.html',
  styleUrl: './data-entry-component.scss',
})
export class DataEntryComponent {
  minutes: string = '';
  seconds: string = '';
  submitted: boolean = false;

  submit() {
    this.submitted = true;
  }
}
