// Automatisches Plan-Icon: 1. Stichwort im Titel, 2. Muskelgruppen/Art der Übungen, 3. neutral.
// Farben der Zyklusphasen nach docs/DESIGN.md §2: Follikel/Ovulation grün, Menstruation/Luteal rosé.
import { byId } from './exercises.js';

const P = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
const ICONS = {
  menstruation: P('M12 3.5c3 4 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0c0-3 2.5-6 5.5-10z'),
  follikel: P('M12 20.5v-8M12 12.5c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5zM12 15c0-3-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5z'),
  ovulation: P('M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4'),
  luteal: P('M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z'),
  hiit: P('M13 3L5 13.5h6L10 21l8-10.5h-6z'),
  mobil: P('M3 10c3-4 6 4 9 0s6 4 9 0M3 16c3-4 6 4 9 0s6 4 9 0'),
  regeneration: P('M12 21C12 14 11 9 7 4M10.5 13c-3.5.5-6-1.5-7-4.5 3-.5 5.5 1 7 4.5zM11.5 17.5c3-1 5.5 0 7 2.5-3 1-5.5 0-7-2.5zM11 9.5c3-1.5 6-1 7.5 1.5-3 1.5-6 1-7.5-1.5z'),
  klettern: P('M3 19.5l6-10 4 6 3-4 5 8zM9 9.5l1.5-2.5'),
  core: P('M7.5 4.5s1.5-1 4.5-1 4.5 1 4.5 1v15s-1.5 1-4.5 1-4.5-1-4.5-1zM12 4v16M8 9h8M8 13.5h8'),
  beine: P('M9.5 3l-1 8 1.2 9.5H7.5M14.5 3l1 8-1.2 9.5h2.2M8.5 8h7'),
  ober: P('M12 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM4.5 12l3.5-3.5h8l3.5 3.5M8 8.5V17M16 8.5V17M8 17h8'),
  ganz: P('M12 3a2.2 2.2 0 1 1 0 4.4A2.2 2.2 0 0 1 12 3zM12 7.5v6M6.5 10.5h11M12 13.5l-3.5 7M12 13.5l3.5 7'),
  kraft: P('M6.5 8v8M17.5 8v8M4 10v4M20 10v4M6.5 12h11'),
  dehnen: P('M12 3.2a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8zM5.5 3.5l4 5.5h5l4-5.5M12 9v5M12 14l-6 6.5M12 14l6 6.5'),
  plan: P('M7 3.5h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2zM9 8.5h6M9 12h6M9 15.5h4'),
};

// Reihenfolge = Vorrang. Wörter werden ohne Groß-/Kleinschreibung im Titel gesucht.
const KEYWORDS = [
  { id: 'menstruation', label: 'Menstruation', tone: 'rose', words: ['menstruation', 'periode', 'mens '] },
  { id: 'follikel', label: 'Follikelphase', tone: 'sage', words: ['follikel'] },
  { id: 'ovulation', label: 'Eisprung', tone: 'sage', words: ['ovulation', 'eisprung'] },
  { id: 'luteal', label: 'Lutealphase', tone: 'rose', words: ['luteal'] },
  { id: 'hiit', label: 'HIIT', tone: 'sage', words: ['hiit', 'intervall', 'tabata', 'emom', 'amrap', 'zirkel', 'circuit', 'cardio'] },
  { id: 'mobil', label: 'Mobilität', tone: 'sage', words: ['mobil', 'dehn', 'stretch', 'yoga', 'beweglich'] },
  { id: 'regeneration', label: 'Regeneration', tone: 'rose', words: ['regener', 'erhol', 'recovery', 'entspann'] },
  { id: 'klettern', label: 'Klettern', tone: 'sage', words: ['kletter', 'boulder', 'finger'] },
  { id: 'core', label: 'Core', tone: 'sage', words: ['core', 'bauch', 'rumpf', 'abs'] },
  { id: 'beine', label: 'Beine & Po', tone: 'sage', words: ['bein', 'leg', 'po ', 'gesäß', 'glute', 'unterkörper'] },
  { id: 'ober', label: 'Oberkörper', tone: 'sage', words: ['oberkörper', 'upper', 'push', 'pull', 'arme', 'brust', 'rücken', 'schulter'] },
  { id: 'ganz', label: 'Ganzkörper', tone: 'sage', words: ['ganzkörper', 'full body', 'fullbody', 'total body'] },
  { id: 'kraft', label: 'Kraft', tone: 'sage', words: ['kraft', 'strength', 'maximal', 'power', 'hypertroph'] },
];
const BY_ID = Object.fromEntries(KEYWORDS.map((k) => [k.id, k]));

function fromExercises(exItems) {
  const list = exItems.map((it) => ({ it, ex: byId[it.exId] })).filter((x) => x.ex);
  if (!list.length) return null;
  const n = list.length;
  const has = (g) => list.filter((x) => x.ex.groups.includes(g)).length;
  const upper = list.filter((x) => x.ex.groups.some((g) => ['brust', 'ruecken', 'schultern', 'arme'].includes(g))).length;
  const lower = list.filter((x) => x.ex.groups.some((g) => ['beine', 'gesaess'].includes(g))).length;
  const core = has('rumpf');
  const timed = list.filter((x) => x.it.mode === 'time').length;
  // Klarer Rumpf-Schwerpunkt vor HIIT (Plank, Crunch …); sonst macht ein hoher Zeitanteil den Plan zum HIIT
  if (core / n >= 0.75) return 'core';
  if (timed / n >= 0.6) return 'hiit';
  if (core / n >= 0.5) return 'core';
  if (upper && lower) return 'ganz';
  if (lower) return 'beine';
  if (upper) return 'ober';
  return null;
}

// name: Plan-Titel; exItems: Übungen des Plans (flach, mit exId und mode); kind: 'stretch' = Dehnplan
// Farbe trägt die Art (Wunsch 2026-11-22): Rosé = Dehnen, Salbei = Kraft – auch bei Zyklus-Stichworten.
export function planIcon(name, exItems, kind) {
  if (kind === 'stretch') return { id: 'dehnen', label: 'Dehnen', tone: 'rose', from: 'art', svg: ICONS.dehnen };
  const t = ` ${(name || '').toLowerCase()} `;
  const hit = KEYWORDS.find((k) => k.words.some((w) => t.includes(w)));
  const id = hit?.id || fromExercises(exItems) || 'plan';
  const meta = BY_ID[id] || { id: 'plan', label: '', tone: 'sage' };
  return { id, label: meta.label, tone: 'sage', from: hit ? 'titel' : 'uebungen', svg: ICONS[id] };
}

export const planIconHTML = (name, exItems, cls = '', kind) => {
  const p = planIcon(name, exItems, kind);
  return `<div class="ic-circle plan-ic ${p.tone === 'rose' ? 'rose' : ''} ${cls}" title="${p.label}">${p.svg}</div>`;
};
