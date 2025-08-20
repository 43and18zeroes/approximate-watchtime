import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataEntryService } from './services/data-entry-service';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-data-entry-component',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
  ],
  templateUrl: './data-entry-component.html',
  styleUrl: './data-entry-component.scss',
})
export class DataEntryComponent {
  dataEntryService = inject(DataEntryService);
  minutes!: number;
  seconds!: number;
  submitted: boolean = false;
  secondsTooltip: string = '';
  showSecondsTooltip: boolean = false;
  displayedColumns = ['time', 'percent'];
  rowValues: (number | null)[] = [];

  submit() {
    this.submitted = true;
    const totalSeconds = this.minutes * 60 + this.seconds;
    this.dataEntryService.generateTimestampRows(totalSeconds);
    // this.rowValues = Array(this.dataEntryService.timestamps.length).fill(null);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.fillAndSubmitForm();
    }, 0);
    setTimeout(() => {
      this.fillPercentages();
    }, 0);
  }

  fillAndSubmitForm() {
    // Setzt gültige Werte: Minuten (max 10) und Sekunden (0-59)
    this.minutes = 25;
    this.seconds = 30;
    this.submit();
  }

  fillPercentages() {
    let inputValue = 100;
    const percentageInputs = document.getElementsByClassName('script__class');

    for (let i = 0; i < percentageInputs.length; i++) {
      const input = percentageInputs[i] as HTMLInputElement;
      input.value = inputValue.toString();
      inputValue -= 10;

      if(inputValue < 0) {
        inputValue += 10;
      }
    }
  }
}
