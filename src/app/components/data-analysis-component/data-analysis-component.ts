import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type AnalysisData = { formatted: string; seconds: number };

@Component({
  selector: 'app-data-analysis-component',
  imports: [CommonModule, MatBottomSheetModule, MatButtonModule, MatIconModule],
  templateUrl: './data-analysis-component.html',
  styleUrl: './data-analysis-component.scss',
})
export class DataAnalysisComponent {
  constructor(
    private ref: MatBottomSheetRef<DataAnalysisComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: AnalysisData | null
  ) {}

  get formatted() {
    return this.data?.formatted ?? '0:00';
  }
  get seconds() {
    return this.data?.seconds ?? 0;
  }

  close() {
    this.ref.dismiss();
  }
}
