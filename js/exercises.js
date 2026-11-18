// Übungskatalog. Posen siehe figure.js (Winkel: 0° = oben, 90° = vorn/rechts, 180° = unten).

export const EQUIPMENT = [
  { id: 'kh', name: 'Kurzhanteln' },
  { id: 'lh', name: 'Langhantel' },
  { id: 'kb', name: 'Kettlebell' },
  { id: 'bank', name: 'Bank' },
  { id: 'stange', name: 'Klimmzugstange' },
  { id: 'band', name: 'Widerstandsband' },
];

const STAND = { hp: [50, 50], tr: 0, th: 180, sh: 180, ua: 180, fa: 180 };
const PUSH_UP = { hp: [50.7, 74.1], tr: 67, a: [14, 90], w: [76, 90] };
const OVERHEAD = '0 -8 100 100';

export const EXERCISES = [
  // ── Körpergewicht ──────────────────────────────────────────
  {
    id: 'liegestuetz', name: 'Liegestütz', equip: [], muscles: 'Brust · Trizeps · Schultern', mode: 'reps',
    desc: 'Hände etwas breiter als schulterbreit, Körper bildet eine gerade Linie. Brust kontrolliert bis knapp über den Boden senken, dann kräftig hochdrücken. Ellbogen ca. 45° vom Körper.',
    poses: [PUSH_UP, { hp: [53.7, 85.3], tr: 83, a: [14, 90], w: [76, 90] }],
  },
  {
    id: 'kniebeuge', name: 'Kniebeuge', equip: [], muscles: 'Oberschenkel · Gesäß', mode: 'reps',
    desc: 'Füße schulterbreit, Zehen leicht nach außen. Hüfte nach hinten und unten schieben, bis die Oberschenkel etwa waagerecht sind. Fersen bleiben am Boden, Knie folgen den Zehen.',
    poses: [
      { hp: [50, 50], tr: 0, a: [50, 90], ua: 90, fa: 90 },
      { hp: [37, 68], tr: 40, a: [50, 90], ua: 90, fa: 90 },
    ],
  },
  {
    id: 'ausfallschritt', name: 'Ausfallschritt', equip: [], muscles: 'Oberschenkel · Gesäß', mode: 'reps',
    desc: 'Großer Schritt nach vorn, dann senkrecht absenken, bis das hintere Knie knapp über dem Boden ist. Oberkörper aufrecht, vorderes Knie über dem Fuß. Seiten abwechseln oder pro Seite zählen.',
    poses: [
      { hp: [46, 53], tr: 0, a: [62, 90], a2: [30, 90], ua: 180, fa: 180 },
      { hp: [46, 70], tr: 0, a: [62, 90], a2: [30, 90], ua: 180, fa: 180 },
    ],
  },
  {
    id: 'unterarmstuetz', name: 'Unterarmstütz (Plank)', equip: [], muscles: 'Rumpf', mode: 'time',
    desc: 'Auf Unterarme und Zehen stützen, Ellbogen unter den Schultern. Bauch und Gesäß anspannen, Körper gerade halten – kein Hohlkreuz, Hüfte nicht nach oben schieben.',
    poses: [{ hp: [46.8, 80.6], tr: 76.4, a: [8, 90], ua: 180, fa: 90 }],
  },
  {
    id: 'seitstuetz', name: 'Seitstütz', equip: [], muscles: 'Seitliche Rumpfmuskulatur', mode: 'time',
    desc: 'Seitlich auf einen Unterarm stützen, Füße übereinander. Hüfte anheben, bis der Körper eine Linie bildet. Freien Arm nach oben strecken. Seitenwechsel nicht vergessen.',
    poses: [{ hp: [46.8, 80.6], tr: 76.4, a: [8, 90], ua: 180, fa: 90, ua2: 0, fa2: 0 }],
  },
  {
    id: 'hueftheben', name: 'Hüftheben (Glute Bridge)', equip: [], muscles: 'Gesäß · hintere Oberschenkel', mode: 'reps',
    desc: 'Rückenlage, Füße hüftbreit aufgestellt. Gesäß anspannen und Hüfte heben, bis Knie, Hüfte und Schultern eine Linie bilden. Oben kurz halten, langsam absenken.',
    poses: [
      { hp: [50, 84], tr: 270, hd: 270, a: [72, 90], ua: 100, fa: 95 },
      { hp: [48, 73.6], tr: 248, hd: 270, a: [72, 90], ua: 100, fa: 95 },
    ],
  },
  {
    id: 'bergsteiger', name: 'Bergsteiger (Mountain Climber)', equip: [], muscles: 'Rumpf · Hüftbeuger · Ausdauer', mode: 'time',
    desc: 'Aus dem hohen Liegestütz die Knie abwechselnd zügig zur Brust ziehen. Hüfte tief und stabil halten, Schultern über den Händen.',
    poses: [
      { ...PUSH_UP, a2: [52, 86] },
      { ...PUSH_UP, a: [52, 86], a2: [14, 90] },
    ],
  },
  {
    id: 'wandsitzen', name: 'Wandsitzen', equip: [], muscles: 'Oberschenkel', mode: 'time',
    desc: 'Rücken an die Wand, herunterrutschen bis die Oberschenkel waagerecht sind und die Knie über den Fersen stehen. Position halten, gleichmäßig atmen.',
    props: [{ t: 'wall', x: 26 }],
    poses: [{ hp: [31, 66], tr: 0, a: [53, 90], ua: 90, fa: 90 }],
  },
  {
    id: 'superman', name: 'Superman', equip: [], muscles: 'Unterer Rücken · Gesäß', mode: 'reps',
    desc: 'Bauchlage, Arme nach vorn gestreckt. Arme, Brust und Beine gleichzeitig leicht anheben, kurz halten und kontrolliert ablegen. Blick zum Boden.',
    poses: [
      { hp: [40, 85], tr: 91, hd: 89, th: 268, sh: 268, ua: 95, fa: 95 },
      { hp: [40, 85], tr: 77, hd: 73, th: 280, sh: 280, ua: 74, fa: 74 },
    ],
  },
  {
    id: 'crunch', name: 'Crunch', equip: [], muscles: 'Gerade Bauchmuskulatur', mode: 'reps',
    desc: 'Rückenlage, Beine aufgestellt. Oberkörper einrollen, bis die Schulterblätter abheben – der untere Rücken bleibt am Boden. Langsam zurück, Nacken locker.',
    poses: [
      { hp: [56, 84], tr: 270, hd: 270, a: [80, 90], ua: 100, fa: 98 },
      { hp: [56, 84], tr: 300, hd: 305, a: [80, 90], ua: 105, fa: 105 },
    ],
  },
  {
    id: 'hollow-hold', name: 'Hollow Hold', equip: [], muscles: 'Rumpf', mode: 'time',
    desc: 'Rückenlage, unteren Rücken fest in den Boden drücken. Schultern und gestreckte Beine leicht anheben, Arme neben den Ohren. Je flacher, desto schwerer.',
    poses: [{ hp: [54, 82], tr: 285, hd: 285, th: 75, sh: 75, ua: 290, fa: 290 }],
  },
  {
    id: 'bank-dips', name: 'Dips an der Bank', equip: ['bank'], muscles: 'Trizeps · Brust', mode: 'reps',
    desc: 'Hände schulterbreit hinter dir auf der Bankkante, Beine gestreckt. Ellbogen nach hinten beugen und den Körper absenken, bis die Oberarme etwa waagerecht sind. Wieder hochdrücken.',
    props: [{ t: 'bench', x: 12, y: 66, w: 32 }],
    poses: [
      { hp: [48, 68], tr: 356, w: [42, 66], a: [82, 90] },
      { hp: [48, 80], tr: 356, w: [42, 66], a: [82, 90] },
    ],
  },
  {
    id: 'klimmzug', name: 'Klimmzug', equip: ['stange'], muscles: 'Rücken · Bizeps', mode: 'reps',
    desc: 'Obergriff etwas breiter als schulterbreit. Aus dem gestreckten Hang Schulterblätter nach unten ziehen und hochziehen, bis das Kinn über der Stange ist. Kontrolliert ablassen.',
    noGround: true, props: [{ t: 'bar', x: 56, y: 12 }],
    poses: [
      { hp: [51, 67], tr: 0, w: [56, 12], th: 185, sh: 245 },
      { hp: [48, 49], tr: 0, hd: 6, w: [56, 12], th: 185, sh: 245 },
    ],
  },
  {
    id: 'beinheben-haengend', name: 'Hängendes Beinheben', equip: ['stange'], muscles: 'Bauch · Hüftbeuger', mode: 'reps',
    desc: 'An der Stange hängen, Schultern aktiv. Gestreckte Beine ohne Schwung bis zur Waagerechten (oder höher) heben und langsam senken. Leichter: Knie anziehen.',
    noGround: true, view: '0 0 100 106', props: [{ t: 'bar', x: 56, y: 8 }],
    poses: [
      { hp: [51, 63], tr: 0, w: [56, 8], th: 180, sh: 180 },
      { hp: [50, 63], tr: 354, w: [56, 8], th: 95, sh: 95 },
    ],
  },

  // ── Kurzhanteln ───────────────────────────────────────────
  {
    id: 'bizepscurl', name: 'Bizepscurl', equip: ['kh'], muscles: 'Bizeps', mode: 'reps',
    desc: 'Aufrecht stehen, Hanteln mit Untergriff. Ellbogen fest am Körper, Hanteln zur Schulter beugen und langsam ablassen. Kein Schwung aus dem Rücken.',
    props: [{ t: 'db' }],
    poses: [{ ...STAND, ua: 172 }, { ...STAND, ua: 165, fa: 20 }],
  },
  {
    id: 'schulterdruecken-kh', name: 'Schulterdrücken', equip: ['kh'], muscles: 'Schultern · Trizeps', mode: 'reps',
    desc: 'Hanteln auf Schulterhöhe, Handflächen nach vorn. Senkrecht über den Kopf drücken, ohne ins Hohlkreuz zu gehen. Kontrolliert zurück auf Schulterhöhe.',
    view: OVERHEAD, props: [{ t: 'db' }],
    poses: [{ ...STAND, ua: 160, fa: 5 }, { ...STAND, ua: 2, fa: 0 }],
  },
  {
    id: 'rudern-kh', name: 'Vorgebeugtes Rudern', equip: ['kh'], muscles: 'Oberer Rücken · Bizeps', mode: 'reps',
    desc: 'Knie leicht gebeugt, Oberkörper mit geradem Rücken weit vorbeugen. Hanteln zur Hüfte ziehen, Schulterblätter zusammen. Langsam ablassen.',
    props: [{ t: 'db' }],
    poses: [
      { hp: [44, 52], tr: 68, a: [50, 90], ua: 180, fa: 180 },
      { hp: [44, 52], tr: 68, a: [50, 90], ua: 240, fa: 180 },
    ],
  },
  {
    id: 'goblet-squat', name: 'Goblet Squat', equip: ['kh'], muscles: 'Oberschenkel · Gesäß · Rumpf', mode: 'reps',
    desc: 'Eine Hantel senkrecht vor der Brust halten. Tief in die Hocke gehen, Ellbogen zwischen die Knie, Oberkörper aufrecht. Über die Fersen hochdrücken. Geht auch mit Kettlebell.',
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [50, 50], tr: 0, a: [50, 90], w: [61, 30] },
      { hp: [37, 68], tr: 35, a: [50, 90], w: [63, 44] },
    ],
  },
  {
    id: 'rumaenisches-kreuzheben', name: 'Rumänisches Kreuzheben', equip: ['kh'], muscles: 'Hintere Oberschenkel · Gesäß · Rücken', mode: 'reps',
    desc: 'Knie leicht gebeugt, Hüfte nach hinten schieben und Hanteln nah an den Beinen bis unter die Knie führen. Rücken bleibt gerade. Hüfte nach vorn bringen und aufrichten.',
    props: [{ t: 'db' }],
    poses: [STAND, { hp: [41, 52], tr: 80, a: [50, 90], ua: 180, fa: 180 }],
  },
  {
    id: 'bankdruecken-kh', name: 'Bankdrücken (Kurzhantel)', equip: ['kh', 'bank'], muscles: 'Brust · Trizeps · Schultern', mode: 'reps',
    desc: 'Rückenlage auf der Bank, Füße fest am Boden. Hanteln seitlich auf Brusthöhe absenken, dann über der Brust zusammen nach oben drücken.',
    props: [{ t: 'bench', x: 8, y: 72, w: 56 }, { t: 'db', both: false }],
    poses: [
      { hp: [52, 67], tr: 270, hd: 270, a: [76, 90], w: [30, 56] },
      { hp: [52, 67], tr: 270, hd: 270, a: [76, 90], w: [25, 40] },
    ],
  },
  {
    id: 'frontheben', name: 'Frontheben', equip: ['kh'], muscles: 'Vordere Schulter', mode: 'reps',
    desc: 'Aufrecht stehen, Hanteln vor den Oberschenkeln. Mit fast gestreckten Armen bis auf Schulterhöhe nach vorn heben und langsam senken. Leichtes Gewicht wählen.',
    props: [{ t: 'db' }],
    poses: [STAND, { ...STAND, ua: 90, fa: 88 }],
  },

  // ── Langhantel ────────────────────────────────────────────
  {
    id: 'kniebeuge-lh', name: 'Kniebeuge (Langhantel)', equip: ['lh'], muscles: 'Oberschenkel · Gesäß · Rücken', mode: 'reps',
    desc: 'Hantel auf dem oberen Rücken, nicht auf dem Nacken. Brust raus, Rumpf fest. Hüfte nach hinten-unten bis mindestens waagerecht, dann kraftvoll aufstehen.',
    props: [{ t: 'bb', at: 'n', back: 4 }],
    poses: [
      { hp: [50, 50], tr: 0, a: [50, 90], ua: 195, fa: 15 },
      { hp: [37, 68], tr: 35, a: [50, 90], ua: 230, fa: 50 },
    ],
  },
  {
    id: 'kreuzheben', name: 'Kreuzheben', equip: ['lh'], muscles: 'Rücken · Gesäß · hintere Oberschenkel', mode: 'reps',
    desc: 'Stange über dem Mittelfuß, schulterbreit greifen. Rücken gerade, Brust raus, Hantel nah am Körper vom Boden drücken, bis du aufrecht stehst. Kontrolliert ablegen.',
    props: [{ t: 'bb' }],
    poses: [
      { hp: [40, 68], tr: 65, a: [55, 90], w: [56, 83] },
      { hp: [55, 50], tr: 0, a: [55, 90], ua: 180, fa: 180 },
    ],
  },
  {
    id: 'bankdruecken-lh', name: 'Bankdrücken (Langhantel)', equip: ['lh', 'bank'], muscles: 'Brust · Trizeps · Schultern', mode: 'reps',
    desc: 'Schulterblätter zusammen, Füße fest am Boden. Stange kontrolliert zur unteren Brust senken und senkrecht nach oben drücken. Am besten mit Ablage und Sicherung.',
    props: [{ t: 'bench', x: 8, y: 72, w: 56 }, { t: 'bb' }],
    poses: [
      { hp: [52, 67], tr: 270, hd: 270, a: [76, 90], w: [30, 59] },
      { hp: [52, 67], tr: 270, hd: 270, a: [76, 90], w: [26, 40] },
    ],
  },
  {
    id: 'rudern-lh', name: 'Langhantelrudern', equip: ['lh'], muscles: 'Oberer Rücken · Bizeps', mode: 'reps',
    desc: 'Vorgebeugt mit geradem Rücken, Stange schulterbreit greifen. Zum Bauchnabel ziehen, Ellbogen nah am Körper, Schulterblätter zusammen. Langsam ablassen.',
    props: [{ t: 'bb' }],
    poses: [
      { hp: [44, 52], tr: 68, a: [50, 90], ua: 180, fa: 180 },
      { hp: [44, 52], tr: 68, a: [50, 90], ua: 240, fa: 180 },
    ],
  },

  // ── Kettlebell ────────────────────────────────────────────
  {
    id: 'kb-swing', name: 'Kettlebell Swing', equip: ['kb'], muscles: 'Gesäß · hintere Oberschenkel · Rumpf', mode: 'reps',
    desc: 'Kettlebell zwischen den Beinen nach hinten schwingen, Hüfte beugen. Mit explosivem Hüftstoß nach vorn auf Brusthöhe schwingen – die Kraft kommt aus der Hüfte, nicht aus den Armen.',
    props: [{ t: 'kb' }],
    poses: [
      { hp: [42, 52], tr: 65, a: [52, 90], ua: 200, fa: 200 },
      { hp: [51, 50], tr: 0, a: [52, 90], ua: 90, fa: 90 },
    ],
  },

  // ── Widerstandsband ───────────────────────────────────────
  {
    id: 'band-rudern', name: 'Rudern mit Band', equip: ['band'], muscles: 'Oberer Rücken · Bizeps', mode: 'reps',
    desc: 'Band vorn auf Brusthöhe befestigen. Aufrecht stehen, Ellbogen nach hinten ziehen und Schulterblätter zusammendrücken. Langsam nachgeben.',
    props: [{ t: 'band', from: [97, 34] }],
    poses: [{ ...STAND, ua: 98, fa: 95 }, { ...STAND, ua: 205, fa: 85 }],
  },
  {
    id: 'band-brustpresse', name: 'Brustpresse mit Band', equip: ['band'], muscles: 'Brust · Trizeps', mode: 'reps',
    desc: 'Band hinter dir auf Brusthöhe befestigen. Hände vor der Brust, nach vorn drücken bis die Arme gestreckt sind. Kontrolliert zurück.',
    props: [{ t: 'band', from: [3, 34] }],
    poses: [{ ...STAND, ua: 205, fa: 85 }, { ...STAND, ua: 95, fa: 92 }],
  },
];

export const byId = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));

// Geschätztes Tempo in Sekunden pro Wiederholung (eine kontrollierte Ab- und Aufwärtsbewegung).
// Grundlage für Autopilot und Zeitschätzung; in den Einstellungen pro Übung anpassbar.
export const TEMPO = {
  liegestuetz: 2.5, kniebeuge: 3, ausfallschritt: 3.5, hueftheben: 2.5, superman: 3, crunch: 2.5,
  'bank-dips': 2.5, klimmzug: 3.5, 'beinheben-haengend': 3, bergsteiger: 1, seitstuetz: 3, unterarmstuetz: 3,
  wandsitzen: 3, 'hollow-hold': 3,
  bizepscurl: 3, 'schulterdruecken-kh': 3, 'rudern-kh': 3, 'goblet-squat': 3.5, 'rumaenisches-kreuzheben': 4,
  'bankdruecken-kh': 3, frontheben: 3,
  'kniebeuge-lh': 4, kreuzheben: 4.5, 'bankdruecken-lh': 3.5, 'rudern-lh': 3,
  'kb-swing': 2, 'band-rudern': 2.5, 'band-brustpresse': 2.5,
};
