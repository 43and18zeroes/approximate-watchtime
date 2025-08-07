import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-data-entry-component',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './data-entry-component.html',
  styleUrl: './data-entry-component.scss',
})
export class DataEntryComponent {
  minutes!: number;
  seconds!: number;
  submitted: boolean = false;

  tableRows: { displayMinute: string; value: string }[] = [];

  submit() {
    if (this.seconds < 0 || this.seconds > 59) {
      alert('Seconds must be between 0 and 59.');
      return;
    }
    this.submitted = true;
    this.createTableRows();
  }

  createTableRows() {
    this.tableRows = [];

    // Umrechnung der Gesamtlänge in Sekunden
    const totalSeconds = this.minutes * 60 + this.seconds;

    for (let i = 1; i <= 10; i++) {
      // Berechne Zeitmarke für die aktuelle Zeile
      const currentSeconds = i * 120 + this.seconds; // alle 2 Minuten, startend von den eingegebenen Sekunden
      if (currentSeconds > totalSeconds) break;

      const minute = Math.floor(currentSeconds / 60);
      const second = currentSeconds % 60;

      this.tableRows.push({
        displayMinute: `Minute ${minute}:${second.toString().padStart(2, '0')}`,
        value: '',
      });
    }
  }
}
