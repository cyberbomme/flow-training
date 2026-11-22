// Automatischer Dehnplan zu einem Krafttraining.
// Wird nicht gespeichert, sondern bei Bedarf aus den trainierten Übungen berechnet – so passt er immer
// zum aktuellen Stand des Kraftplans und taucht nicht in der Planliste auf.
import { byId, STRETCHES, STRETCH_POS, targetsOf, isStretch } from './exercises.js';

// Umfang = Gesamtzahl der Dehnungen inkl. Standard-Set (5); gezielte Dehnungen füllen auf
export const STRETCH_SIZES = [
  { id: 'kurz', name: 'Kurz', n: 5 },
  { id: 'normal', name: 'Normal', n: 7 },
  { id: 'lang', name: 'Ausführlich', n: 10 },
];

// Standard-Set (Wunsch 2026-11-22): nach jedem Krafttraining diese fünf Bereiche, die Übung je Bereich wechselt
// von Training zu Training (db.stretchRot). Reihenfolge der Bereiche = Vorrang, falls der Umfang kleiner ist.
export const STANDARD_SET = [
  { name: 'Rückenstrecker', ids: ['kindhaltung', 'knie-zur-brust', 'katze-kuh'] },
  { name: 'Hüftlendenmuskel', ids: ['hueftbeuger-dehnung', 'hueftbeuger-stehend'] },
  { name: 'Brustmuskel', ids: ['brust-dehnung-wand', 'brustoeffner'] },
  { name: 'Oberschenkel hinten', ids: ['hamstring-liegend', 'sitzende-vorbeuge', 'vorbeuge-stehend'] },
  { name: 'Zwillingswadenmuskel', ids: ['waden-dehnung', 'waden-stufe', 'herabschauender-hund'] },
];
export const SWITCH = 5;       // s zum Einnehmen der Position bzw. Seitenwechsel (Vorlauf vor jeder Dehnung)
export const HOLD_MIN = 20, HOLD_MAX = 60;

const TARGET_NAMES = {
  brust: 'Brust', trizeps: 'Trizeps', bizeps: 'Bizeps', unterarm: 'Unterarme', schulter: 'Schultern',
  oruecken: 'oberer Rücken', ruecken: 'Rücken', uruecken: 'unterer Rücken', quad: 'Oberschenkel vorn',
  hamstring: 'Oberschenkel hinten', gesaess: 'Gesäß', hueftbeuger: 'Hüftbeuger', adduktoren: 'Adduktoren',
  wade: 'Waden', rumpf: 'Rumpf', seitrumpf: 'seitlicher Rumpf',
};
// Auffüllen, wenn das Training kaum Zielmuskeln hat (z. B. reines Cardio): allgemein lockern
const FALLBACK = ['vorbeuge-stehend', 'quadrizeps-dehnung', 'schulter-dehnung', 'hueftbeuger-dehnung', 'katze-kuh', 'kindhaltung', 'rotation-liegend', 'figur-vier'];

const posIdx = (ex) => STRETCH_POS.indexOf(ex.pos);

// done: [{ exId, sets }] – Kraftübungen mit Anzahl Sätze; rot: Zähler für den Wechsel im Standard-Set.
// Liefert { exs, focus, std } – Dehnungen in ruhiger Reihenfolge, std = IDs aus dem Standard-Set.
export function pickStretches(done, n, rot = 0) {
  const need = {};
  for (const d of done) {
    const ex = byId[d.exId];
    if (!ex || isStretch(ex)) continue;
    for (const k of targetsOf(ex)) need[k] = (need[k] || 0) + Math.max(1, d.sets || 1);
  }
  const focus = Object.entries(need).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => TARGET_NAMES[k]);
  const score = (s) => Object.entries(s.t || {}).reduce((a, [k, w]) => a + w * (need[k] || 0), 0);
  const pool = [...STRETCHES], chosen = [];
  const take = (ex) => {
    chosen.push(ex); pool.splice(pool.indexOf(ex), 1);
    for (const [k, w] of Object.entries(ex.t)) if (need[k]) need[k] *= 1 - 0.75 * w;
  };
  // 1. Standard-Set: je Bereich die Übung dieser Runde (zählt auf die Muskeln an, damit nichts doppelt kommt)
  for (const g of STANDARD_SET.slice(0, n)) {
    take(byId[g.ids[rot % g.ids.length]]);
    for (const id of g.ids) { const i = pool.indexOf(byId[id]); if (i >= 0) pool.splice(i, 1); } // Alternativen nicht zusätzlich
  }
  const std = chosen.map((ex) => ex.id);
  // 2. Gierig: jeweils die Dehnung mit dem größten Nutzen, danach zählen ihre Muskeln weniger (breitere Abdeckung)
  while (chosen.length < n && pool.length) {
    let best = null, bs = 0;
    for (const s of pool) { const v = score(s); if (v > bs) { bs = v; best = s; } }
    if (!best || bs < 0.5) break;
    take(best);
  }
  for (const id of FALLBACK) { if (chosen.length >= n) break; if (pool.includes(byId[id])) take(byId[id]); }
  const exs = chosen.map((ex, i) => ({ ex, i })).sort((a, b) => posIdx(a.ex) - posIdx(b.ex) || a.i - b.i).map((x) => x.ex);
  return { exs, focus, std };
}

// Plan-Items für das Training (gleiches Format wie in den Plänen)
export function stretchItems(exs, hold, uid) {
  return exs.map((ex) => ({ id: uid(), type: 'ex', exId: ex.id, sets: 1, mode: 'time', reps: 1, dur: hold, weight: null, rest: 0 }));
}

// Dauer einer Dehnung (alle Durchgänge, je Seite, inkl. Einnehmen)
export const stretchSecs = (it) => (it.sets || 1) * (byId[it.exId]?.side ? 2 : 1) * (it.dur + SWITCH);
