import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataEntryService {
  public timestamps: number[] = [];

generateTimestampRows(totalSeconds: number) {
  this.timestamps = [];

  const interval = 120; // 120 Sekunden
  const offset = 4;     // Start bei :04 Sekunden

  let currentTimestamp = offset;

  while (currentTimestamp <= totalSeconds) {
    this.timestamps.push(currentTimestamp);
    currentTimestamp += interval;
  }

  // letzten Wert durch totalSeconds ersetzen
  if (this.timestamps.length > 0) {
    this.timestamps[this.timestamps.length - 1] = totalSeconds;
  }
}

  public formatTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
