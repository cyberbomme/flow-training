// DEMO(ux-review): Erfundener Verlauf zum Review von Verlauf & Fortschritt.
// Nur im Branch ux-review – vor dem Merge nach main diese Datei und ihren Import in app.js entfernen.
// Wird nur geladen, wenn der Verlauf leer ist. Alle erfundenen Einträge tragen demo: true.
import { uid } from './store.js';

const DAY = 864e5;

export function seedDemo(db) {
  if (db.history.length) return false;
  let a = 7;
  const rnd = () => { a = (a * 16807) % 2147483647; return a / 2147483647; };
  const plans = [
    { name: 'Ganzkörper Basis', items: [['goblet-squat', 'reps', 8, 0.5], ['rudern-kh', 'reps', 7, 0.35, 'A1'], ['unterarmstuetz', 'time', 30, 1, 'A2'], ['hueftheben', 'reps', 0, 0]] },
    { name: 'Oberkörper Kraft', items: [['bankdruecken-kh', 'reps', 6, 0.4], ['schulterdruecken-kh', 'reps', 4, 0.25], ['bizepscurl', 'reps', 5, 0.2], ['bank-dips', 'reps', 0, 0]] },
    { name: 'Beine & Po', items: [['rumaenisches-kreuzheben', 'reps', 10, 0.6], ['ausfallschritt', 'reps', 0, 0], ['wandsitzen', 'time', 30, 1.5]] },
  ];
  const start = Date.now() - 15 * 7 * DAY;
  const out = [];
  let n = 0;
  for (let w = 0; w < 15; w++) {
    const per = w === 6 ? 1 : 2 + (rnd() < 0.35 ? 1 : 0); // eine ruhigere Woche dazwischen
    const days = [1, 3, 5].slice(0, per);
    for (const d of days) {
      const date = start + (w * 7 + d) * DAY + (17 + Math.floor(rnd() * 3)) * 36e5;
      if (date > Date.now() - DAY) continue;
      const p = plans[n++ % plans.length];
      const k = Math.floor(n / plans.length); // wie oft dieser Plan schon dran war
      const items = p.items.map(([exId, mode, base, step, ss]) => {
        const sets = [];
        for (let s = 0; s < (ss ? 2 : 3); s++) {
          if (mode === 'time') sets.push({ dur: Math.round((base + k * step * 5) / 5) * 5, weight: null });
          else sets.push({ reps: 10 + (s === 2 && rnd() < 0.4 ? -2 : 0) + (rnd() < 0.2 ? 2 : 0), weight: base ? Math.round((base + k * step) * 2) / 2 : null });
        }
        return { exId, mode, sets, ...(ss ? { ss } : {}) };
      });
      out.push({ id: uid(), demo: true, date, end: date + (24 + Math.floor(rnd() * 14)) * 60e3, planName: p.name, items });
    }
  }
  db.history = out;
  return true;
}
