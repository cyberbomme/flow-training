// Motivationstexte – zufällig, aber je Training ohne Wiederholung gemischt (siehe pickText in app.js).
// Ton nach docs/DESIGN.md §7: Du-Ansprache, ruhig, bestärkend, vorsichtig; Emojis nur in Erfolgsmeldungen.
// Längen sind auf die festen Plätze der Trainingsseiten abgestimmt – beim Ergänzen die Grenzen einhalten.

// Leitsätze aus dem Markenauftritt (DESIGN.md §1) – nicht umformulieren
export const BRAND = [
  'Dein Zyklus. Deine Stärke.',
  'Trainiere mit deinem Körper, nicht gegen ihn.',
  'Anpassung – nicht Verzicht.',
  'Kraft ist mehr als Optik.',
  'Regeneration ist kein Trainingsausfall. Sie ist Teil des Trainings.',
];

// Untertitel in der Pause – max. 35 Zeichen (eine Zeile, auch auf dem iPhone SE)
export const PAUSE_LINES = [
  'Durchatmen. Erholung zählt.',
  'Kurz sammeln, dann geht’s weiter.',
  'Atme ruhig ein und lang aus.',
  'Schultern locker, Kiefer entspannt.',
  'Ein Schluck Wasser tut jetzt gut.',
  'Pause ist Teil des Trainings.',
  'Spür kurz nach, wie es sich anfühlt.',
  'Hör auf deinen Körper.',
  'Ruhig werden, Kraft sammeln.',
  'Lass den Puls kurz sinken.',
  'Anpassung – nicht Verzicht.',
  'Gut gemacht. Gleich geht’s weiter.',
];

// Titel der Abschluss-Seite – max. 15 Zeichen (Großbuchstaben, eine Zeile)
export const DONE_TITLES = [
  'Stark gemacht!',
  'Geschafft!',
  'Gut gemacht!',
  'Starke Einheit!',
  'Richtig stark!',
  'Klasse Arbeit!',
  'Super gemacht!',
];

// Merksatz auf der Abschluss-Seite – max. 70 Zeichen (zwei Zeilen)
export const QUOTES = [
  ...BRAND,
  'Jede Wiederholung zählt – auch an leichten Tagen.',
  'Stärke wächst in der Erholung danach.',
  'Du warst heute für dich da.',
  'Beständigkeit schlägt Perfektion.',
  'Kleine Schritte, starke Wirkung.',
  'Heute stark, morgen gut erholt.',
  'Bewegung ist Selbstfürsorge.',
  'Dein Tempo ist das richtige Tempo.',
];

// Meldung nach dem Speichern – Emojis sparsam und warm (DESIGN.md §7)
export const SAVE_TOASTS = [
  'Stark gemacht! 💚 Training gespeichert',
  'Gespeichert – gönn dir die Erholung 💚',
  'Training gespeichert. Gut gemacht 🤎',
  'Gespeichert. Dein Fortschritt wächst 💪🏼',
];
