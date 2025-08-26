import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataEntryService } from './services/data-entry-service';
import { MatTableModule } from '@angular/material/table';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { DataAnalysisComponent } from '../../components/data-analysis-component/data-analysis-component';

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
    MatBottomSheetModule,
  ],
  templateUrl: './data-entry-component.html',
  styleUrl: './data-entry-component.scss',
})
export class DataEntryComponent {
  private bottomSheet = inject(MatBottomSheet);
  dataEntryService = inject(DataEntryService);
  minutes!: number;
  seconds!: number;
  submitted: boolean = false;
  secondsTooltip: string = '';
  showSecondsTooltip: boolean = false;
  displayedColumns = ['time', 'percent'];

  submitLength() {
    this.submitted = true;
    const totalSeconds = this.minutes * 60 + this.seconds;
    this.dataEntryService.generateTimestampRows(totalSeconds);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.fillAndSubmitForm();
    }, 0);
    setTimeout(() => {
      this.fillPercentages();
    }, 0);
  }

  submitRetentions() {
    const avg = this.dataEntryService.calculateApproxAverageWatchTime();
    console.log(
      'Durchschnittliche Wiedergabezeit:',
      avg.formatted,
      `(${avg.seconds} s)`
    );
    this.bottomSheet.open(DataAnalysisComponent, {
      data: { formatted: avg.formatted, seconds: avg.seconds },

      // Interaktionen außerhalb blockieren:
      hasBackdrop: true,
      disableClose: false, // Klicks aufs Backdrop schließen NICHT

      // Fokus/Scroll-Jumps vermeiden:
      autoFocus: false,
      restoreFocus: false as any,

      // Look & Größe:
      panelClass: 'analysis-bottom-sheet',
      backdropClass: 'analysis-backdrop',
      ariaLabel: 'Durchschnittliche Wiedergabezeit',
    });
  }

  fillAndSubmitForm() {
    // Setzt gültige Werte: Minuten (max 10) und Sekunden (0-59)
    this.minutes = 19;
    this.seconds = 50;
    this.submitLength();
  }

  fillPercentages() {
    let inputValue = 100;
    const percentageInputs = document.getElementsByClassName('script__class');

    for (let i = 0; i < percentageInputs.length; i++) {
      const input = percentageInputs[i] as HTMLInputElement;
      input.value = inputValue.toString();
      inputValue -= 5;

      if (inputValue < 0) {
        inputValue += 5;
      }
    }
  }

  resetLength() {
    // Minuten/Sekunden zurücksetzen
    this.minutes = undefined!;
    this.seconds = undefined!;
    this.submitted = false;
    // Auch Service-Daten zurücksetzen
    this.dataEntryService.timestamps = [];
  }

  resetRetentions() {
    // alle Input-Felder mit Klasse "script__class" leeren
    const percentageInputs = document.getElementsByClassName('script__class');
    for (let i = 0; i < percentageInputs.length; i++) {
      (percentageInputs[i] as HTMLInputElement).value = '';
    }
  }
}
