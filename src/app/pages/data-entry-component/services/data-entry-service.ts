import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataEntryService {
  public timestamps: number[] = [];

  generateTimestampRows(seconds: number) {
    this.timestamps = [];
    const interval = 120;
    const maxTimestamps = 10;
    const offset = 4;

    for (let i = 0; i < maxTimestamps; i++) {
      const currentTimestamp = i * interval + offset;

      // Überprüft, ob die aktuelle Zeitmarke die Gesamtdauer nicht überschreitet.
      if (currentTimestamp <= seconds) {
        this.timestamps.push(currentTimestamp);
      } else {
        // Stoppt die Schleife, sobald die Gesamtdauer überschritten ist.
        break;
      }
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
