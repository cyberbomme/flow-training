// Beispielpläne als Vorlagen. „Übernehmen“ kopiert sie mit neuen IDs in die eigenen Pläne.
// Gewichte sind bewusst moderat gewählt – nach dem Übernehmen an das eigene Niveau anpassen.
// Kurzform: ex(id, sets, reps|'45s', kg, satzpause) · ss(runden, pause, …übungen) · rest(s)

const ex = (exId, sets, amount, weight = null, rest = 60) => {
  const time = typeof amount === 'string';
  return { type: 'ex', exId, sets, mode: time ? 'time' : 'reps', reps: time ? 10 : amount, dur: time ? parseInt(amount, 10) : 30, weight, rest };
};
const ss = (rounds, rest, ...items) => ({ type: 'group', rounds, rest, items });
const rest = (dur) => ({ type: 'rest', dur });

export const TEMPLATES = [
  {
    id: 'tpl-ganzkoerper-start', name: 'Ganzkörper Einstieg',
    note: 'Ohne Geräte, ruhiges Tempo – ideal zum Ankommen.',
    items: [
      ex('kniebeuge', 3, 12),
      ex('liegestuetz', 3, 8),
      ex('hueftheben', 3, 15),
      ss(3, 60, ex('superman', 3, 10), ex('crunch', 3, 12)),
      ex('unterarmstuetz', 3, '30s', null, 45),
    ],
  },
  {
    id: 'tpl-oberkoerper-kh', name: 'Oberkörper Kraft',
    note: 'Kurzhanteln und Bank. Drücken und Ziehen im Wechsel.',
    items: [
      ex('bankdruecken-kh', 3, 10, 8, 90),
      ex('rudern-kh', 3, 10, 8, 90),
      ss(3, 75, ex('schulterdruecken-kh', 3, 10, 5), ex('frontheben', 3, 10, 3)),
      ex('bizepscurl', 3, 12, 5),
      ex('bank-dips', 3, 10),
    ],
  },
  {
    id: 'tpl-beine-po', name: 'Beine & Po',
    note: 'Kurzhantel für Squat und Kreuzheben, zum Schluss halten.',
    items: [
      ex('goblet-squat', 4, 10, 10, 90),
      ex('rumaenisches-kreuzheben', 3, 10, 10, 90),
      ex('ausfallschritt', 3, 10, 4),
      ex('hueftheben', 3, 15),
      rest(60),
      ex('wandsitzen', 2, '45s', null, 45),
    ],
  },
  {
    id: 'tpl-hiit-zirkel', name: 'HIIT Zirkel',
    note: 'Vier Runden ohne Geräte, Pause erst nach jeder Runde.',
    items: [
      ss(4, 60,
        ex('bergsteiger', 4, '30s'),
        ex('kniebeuge', 4, 15),
        ex('liegestuetz', 4, 10),
        ex('seitstuetz', 4, '20s')),
    ],
  },
  {
    id: 'tpl-core', name: 'Core 15',
    note: 'Rumpf-Superset, dann Seitstütz und Rücken.',
    items: [
      ss(3, 45, ex('unterarmstuetz', 3, '40s'), ex('crunch', 3, 15), ex('hollow-hold', 3, '30s')),
      ex('seitstuetz', 2, '30s', null, 30),
      ex('superman', 3, 12, null, 45),
    ],
  },
  {
    id: 'tpl-follikel-kraft', name: 'Follikelphase Kraft',
    note: 'Langhantel, wenige Wiederholungen. In dieser Phase fühlen sich schwere Sätze oft leichter an – hör auf deinen Körper.',
    items: [
      ex('kniebeuge-lh', 4, 6, 30, 120),
      ex('bankdruecken-lh', 4, 6, 25, 120),
      ex('kreuzheben', 3, 5, 40, 150),
      ex('rudern-lh', 3, 8, 25, 90),
    ],
  },
  {
    id: 'tpl-luteal-sanft', name: 'Lutealphase sanft',
    note: 'Moderate Last, längere Pausen. Dieselbe Last kann sich jetzt schwerer anfühlen – Anpassung, nicht Verzicht.',
    items: [
      ex('goblet-squat', 3, 12, 6, 90),
      ex('hueftheben', 3, 15, null, 90),
      ss(3, 90, ex('band-rudern', 3, 15), ex('band-brustpresse', 3, 12)),
      ex('unterarmstuetz', 2, '30s', null, 60),
    ],
  },
  {
    id: 'tpl-klettern', name: 'Klettern Zugkraft',
    note: 'Klimmzugstange und Kurzhantel – für starke Züge an der Wand.',
    items: [
      ex('klimmzug', 4, 5, null, 120),
      ex('rudern-kh', 3, 10, 10, 90),
      ss(3, 60, ex('beinheben-haengend', 3, 8), ex('hollow-hold', 3, '30s')),
    ],
  },
  // ── Aus den Studio-Workouts (Whiteboard/Notizen, 2026-11-19) ──
  // Gleicher Aufbau wie im Studio: 2 Runden Aufwärmen, dann Supersets aus zwei Übungen, je 3 Runden.
  // Die Übungen sind auf sechs Schwerpunkte verteilt, damit sich die Pläne kaum wiederholen.
  {
    id: 'tpl-studio-power', name: 'Ganzkörper Power',
    note: 'Explosiv und mit Puls: Thruster, Snatches, Burpees, Swings. Gewicht so wählen, dass die Technik sauber bleibt.',
    items: [
      ss(2, 30, ex('schattenboxen', 2, '30s'), ex('crawling', 2, 12)),
      ss(3, 60, ex('thruster', 3, 12, 6), ex('jump-squat', 3, 12)),
      ss(3, 60, ex('snatch-einarmig', 3, 10, 8), ex('bergsteiger', 3, '30s')),
      ss(3, 60, ex('snatch-beidarmig', 3, 10, 6), ex('burpee-kh', 3, 8, 4)),
      ss(3, 60, ex('kb-swing', 3, 15, 12), ex('battle-rope', 3, '30s')),
      ss(3, 60, ex('high-pull', 3, 12, 10), ex('v-up', 3, 10)),
    ],
  },
  {
    id: 'tpl-studio-beine', name: 'Beine & Po Supersets',
    note: 'Viel einbeinige Arbeit für Kraft und Stabilität. Bei „je Seite“ erst alle Wiederholungen auf einer Seite.',
    items: [
      ss(2, 30, ex('seitsprints', 2, '30s'), ex('einbeinsprung', 2, 8)),
      ss(3, 60, ex('bulgarian-split-squat', 3, 10, 6), ex('einbeiniges-kreuzheben', 3, 10, 6)),
      ss(3, 60, ex('hip-thrust', 3, 12, 12), ex('goblet-reverse-lunge', 3, 8, 8)),
      ss(3, 60, ex('cossack-squat', 3, 8), ex('seitlicher-ausfallschritt', 3, 10, 4)),
      ss(3, 60, ex('good-morning', 3, 12), ex('beincurl-kh', 3, 12, 4)),
      ss(3, 60, ex('hamstring-bruecke', 3, 12), ex('diagonal-ausfallschritt-band', 3, 10)),
    ],
  },
  {
    id: 'tpl-studio-ober', name: 'Oberkörper Supersets',
    note: 'Drücken und Ziehen im Wechsel, zum Schluss Arme. Kurzhanteln und Bank.',
    items: [
      ss(2, 30, ex('sprints', 2, '30s'), ex('wand-liegestuetz', 2, 12)),
      ss(3, 60, ex('floor-press', 3, 12, 8), ex('reverse-flys', 3, 12, 3)),
      ss(3, 60, ex('rudern-einarmig', 3, 10, 10), ex('liegestuetz', 3, 10)),
      ss(3, 60, ex('curl-arnold', 3, 10, 5), ex('seitheben', 3, 10, 3)),
      ss(3, 60, ex('skull-crusher', 3, 10, 5), ex('flys', 3, 12, 5)),
      ss(3, 60, ex('zottman-curl', 3, 10, 5), ex('bank-dips', 3, 12)),
    ],
  },
  {
    id: 'tpl-studio-trx', name: 'Ganzkörper mit Schlingentrainer',
    note: 'Schlingentrainer und Kurzhanteln. Am Schlingentrainer steuerst du die Last über den Winkel deines Körpers.',
    items: [
      ss(2, 30, ex('crossleg-jumps', 2, '30s'), ex('walkout', 2, 8)),
      ss(3, 60, ex('trx-overhead-squat', 3, 12), ex('trx-curtsy', 3, 10)),
      ss(3, 60, ex('trx-rudern', 3, 12), ex('push-plank', 3, 10)),
      ss(3, 60, ex('reverse-lunge-knee', 3, 10), ex('kang-squat', 3, 12)),
      ss(3, 60, ex('schulterdruecken-kniend', 3, 10, 6), ex('rudern-breit', 3, 12, 6)),
      ss(3, 60, ex('plank-pull-through', 3, 8, 6), ex('hollow-brustpresse', 3, 12, 4)),
    ],
  },
  {
    id: 'tpl-studio-core', name: 'Core & Stabilität',
    note: 'Rumpf aus allen Richtungen, dazu Rudern und Drücken in instabiler Lage. Langsam und kontrolliert.',
    items: [
      ss(2, 30, ex('rudergeraet', 2, '120s'), ex('dead-bug', 2, 10)),
      ss(3, 60, ex('schulter-tippen', 3, 20), ex('trizeps-plank', 3, 10)),
      ss(3, 60, ex('einbein-rotation', 3, 8, 4), ex('beinheben-seitlich', 3, 8)),
      ss(3, 60, ex('crunch-gestreckt', 3, 12), ex('seitstuetz', 3, '30s')),
      ss(3, 60, ex('vierfuessler-rudern', 3, 10, 8), ex('v-sit-schulterdruecken', 3, 10, 3)),
      ss(3, 60, ex('renegade-row', 3, 8, 6), ex('hollow-hold', 3, '30s')),
    ],
  },
  {
    id: 'tpl-studio-hantel', name: 'Ganzkörper Hantel-Komplexe',
    note: 'Verbundene Bewegungen mit Kurzhanteln – viel Arbeit in wenig Zeit.',
    items: [
      ss(2, 30, ex('jump-lunge', 2, 20), ex('liegestuetz', 2, 10)),
      ss(3, 60, ex('sumo-jump-squat', 3, 12, 6), ex('kreuzheben-push-press', 3, 10, 6)),
      ss(3, 60, ex('rdl-rudern', 3, 10, 8), ex('goblet-squat', 3, 12, 10)),
      ss(3, 60, ex('clock-lunges', 3, 4), ex('around-the-world', 3, 10, 4)),
      ss(3, 60, ex('curl-trizeps', 3, 10, 4), ex('bizepscurl-seitlich', 3, 10, 4)),
      ss(3, 60, ex('trizeps-ueberkopf', 3, 12, 6), ex('seit-frontheben', 3, 10, 3)),
    ],
  },
];
