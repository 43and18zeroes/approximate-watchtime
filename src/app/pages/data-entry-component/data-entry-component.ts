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

  calcTime() {
    const avg = this.calculateApproxAverageWatchTime();
    console.log(
      'Durchschnittliche Wiedergabezeit:',
      avg.formatted,
      `(${avg.seconds} s)`
    );
  }

  fillAndSubmitForm() {
    // Setzt gültige Werte: Minuten (max 10) und Sekunden (0-59)
    this.minutes = 22;
    this.seconds = 7;
    this.submit();
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

  /** Annähernde durchschnittliche Wiedergabezeit (in Sek. + formatiert) */
  calculateApproxAverageWatchTime(): { seconds: number; formatted: string } {
    const times = this.dataEntryService.timestamps; // z.B. [0, 10, 20, ...] in Sekunden
    if (!times?.length || times.length < 2) {
      return { seconds: 0, formatted: '0:00' };
    }

    // Prozente in derselben Reihenfolge wie die Zeilen einsammeln
    const percentageInputs = document.getElementsByClassName('script__class');
    const percents: number[] = [];

    for (let i = 0; i < percentageInputs.length; i++) {
      const val = parseFloat((percentageInputs[i] as HTMLInputElement).value);
      // clamp 0–100, NaN -> 0
      const clamped = Math.max(0, Math.min(100, isNaN(val) ? 0 : val));
      percents.push(clamped);
    }

    // Sicherstellen, dass Arrays gleich lang sind
    const n = Math.min(times.length, percents.length);
    if (n < 2) return { seconds: 0, formatted: '0:00' };

    // Trapezregel über r(t) in [0,1] integrieren: ∫ r(t) dt ≈ Σ ((r_i+r_{i+1})/2) * Δt
    let viewerSeconds = 0;
    for (let i = 0; i < n - 1; i++) {
      const r1 = percents[i] / 100;
      const r2 = percents[i + 1] / 100;
      const dt = times[i + 1] - times[i] || 0;
      if (dt > 0) viewerSeconds += ((r1 + r2) / 2) * dt;
    }

    // Ergebnis runden und formatiert zurückgeben
    const seconds = Math.max(0, Math.round(viewerSeconds));
    const mm = Math.floor(seconds / 60);
    const ss = (seconds % 60).toString().padStart(2, '0');

    return { seconds, formatted: `${mm}:${ss}` };
  }
}
