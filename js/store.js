// Lokale Datenhaltung (localStorage, ein JSON-Dokument)
import { EQUIPMENT } from './exercises.js';
import { STRETCH_SIZES, HOLD_MIN, HOLD_MAX } from './stretch.js';

const KEY = 'kraftkatalog.v1';

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

function defaults() {
  return {
    version: 1,
    equip: EQUIPMENT.map((e) => e.id),
    sound: true,
    theme: 'system',
    design: 'flow',
    autopilot: false,
    setup: 5,        // Vorlauf in s vor automatisch gestarteten Sätzen ohne Pause davor
    tempo: {},
    muscle: '',      // Muskelgruppen-Filter im Katalog ('' = alle)
    catKind: 'kraft',   // Katalog: 'kraft' | 'dehnen'
    planFilter: 'alle', // Planliste: 'alle' | 'kraft' | 'dehnen'
    stretchOffer: true, // nach Krafttraining passende Dehnungen anbieten
    stretchHold: 30,    // Haltezeit je Dehnung (s, je Seite) für automatische Dehnpläne
    stretchSize: 'normal', // Umfang automatischer Dehnpläne (js/stretch.js → STRETCH_SIZES)
    stretchRot: 0,      // Zähler für den Wechsel im Standard-Set
    drafts: {},      // ungespeicherte Plan-Änderungen je Plan-ID       // eigene Tempi je Übung (s pro Wiederholung), überschreibt TEMPO
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

// Einstellungen, die der Import übernimmt – mit Prüfung. Fehlt ein Feld (ältere Exporte) oder passt der Wert nicht,
// bleibt der vorhandene stehen. Neue Felder aus defaults() hier ergänzen. `active` wird nie übernommen.
const isBool = (v) => typeof v === 'boolean';
const isNum = (min, max) => (v) => Number.isFinite(v) && v >= min && v <= max;
const oneOf = (...list) => (v) => list.includes(v);
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isStrings = (v) => Array.isArray(v) && v.every((x) => typeof x === 'string');
const FIELDS = {
  equip: isStrings,
  sound: isBool,
  theme: oneOf('system', 'light', 'dark'),
  design: (v) => typeof v === 'string', // unbekanntes Design setzt app.js auf Flow
  autopilot: isBool,
  setup: isNum(0, 20),
  muscles: isStrings,
  catKind: oneOf('kraft', 'dehnen'),
  planFilter: oneOf('alle', 'kraft', 'dehnen'),
  stretchOffer: isBool,
  stretchHold: isNum(HOLD_MIN, HOLD_MAX),
  stretchSize: oneOf(...STRETCH_SIZES.map((z) => z.id)),
  stretchRot: (v) => Number.isInteger(v) && v >= 0,
  hints: isObj,
};
const isTempo = isNum(1, 8);
const pick = (obj, ok) => Object.fromEntries(Object.entries(obj).filter(([k, v]) => ok(v, k)));

export function importJSON(text) {
  const data = JSON.parse(text);
  if (!Array.isArray(data?.plans) || !Array.isArray(data.history)) throw new Error('Unbekanntes Format');
  state.plans = data.plans;
  state.history = data.history;
  for (const [key, ok] of Object.entries(FIELDS)) if (ok(data[key])) state[key] = data[key];
  if (isObj(data.tempo)) state.tempo = pick(data.tempo, isTempo);
  if (isObj(data.drafts)) {
    state.drafts = data.drafts;
    if (state.active) delete state.active.tempDraft; // sonst würde das Trainingsende einen importierten Entwurf verwerfen
  }
  // Entwürfe ohne zugehörigen Plan sind nicht erreichbar
  state.drafts = pick(state.drafts || {}, (d, id) => Array.isArray(d?.items) && state.plans.some((p) => p?.id === id));
  save();
}

// Ab iOS 16.4 / PWA: um dauerhaften Speicher bitten
navigator.storage?.persist?.().catch(() => {});
