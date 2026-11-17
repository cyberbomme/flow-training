// Lokale Datenhaltung (localStorage, ein JSON-Dokument)
import { EQUIPMENT } from './exercises.js';

const KEY = 'kraftkatalog.v1';

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function defaults() {
  return {
    version: 1,
    equip: EQUIPMENT.map((e) => e.id),
    sound: true,
    theme: 'system',
    plans: [samplePlan()],
    history: [],
    active: null,
  };
}

function samplePlan() {
  const ex = (exId, o) => ({ id: uid(), type: 'ex', exId, sets: 3, mode: 'reps', reps: 10, dur: 30, weight: null, rest: 60, ...o });
  return {
    id: uid(),
    name: 'Ganzkörper Basis',
    items: [
      ex('kniebeuge', { reps: 15 }),
      ex('liegestuetz', { reps: 10 }),
      { id: uid(), type: 'rest', dur: 90 },
      ex('hueftheben', { reps: 15 }),
      ex('unterarmstuetz', { mode: 'time', dur: 45, rest: 45 }),
    ],
  };
}

let state;
try { state = { ...defaults(), ...JSON.parse(localStorage.getItem(KEY) || 'null') }; }
catch { state = defaults(); }

export const db = state;

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); }
  catch (e) { alert('Speichern fehlgeschlagen: ' + e.message); }
}

export function exportJSON() {
  const { active, ...rest } = state;
  return JSON.stringify(rest, null, 2);
}

export function importJSON(text) {
  const data = JSON.parse(text);
  if (!Array.isArray(data.plans) || !Array.isArray(data.history)) throw new Error('Unbekanntes Format');
  state.plans = data.plans;
  state.history = data.history;
  if (Array.isArray(data.equip)) state.equip = data.equip;
  save();
}

// Ab iOS 16.4 / PWA: um dauerhaften Speicher bitten
navigator.storage?.persist?.().catch(() => {});
