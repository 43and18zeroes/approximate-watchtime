import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataEntryService {
  public timestamps: number[] = [];

generateTimestampRows(totalSeconds: number) {
  const interval = 120; // 120 Sekunden
  const offset = 4;     // Marken liegen bei ...:04

  this.timestamps = [0];                          // immer 0:00 zuerst
  const cutoff = Math.max(0, totalSeconds - 60);  // 1-Minuten-Puffer vor Ende

  // ab 2:04 starten (=> offset + interval = 124s), dann alle 120s bis cutoff
  for (let t = offset + interval; t <= cutoff; t += interval) {
    this.timestamps.push(t);
  }

  // zum Schluss die exakte Gesamtlänge anfügen (z. B. 19:50)
  if (this.timestamps[this.timestamps.length - 1] !== totalSeconds) {
    this.timestamps.push(totalSeconds);
  }
}

  public formatTimestamp(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }

    /** Annähernde durchschnittliche Wiedergabezeit (in Sek. + formatiert) */
  calculateApproxAverageWatchTime(): { seconds: number; formatted: string } {
    const times = this.timestamps; // z.B. [0, 10, 20, ...] in Sekunden
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