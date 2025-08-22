import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { DataEntryService } from './services/data-entry-service';

type NumCtrl = FormControl<number | null>;

@Component({
  selector: 'app-data-entry-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
  ],
  templateUrl: './data-entry-component.html',
  styleUrls: ['./data-entry-component.scss'],
})
export class DataEntryComponent implements OnInit {
  private readonly dataEntry = inject(DataEntryService);
  private readonly fb = inject(FormBuilder);

  minutes: number | null = null;
  seconds: number | null = null;

  submitted = false;
  secondsTooltip = '';
  showSecondsTooltip = false;

  readonly displayedColumns: readonly string[] = ['time', 'percent'];

  /** Percent values aligned with timestamps; use in template via formArrayName="percentages" */
  readonly percentages: FormArray<NumCtrl> = this.fb.array<NumCtrl>([]);

  ngOnInit(): void {
    // Optional: seed demo values (remove if not needed)
    // this.minutes = 22;
    // this.seconds = 7;
    // this.submitLength();
    // this.autofillPercentages();
  }

  submitLength(): void {
    this.submitted = true;

    const min = this.minutes ?? 0;
    const sec = this.seconds ?? 0;

    const clampedMin = Math.max(0, min);
    const clampedSec = Math.max(0, Math.min(59, sec));

    const totalSeconds = clampedMin * 60 + clampedSec;
    if (totalSeconds <= 0) {
      // nothing to do
      this.resetPercents();
      return;
    }

    this.dataEntry.generateTimestampRows(totalSeconds);

    // Resize the percentages array to match timestamps
    const targetLen = this.dataEntry.timestamps.length;
    this.resizePercentArray(targetLen);
  }

  submitRetentions(): void {
    const avg = this.calculateApproxAverageWatchTime();
    console.log('Durchschnittliche Wiedergabezeit:', avg.formatted, `(${avg.seconds} s)`);
  }

  /** Optional helper to quickly populate sample percentage values (100, 95, 90, …) */
  autofillPercentages(step = 5): void {
    for (let i = 0; i < this.percentages.length; i++) {
      const base = Math.max(0, 100 - i * step);
      this.percentages.at(i).setValue(base, { emitEvent: false });
    }
  }

  /** Trapezoid integration over r(t) in [0..1] */
  calculateApproxAverageWatchTime(): { seconds: number; formatted: string } {
    const times = this.dataEntry.timestamps;
    if (!times?.length || times.length < 2) return { seconds: 0, formatted: '0:00' };

    // Collect clamped percentage values aligned to timestamps
    const percents: number[] = this.percentages.value.map(v => {
      const n = Number(v ?? 0);
      return Math.max(0, Math.min(100, isNaN(n) ? 0 : n));
    });

    const n = Math.min(times.length, percents.length);
    if (n < 2) return { seconds: 0, formatted: '0:00' };

    let viewerSeconds = 0;
    for (let i = 0; i < n - 1; i++) {
      const r1 = percents[i] / 100;
      const r2 = percents[i + 1] / 100;
      const dt = Math.max(0, (times[i + 1] ?? 0) - (times[i] ?? 0));
      viewerSeconds += ((r1 + r2) / 2) * dt;
    }

    const seconds = Math.max(0, Math.round(viewerSeconds));
    const mm = Math.floor(seconds / 60);
    const ss = String(seconds % 60).padStart(2, '0');
    return { seconds, formatted: `${mm}:${ss}` };
  }

  // ---------- private helpers ----------

  private resetPercents(): void {
    while (this.percentages.length) this.percentages.removeAt(0);
  }

  private resizePercentArray(targetLen: number): void {
    const current = this.percentages.length;

    // Shrink
    for (let i = current - 1; i >= targetLen; i--) {
      this.percentages.removeAt(i);
    }

    // Grow
    for (let i = current; i < targetLen; i++) {
      this.percentages.push(
        this.fb.control<number | null>(null, {
          validators: [Validators.min(0), Validators.max(100)],
          nonNullable: false,
        })
      );
    }
  }
}
