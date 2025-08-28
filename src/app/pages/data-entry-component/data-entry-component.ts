import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
  retentions: (number | null)[] = [];

  submitLength() {
    this.submitted = true;
    const totalSeconds = this.minutes * 60 + this.seconds;
    this.dataEntryService.generateTimestampRows(totalSeconds);

    // Array für Eingaben aufsetzen
    this.retentions = new Array(this.dataEntryService.timestamps.length).fill(
      null
    );
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
    if (!this.retentions?.length) return;

    let val = 100;
    for (let i = 0; i < this.retentions.length; i++) {
      // clamp 0–100 und als Zahl setzen
      const v = Math.max(0, Math.min(100, val));
      this.retentions[i] = v;
      val -= 5;
      if (val < 0) val += 5;
    }
  }

  resetLength(lengthForm: NgForm) {
    // Werte + Status (touched/pristine/valid/etc.) zurücksetzen
    lengthForm.resetForm(); // => invalid/touched sind zurückgesetzt
    this.submitted = false; // falls du die Retentions-Section ausblenden willst
    this.dataEntryService.timestamps = []; // optional: wenn du die Tabelle leeren willst
  }

  resetRetentions(retentionForm: NgForm) {
    retentionForm.resetForm();
    this.retentions = this.retentions.map(() => null);
  }
}
