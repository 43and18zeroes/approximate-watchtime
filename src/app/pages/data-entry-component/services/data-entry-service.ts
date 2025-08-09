import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataEntryService {
  public timestamps: number[] = [];

  generateTimestampRows(totalSeconds: number) {
    // Leert das Array, um vorherige Ergebnisse zu entfernen.
    this.timestamps = [];

    // Feste Intervalldauer und Offset.
    const interval = 120; // 120 Sekunden
    const offset = 4; // Die Zeitmarke soll immer bei :04 Sekunden sein

    let currentTimestamp = offset;

    // Fügt Zeitmarken hinzu, bis die Gesamtdauer überschritten ist.
    // Es gibt keine feste Obergrenze mehr für die Anzahl der Zeitmarken.
    while (currentTimestamp <= totalSeconds) {
      this.timestamps.push(currentTimestamp);
      currentTimestamp += interval;
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
