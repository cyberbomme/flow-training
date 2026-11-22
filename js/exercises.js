// Übungskatalog. Posen siehe figure.js (Winkel: 0° = oben, 90° = vorn/rechts, 180° = unten).

export const EQUIPMENT = [
  { id: 'kh', name: 'Kurzhanteln' },
  { id: 'lh', name: 'Langhantel' },
  { id: 'kb', name: 'Kettlebell' },
  { id: 'bank', name: 'Bank' },
  { id: 'stange', name: 'Klimmzugstange' },
  { id: 'band', name: 'Widerstandsband' },
  { id: 'trx', name: 'Schlingentrainer' },
  { id: 'rope', name: 'Battle Rope' },
  { id: 'ruder', name: 'Rudergerät' },
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
  // ── Aus den Studio-Workouts (2026-11-19) ──────────────────
  // side: true = Wiederholungen je Seite
  // Aufwärmen / Ausdauer
  {
    id: 'rudergeraet', name: 'Rudergerät', equip: ['ruder'], muscles: 'Rücken · Oberschenkel · Ausdauer', mode: 'time',
    desc: 'Zug in der Reihenfolge Beine – Rumpf – Arme, zurück umgekehrt: Arme strecken, Oberkörper vor, dann Knie beugen. Rücken lang, Griff locker. Zum Aufwärmen ruhiges, gleichmäßiges Tempo.',
    props: [{ t: 'bench', x: 10, y: 82, w: 62 }, { t: 'band', from: [78, 70] }],
    poses: [
      { hp: [38, 79], tr: 22, a: [66, 80], ab: -1, ua: 70, fa: 75 },
      { hp: [20, 79], tr: 345, a: [60, 80], w: [34, 62] },
    ],
  },
  {
    id: 'crawling', name: 'Bärengang (Crawling)', equip: [], muscles: 'Rumpf · Schultern · Oberschenkel', mode: 'reps',
    desc: 'Vierfüßlerstand, Knie schweben eine Handbreit über dem Boden. Gegengleich Hand und Fuß ein kleines Stück nach vorn setzen. Rücken flach, Hüfte ruhig – langsam ist schwerer als schnell.',
    poses: [
      { hp: [42, 64], tr: 86, a: [34, 90], a2: [42, 90], w: [70, 90], w2: [76, 90] },
      { hp: [48, 64], tr: 86, a: [48, 90], a2: [40, 90], w: [82, 90], w2: [76, 90] },
    ],
  },
  {
    id: 'schattenboxen', name: 'Schattenboxen', equip: [], muscles: 'Schultern · Arme · Ausdauer', mode: 'time',
    desc: 'Lockere Schrittstellung, Knie leicht gebeugt, Fäuste vor dem Kinn. Abwechselnd gerade Schläge nach vorn, dabei aus der Hüfte drehen. Leicht auf den Fußballen federn.',
    poses: [
      { hp: [48, 52], tr: 4, a: [60, 90], a2: [38, 90], ua: 160, fa: 25, ua2: 165, fa2: 20 },
      { hp: [50, 52], tr: 8, a: [60, 90], a2: [38, 90], ua: 88, fa: 88, ua2: 165, fa2: 20 },
    ],
  },
  {
    id: 'seitsprints', name: 'Seitliche Sprints (Side Shuffle)', equip: [], muscles: 'Oberschenkel · Gesäß · Ausdauer', mode: 'time',
    desc: 'Tiefe, breite Grundstellung. Mit schnellen, kurzen Schritten seitlich laufen, ohne die Füße zu kreuzen. Nach ein paar Schritten die Richtung wechseln.',
    poses: [
      { hp: [42, 58], tr: 0, a: [30, 90], a2: [54, 90], ua: 165, fa: 60, ua2: 195, fa2: 300 },
      { hp: [58, 58], tr: 0, a: [46, 90], a2: [70, 90], ua: 165, fa: 60, ua2: 195, fa2: 300 },
    ],
  },
  {
    id: 'sprints', name: 'Sprint auf der Stelle', equip: [], muscles: 'Oberschenkel · Hüftbeuger · Ausdauer', mode: 'time',
    desc: 'Auf der Stelle laufen, Knie zügig bis etwa Hüfthöhe ziehen, auf den Fußballen landen. Arme kräftig gegengleich mitschwingen.',
    poses: [
      { hp: [50, 49], tr: 5, th: 85, sh: 175, th2: 182, sh2: 182, ua: 210, fa: 120, ua2: 130, fa2: 40 },
      { hp: [50, 49], tr: 5, th: 182, sh: 182, th2: 85, sh2: 175, ua: 130, fa: 40, ua2: 210, fa2: 120 },
    ],
  },
  {
    id: 'crossleg-jumps', name: 'Hampelmann mit Überkreuzen', equip: [], muscles: 'Oberschenkel · Schultern · Ausdauer', mode: 'time',
    desc: 'Wie ein Hampelmann, aber die Beine landen abwechselnd überkreuzt statt geschlossen. Arme schwingen über den Kopf und vor dem Körper wieder zusammen.',
    view: OVERHEAD,
    poses: [
      { hp: [50, 50], tr: 0, a: [57, 90], a2: [43, 90], ua: 160, fa: 160, ua2: 200, fa2: 200 },
      { hp: [50, 48], tr: 0, a: [32, 88], a2: [68, 88], ua: 35, fa: 25, ua2: 325, fa2: 335 },
    ],
  },
  {
    id: 'walkout', name: 'Walkout', equip: [], muscles: 'Rumpf · Schultern · hintere Oberschenkel', mode: 'reps',
    desc: 'Aus dem Stand nach vorn beugen, Hände vor den Füßen aufsetzen und in den hohen Liegestütz laufen. Kurz halten, mit den Händen zurücklaufen und aufrichten.',
    poses: [
      { hp: [21, 52], tr: 150, a: [18, 90], w: [38, 90] },
      { hp: [54.7, 74.1], tr: 67, a: [18, 90], w: [80, 90] },
    ],
  },
  {
    id: 'wand-liegestuetz', name: 'Liegestütz an der Wand', equip: [], muscles: 'Brust · Trizeps · Schultern', mode: 'reps',
    desc: 'Hände schulterbreit auf Brusthöhe an die Wand, Füße etwas zurück. Körper gerade halten, Brust zur Wand senken und wieder wegdrücken. Leichter Einstieg oder zum Aufwärmen.',
    props: [{ t: 'wall', x: 86 }],
    poses: [
      { hp: [52, 54], tr: 18, a: [40, 90], w: [86, 33] },
      { hp: [58, 55], tr: 27, a: [40, 90], w: [86, 33] },
    ],
  },

  // Beine & Gesäß
  {
    id: 'jump-squat', name: 'Sprungkniebeuge (Jump Squat)', equip: [], muscles: 'Oberschenkel · Gesäß · Ausdauer', mode: 'reps',
    desc: 'Aus der Kniebeuge explosiv nach oben springen, Arme schwingen mit. Weich über die Fußballen landen und direkt in die nächste Kniebeuge abfedern.',
    view: OVERHEAD,
    poses: [
      { hp: [37, 68], tr: 40, a: [50, 90], ua: 215, fa: 215 },
      { hp: [50, 42], tr: 2, th: 182, sh: 176, ua: 20, fa: 15 },
    ],
  },
  {
    id: 'jump-lunge', name: 'Ausfallschrittsprung (Jump Lunge)', equip: [], muscles: 'Oberschenkel · Gesäß · Ausdauer', mode: 'reps',
    desc: 'Aus dem Ausfallschritt hochspringen und in der Luft die Beine wechseln. Weich landen, hinteres Knie knapp über dem Boden. Zählweise: jede Landung ist eine Wiederholung.',
    poses: [
      { hp: [46, 70], tr: 0, a: [62, 90], a2: [30, 90], ua: 200, fa: 140, ua2: 150, fa2: 60 },
      { hp: [46, 70], tr: 0, a: [30, 90], a2: [62, 90], ua: 150, fa: 60, ua2: 200, fa2: 140 },
    ],
  },
  {
    id: 'einbeinsprung', name: 'Einbeinige Sprünge', equip: [], muscles: 'Oberschenkel · Wade · Gesäß', mode: 'reps', side: true,
    desc: 'Auf einem Bein stehen, Knie leicht gebeugt. Kleine, kontrollierte Sprünge nach oben, weich und leise über den Fußballen landen. Das Knie bleibt über dem Fuß.',
    poses: [
      { hp: [48, 56], tr: 10, a: [50, 90], th2: 160, sh2: 230, ua: 200, fa: 200 },
      { hp: [50, 46], tr: 4, th: 182, sh: 178, th2: 160, sh2: 230, ua: 30, fa: 30 },
    ],
  },
  {
    id: 'reverse-lunge-knee', name: 'Ausfallschritt rückwärts + Knieheben', equip: [], muscles: 'Oberschenkel · Gesäß · Hüftbeuger', mode: 'reps', side: true,
    desc: 'Großer Schritt zurück und absenken, bis das hintere Knie fast den Boden berührt. Kraftvoll aufstehen und das hintere Knie bis auf Hüfthöhe nach vorn ziehen. Erst alle Wiederholungen auf einer Seite.',
    poses: [
      { hp: [50, 70], tr: 5, a2: [64, 90], a: [32, 90], ua: 150, fa: 60, ua2: 200, fa2: 160 },
      { hp: [50, 50], tr: 0, th2: 180, sh2: 180, th: 85, sh: 180, ua: 200, fa: 160, ua2: 150, fa2: 60 },
    ],
  },
  {
    id: 'seitlicher-ausfallschritt', name: 'Seitlicher Ausfallschritt', equip: [], muscles: 'Oberschenkel · Gesäß · Adduktoren', mode: 'reps', side: true,
    desc: 'Breiter Schritt zur Seite, Hüfte nach hinten schieben und ins Knie des Schrittbeins sinken. Das andere Bein bleibt gestreckt, beide Fersen am Boden. Kraftvoll zurück in den Stand.',
    poses: [
      { hp: [50, 50], tr: 0, a: [45, 90], a2: [55, 90], ab: 1, ua: 160, fa: 40, ua2: 200, fa2: 320 },
      { hp: [38, 66], tr: 350, a: [28, 90], a2: [74, 89], ab: 1, ua: 160, fa: 40, ua2: 200, fa2: 320 },
    ],
  },
  {
    id: 'cossack-squat', name: 'Kosakenkniebeuge (Cossack Squat)', equip: [], muscles: 'Oberschenkel · Gesäß · Adduktoren', mode: 'reps', side: true,
    desc: 'Sehr breiter Stand. Gewicht auf eine Seite verlagern und tief in dieses Knie sinken, das andere Bein streckt sich, Zehen zeigen nach oben. Oberkörper aufrecht. Variante: gehend, mit jedem Schritt Seite wechseln.',
    poses: [
      { hp: [50, 55], tr: 0, a: [30, 90], a2: [70, 90], ab: 1, ua: 150, fa: 60, ua2: 210, fa2: 300 },
      { hp: [37, 73], tr: 5, a: [30, 90], a2: [76, 88], ab: 1, ua: 120, fa: 80, ua2: 240, fa2: 280 },
    ],
  },
  {
    id: 'clock-lunges', name: 'Uhr-Ausfallschritte (Clock Lunges)', equip: [], muscles: 'Oberschenkel · Gesäß', mode: 'reps', side: true,
    desc: 'Ein Bein bleibt in der Mitte stehen, das andere macht nacheinander Ausfallschritte nach vorn, zur Seite und nach hinten – wie die Zeiger einer Uhr. Eine Runde = eine Wiederholung.',
    poses: [
      { hp: [57, 70], tr: 0, a: [73, 90], a2: [40, 90], ab2: -1 },
      { hp: [44, 70], tr: 5, a: [26, 90], a2: [58, 90] },
    ],
  },
  {
    id: 'bulgarian-split-squat', name: 'Bulgarische Kniebeuge', equip: ['bank'], muscles: 'Oberschenkel · Gesäß', mode: 'reps', side: true,
    desc: 'Rückwärts vor die Bank stellen, hinteren Fußrücken auflegen. Senkrecht absenken, bis der vordere Oberschenkel fast waagerecht ist. Vorderes Knie über dem Fuß, Oberkörper leicht vorgeneigt. Mit Kurzhanteln schwerer.',
    props: [{ t: 'bench', x: 6, y: 70, w: 24 }],
    poses: [
      { hp: [50, 52], tr: 4, a: [64, 90], a2: [26, 70], ab2: 1 },
      { hp: [46, 68], tr: 12, a: [64, 90], a2: [26, 70], ab2: 1 },
    ],
  },
  {
    id: 'einbeiniges-kreuzheben', name: 'Einbeiniges Kreuzheben', equip: ['kh'], muscles: 'Hintere Oberschenkel · Gesäß · Rumpf', mode: 'reps', side: true,
    desc: 'Auf einem Bein stehen, Knie weich. Oberkörper nach vorn kippen, das freie Bein streckt sich nach hinten, bis Rumpf und Bein fast waagerecht sind. Hüfte bleibt gerade, Hanteln nah am Standbein.',
    props: [{ t: 'db' }],
    poses: [
      { ...STAND, th2: 182, sh2: 182 },
      { hp: [46, 51], tr: 84, a: [48, 90], th2: 268, sh2: 268, ua: 180, fa: 180 },
    ],
  },
  {
    id: 'hip-thrust', name: 'Hip Thrust', equip: ['bank'], muscles: 'Gesäß · hintere Oberschenkel', mode: 'reps',
    desc: 'Oberer Rücken an der Bankkante, Füße hüftbreit aufgestellt. Hüfte heben, bis Knie, Hüfte und Schultern eine Linie bilden, oben das Gesäß fest anspannen. Kinn zur Brust. Schwerer mit Kurzhantel auf der Hüfte.',
    props: [{ t: 'bench', x: 6, y: 62, w: 30 }],
    poses: [
      { hp: [50, 80], tr: 302, hd: 290, a: [72, 90], ua: 260, fa: 260 },
      { hp: [58, 64], tr: 272, hd: 290, a: [72, 90], ua: 260, fa: 260 },
    ],
  },
  {
    id: 'hip-thrust-einbeinig', name: 'Hip Thrust einbeinig', equip: ['bank'], muscles: 'Gesäß · hintere Oberschenkel', mode: 'reps', side: true,
    desc: 'Wie der Hip Thrust, aber ein Bein ist angewinkelt angehoben. Über die Ferse des Standbeins hochdrücken, Becken bleibt waagerecht. Erst alle Wiederholungen auf einer Seite.',
    props: [{ t: 'bench', x: 6, y: 62, w: 30 }],
    poses: [
      { hp: [50, 80], tr: 302, hd: 290, a: [72, 90], th2: 30, sh2: 110, ua: 260, fa: 260 },
      { hp: [58, 64], tr: 272, hd: 290, a: [72, 90], th2: 40, sh2: 120, ua: 260, fa: 260 },
    ],
  },
  {
    id: 'hamstring-bruecke', name: 'Hüftheben mit Füßen auf der Box', equip: ['bank'], muscles: 'Hintere Oberschenkel · Gesäß', mode: 'reps',
    desc: 'Rückenlage, Fersen auf Box oder Bank. Über die Fersen drücken und die Hüfte heben – die Spannung liegt in den hinteren Oberschenkeln. Oben kurz halten, langsam absenken. Schwerer: einbeinig.',
    props: [{ t: 'bench', x: 62, y: 72, w: 24 }],
    poses: [
      { hp: [46, 85], tr: 270, hd: 270, a: [74, 72], ua: 90, fa: 90 },
      { hp: [44, 73], tr: 245, hd: 265, a: [74, 72], ua: 110, fa: 100 },
    ],
  },
  {
    id: 'good-morning', name: 'Good Morning', equip: [], muscles: 'Hintere Oberschenkel · Gesäß · Unterer Rücken', mode: 'reps',
    desc: 'Hände an den Hinterkopf, Knie leicht gebeugt. Hüfte nach hinten schieben und den Oberkörper mit geradem Rücken nach vorn kippen, bis er fast waagerecht ist. Über die Hüfte aufrichten. Schwerer mit Hantel auf dem Rücken.',
    poses: [
      { ...STAND, ua: 30, fa: 230 },
      { hp: [42, 51], tr: 82, a: [50, 90], ua: 115, fa: 315 },
    ],
  },
  {
    id: 'kang-squat', name: 'Kang Squat', equip: [], muscles: 'Hintere Oberschenkel · Gesäß · Oberschenkel', mode: 'reps',
    desc: 'Verbindet Good Morning und Kniebeuge: Hüfte nach hinten, Oberkörper waagerecht kippen, dann aus dieser Position in die tiefe Hocke sinken und den Oberkörper aufrichten. Den Weg zurück umgekehrt.',
    poses: [
      { hp: [42, 51], tr: 82, a: [50, 90], ua: 115, fa: 315 },
      { hp: [37, 70], tr: 35, a: [50, 90], ua: 60, fa: 260 },
    ],
  },
  {
    id: 'beincurl-kh', name: 'Beincurl liegend', equip: ['kh'], muscles: 'Hintere Oberschenkel', mode: 'reps',
    desc: 'Bauchlage, eine Kurzhantel zwischen den Füßen einklemmen. Unterschenkel langsam bis senkrecht anbeugen und kontrolliert absenken. Becken bleibt am Boden. Alternative: Gleitpads in Rückenlage.',
    poses: [
      { hp: [50, 86], tr: 268, hd: 280, th: 92, sh: 92, ua: 230, fa: 80 },
      { hp: [50, 86], tr: 268, hd: 280, th: 92, sh: 10, ua: 230, fa: 80 },
    ],
  },
  {
    id: 'diagonal-ausfallschritt-band', name: 'Diagonaler Ausfallschritt mit Band', equip: ['band'], muscles: 'Oberschenkel · Gesäß', mode: 'reps', side: true,
    desc: 'Mini-Band über den Knien. Schräg nach vorn in den Ausfallschritt, unten zweimal leicht nachfedern, dann zurück. Knie gegen das Band nach außen drücken.',
    poses: [
      { ...STAND, ua: 160, fa: 40 },
      { hp: [50, 69], tr: 8, a: [66, 90], a2: [34, 90], ua: 160, fa: 40 },
    ],
  },

  // Ganzkörper mit Kurzhanteln
  {
    id: 'thruster', name: 'Thruster', equip: ['kh'], muscles: 'Oberschenkel · Gesäß · Schultern', mode: 'reps',
    desc: 'Hanteln auf Schulterhöhe, in die Kniebeuge gehen. Kraftvoll aufstehen und den Schwung direkt nutzen, um die Hanteln über den Kopf zu drücken. In einer flüssigen Bewegung zurück in die Hocke.',
    view: OVERHEAD, props: [{ t: 'db' }],
    poses: [
      { hp: [37, 68], tr: 35, a: [50, 90], ua: 190, fa: 25 },
      { ...STAND, ua: 2, fa: 0 },
    ],
  },
  {
    id: 'snatch-einarmig', name: 'Snatch einarmig', equip: ['kh'], muscles: 'Gesäß · hintere Oberschenkel · Schultern', mode: 'reps', side: true,
    desc: 'Hantel zwischen den Füßen. Aus Hüfte und Beinen explosiv strecken, die Hantel nah am Körper hochziehen und in einem Zug über den Kopf führen. Arm oben gestreckt, kontrolliert zurück.',
    view: OVERHEAD, props: [{ t: 'db', both: false }],
    poses: [
      { hp: [40, 62], tr: 55, a: [52, 90], w: [56, 84], ua2: 170, fa2: 170 },
      { ...STAND, ua: 2, fa: 0, ua2: 182, fa2: 182 },
    ],
  },
  {
    id: 'snatch-beidarmig', name: 'Snatch beidarmig (Double Snatch)', equip: ['kh'], muscles: 'Gesäß · hintere Oberschenkel · Schultern', mode: 'reps',
    desc: 'Eine Hantel in jeder Hand, zwischen den Füßen. Explosiv aus der Hüfte strecken und beide Hanteln in einem Zug über den Kopf bringen. Rumpf fest, kein Hohlkreuz.',
    view: OVERHEAD, props: [{ t: 'db' }],
    poses: [
      { hp: [40, 62], tr: 55, a: [52, 90], w: [56, 84] },
      { ...STAND, ua: 2, fa: 0 },
    ],
  },
  {
    id: 'high-pull', name: 'Sumo High Pull', equip: ['kh'], muscles: 'Schultern · Oberer Rücken · Gesäß', mode: 'reps',
    desc: 'Breiter Stand, Zehen nach außen, eine Hantel oder Kettlebell mit beiden Händen. Aus der Hocke aufstehen und das Gewicht nah am Körper bis unters Kinn ziehen, Ellbogen hoch und außen.',
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [44, 63], tr: 18, a: [54, 90], ua: 178, fa: 178 },
      { ...STAND, ua: 75, fa: 255 },
    ],
  },
  {
    id: 'kreuzheben-push-press', name: 'Kreuzheben mit Push Press', equip: ['kh'], muscles: 'Gesäß · hintere Oberschenkel · Schultern', mode: 'reps',
    desc: 'Kreuzheben mit Kurzhanteln, oben die Hanteln auf die Schultern bringen. Leicht in die Knie federn und mit Schwung aus den Beinen über den Kopf drücken. Kontrolliert zurück.',
    view: OVERHEAD, props: [{ t: 'db' }],
    poses: [
      { hp: [41, 52], tr: 80, a: [50, 90], ua: 180, fa: 180 },
      { ...STAND, ua: 2, fa: 0 },
    ],
  },
  {
    id: 'rdl-rudern', name: 'Rumänisches Kreuzheben mit Rudern', equip: ['kh'], muscles: 'Hintere Oberschenkel · Gesäß · Rücken', mode: 'reps',
    desc: 'Hüfte nach hinten schieben, Hanteln an den Beinen bis unter die Knie führen. In der vorgebeugten Position einmal zur Hüfte rudern, dann aufrichten.',
    props: [{ t: 'db' }],
    poses: [
      STAND,
      { hp: [41, 52], tr: 78, a: [50, 90], ua: 240, fa: 180 },
    ],
  },
  {
    id: 'burpee-kh', name: 'Burpee mit Kurzhanteln', equip: ['kh'], muscles: 'Oberschenkel · Brust · Rumpf · Ausdauer', mode: 'reps',
    desc: 'Hände auf den Hanteln, in den Liegestütz springen, Füße wieder heranspringen. Aufstehen und die Hanteln über den Kopf drücken. Wer mag, mit Liegestütz unten.',
    view: OVERHEAD, props: [{ t: 'db', both: false }],
    poses: [
      { ...PUSH_UP },
      { ...STAND, ua: 2, fa: 0 },
    ],
  },
  {
    id: 'goblet-reverse-lunge', name: 'Goblet Squat + Ausfallschritt rückwärts', equip: ['kh'], muscles: 'Oberschenkel · Gesäß', mode: 'reps',
    desc: 'Hantel vor der Brust. Eine Goblet-Kniebeuge, aufstehen, dann je ein Ausfallschritt rückwärts links und rechts. Diese Folge ist eine Wiederholung.',
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [37, 68], tr: 35, a: [50, 90], w: [63, 44] },
      { hp: [50, 70], tr: 2, a: [62, 90], a2: [32, 90], w: [62, 46] },
    ],
  },
  {
    id: 'sumo-jump-squat', name: 'Sumo-Sprungkniebeuge mit Kurzhantel', equip: ['kh'], muscles: 'Oberschenkel · Gesäß · Adduktoren', mode: 'reps',
    desc: 'Breiter Stand, eine Hantel senkrecht mit beiden Händen zwischen den Beinen. Tief in die Sumo-Hocke, explosiv abspringen, weich landen. Leichtes Gewicht wählen.',
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [50, 68], tr: 0, a: [30, 90], a2: [70, 90], ab: 1, w: [50, 86], w2: [50, 86] },
      { hp: [50, 46], tr: 0, a: [40, 85], a2: [60, 85], ab: 1, w: [50, 70], w2: [50, 70] },
    ],
  },
  {
    id: 'einbein-rotation', name: 'Rumpfrotation auf einem Bein', equip: ['kh'], muscles: 'Rumpf · Gesäß · Schultern', mode: 'reps', side: true,
    desc: 'Auf einem Bein stehen, Hantel mit beiden Händen vor der Brust. Arme gestreckt langsam zur Seite und zurück drehen, das Becken bleibt ruhig nach vorn gerichtet. Gleichgewicht vor Tempo.',
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [50, 50], tr: 0, th: 180, sh: 180, th2: 165, sh2: 210, ua: 85, fa: 85, ua2: 85, fa2: 85 },
      { hp: [50, 50], tr: 0, th: 180, sh: 180, th2: 165, sh2: 210, ua: 130, fa: 140, ua2: 130, fa2: 140 },
    ],
  },

  // Oberkörper
  {
    id: 'seitheben', name: 'Seitheben', equip: ['kh'], muscles: 'Seitliche Schulter', mode: 'reps',
    desc: 'Aufrecht stehen, Hanteln seitlich. Mit leicht gebeugten Ellbogen seitlich bis auf Schulterhöhe heben, kurz halten und langsam senken. Leichtes Gewicht, keine Schwungbewegung.',
    props: [{ t: 'db' }],
    poses: [
      { ...STAND, ua: 165, fa: 168, ua2: 195, fa2: 192 },
      { ...STAND, ua: 88, fa: 95, ua2: 272, fa2: 265 },
    ],
  },
  {
    id: 'seit-frontheben', name: 'Seitheben zum Frontheben', equip: ['kh'], muscles: 'Schultern', mode: 'reps',
    desc: 'Hanteln seitlich auf Schulterhöhe heben, oben vor den Körper zusammenführen, absenken. Nächste Wiederholung umgekehrt beginnen. Leichtes Gewicht.',
    props: [{ t: 'db' }],
    poses: [
      { ...STAND, ua: 88, fa: 95, ua2: 272, fa2: 265 },
      { ...STAND, ua: 90, fa: 88, ua2: 90, fa2: 88 },
    ],
  },
  {
    id: 'reverse-flys', name: 'Reverse Flys vorgebeugt', equip: ['kh'], muscles: 'Hintere Schulter · Oberer Rücken', mode: 'reps',
    desc: 'Vorgebeugt mit geradem Rücken, Arme hängen leicht gebeugt. Hanteln seitlich nach außen heben, bis die Arme auf Schulterhöhe sind, Schulterblätter zusammen. Langsam senken.',
    props: [{ t: 'db' }],
    poses: [
      { hp: [44, 52], tr: 72, a: [50, 90], ua: 182, fa: 175 },
      { hp: [44, 52], tr: 72, a: [50, 90], ua: 265, fa: 250 },
    ],
  },
  {
    id: 'rudern-breit', name: 'Rudern im breiten Stand', equip: ['kh'], muscles: 'Oberer Rücken · Hintere Schulter · Bizeps', mode: 'reps',
    desc: 'Breiter Stand, Knie gebeugt, Oberkörper weit vorgeneigt. Hanteln mit weit abgespreizten Ellbogen seitlich hochziehen, Schulterblätter zusammen. Langsam ablassen.',
    props: [{ t: 'db' }],
    poses: [
      { hp: [44, 55], tr: 65, a: [56, 90], a2: [36, 90], ua: 180, fa: 180 },
      { hp: [44, 55], tr: 65, a: [56, 90], a2: [36, 90], ua: 275, fa: 185 },
    ],
  },
  {
    id: 'rudern-einarmig', name: 'Einarmiges Rudern', equip: ['kh'], muscles: 'Oberer Rücken · Bizeps', mode: 'reps', side: true,
    desc: 'Schrittstellung, freie Hand auf Bank oder Oberschenkel. Rücken gerade, Hantel zur Hüfte ziehen, Ellbogen nah am Körper. Langsam ablassen. Erst alle Wiederholungen auf einer Seite.',
    props: [{ t: 'bench', x: 60, y: 66, w: 30 }, { t: 'db', both: false }],
    poses: [
      { hp: [40, 50], tr: 74, a: [46, 90], a2: [30, 90], w2: [72, 66], ua: 180, fa: 180 },
      { hp: [40, 50], tr: 74, a: [46, 90], a2: [30, 90], w2: [72, 66], ua: 245, fa: 180 },
    ],
  },
  {
    id: 'vierfuessler-rudern', name: 'Rudern im Vierfüßlerstand', equip: ['kh'], muscles: 'Oberer Rücken · Rumpf · Bizeps', mode: 'reps', side: true,
    desc: 'Vierfüßlerstand, eine Hand stützt, die andere hält die Hantel. Zur Hüfte rudern, ohne dass sich Becken oder Schultern verdrehen. Rumpf fest.',
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [40, 70], tr: 82, th: 180, sh: 270, w2: [68, 90], w: [67, 87] },
      { hp: [40, 70], tr: 82, th: 180, sh: 270, w2: [68, 90], ua: 250, fa: 175 },
    ],
  },
  {
    id: 'renegade-row', name: 'Rudern im Stütz (Renegade Row)', equip: ['kh'], muscles: 'Rücken · Rumpf · Bizeps', mode: 'reps', side: true,
    desc: 'Hoher Liegestütz, Hände auf den Hanteln, Füße etwas breiter. Eine Hantel zur Hüfte ziehen, ohne die Hüfte zu drehen. Abstellen, Seite wechseln.',
    props: [{ t: 'db' }],
    poses: [
      { ...PUSH_UP, w2: [76, 90] },
      { ...PUSH_UP, w2: [76, 90], w: undefined, ua: 245, fa: 175 },
    ],
  },
  {
    id: 'floor-press', name: 'Floor Press', equip: ['kh'], muscles: 'Brust · Trizeps', mode: 'reps',
    desc: 'Rückenlage am Boden, Knie aufgestellt. Hanteln über der Brust nach oben drücken, absenken bis die Oberarme den Boden berühren. Schont die Schultern.',
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [56, 84], tr: 270, hd: 270, a: [74, 90], ua: 90, fa: 0 },
      { hp: [56, 84], tr: 270, hd: 270, a: [74, 90], ua: 2, fa: 0 },
    ],
  },
  {
    id: 'flys', name: 'Fliegende (Flys)', equip: ['kh'], muscles: 'Brust', mode: 'reps',
    desc: 'Rückenlage am Boden oder auf der Bank, Hanteln über der Brust, Ellbogen leicht gebeugt. Arme in einem weiten Bogen zur Seite öffnen und wieder über der Brust zusammenführen.',
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [56, 84], tr: 270, hd: 270, a: [74, 90], ua: 2, fa: 0 },
      { hp: [56, 84], tr: 270, hd: 270, a: [74, 90], ua: 60, fa: 100 },
    ],
  },
  {
    id: 'skull-crusher', name: 'Trizepsdrücken liegend (Skull Crusher)', equip: ['kh'], muscles: 'Trizeps', mode: 'reps',
    desc: 'Rückenlage auf Boden, Bank oder Schrägbank, Arme senkrecht. Nur die Unterarme beugen, bis die Hanteln neben dem Kopf sind, und wieder strecken. Oberarme bleiben ruhig.',
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [56, 84], tr: 270, hd: 270, a: [74, 90], ua: 2, fa: 0 },
      { hp: [56, 84], tr: 270, hd: 270, a: [74, 90], ua: 350, fa: 250 },
    ],
  },
  {
    id: 'trizeps-ueberkopf', name: 'Trizepsdrücken über Kopf', equip: ['kh'], muscles: 'Trizeps', mode: 'reps',
    desc: 'Eine Hantel mit beiden Händen über dem Kopf. Unterarme hinter den Kopf senken, Ellbogen zeigen nach oben und bleiben eng. Wieder strecken. Rumpf fest, kein Hohlkreuz.',
    view: OVERHEAD, props: [{ t: 'db', both: false }],
    poses: [
      { ...STAND, ua: 2, fa: 0 },
      { ...STAND, ua: 352, fa: 190 },
    ],
  },
  {
    id: 'trizeps-plank', name: 'Trizeps-Stütz (Push Plank)', equip: [], muscles: 'Trizeps · Rumpf', mode: 'reps',
    desc: 'Unterarmstütz, Hände flach. Nur durch Strecken der Ellbogen in den hohen Stütz drücken, die Hände bleiben, wo sie sind. Langsam zurück auf die Unterarme.',
    poses: [
      { hp: [46.8, 80.6], tr: 76.4, a: [8, 90], ua: 180, fa: 90 },
      { hp: [52, 72], tr: 68, a: [14, 90], w: [87, 90] },
    ],
  },
  {
    id: 'push-plank', name: 'Push Plank (Up-Down)', equip: [], muscles: 'Rumpf · Schultern · Trizeps', mode: 'reps',
    desc: 'Aus dem Unterarmstütz nacheinander beide Hände aufsetzen und in den hohen Stütz drücken, dann Arm für Arm zurück. Hüfte ruhig halten, nicht schaukeln.',
    poses: [
      { hp: [46.8, 80.6], tr: 76.4, a: [8, 90], ua: 180, fa: 90 },
      { ...PUSH_UP, a: [8, 90], hp: [46, 74], w: [72, 90] },
    ],
  },
  {
    id: 'schulter-tippen', name: 'Schultertippen im Stütz', equip: [], muscles: 'Rumpf · Schultern', mode: 'reps',
    desc: 'Hoher Liegestütz, Füße etwas breiter. Abwechselnd mit einer Hand die gegenüberliegende Schulter antippen. Die Hüfte bleibt ruhig – je langsamer, desto stabiler.',
    poses: [
      { ...PUSH_UP, w2: [76, 90] },
      { ...PUSH_UP, w2: [76, 90], w: [74, 68] },
    ],
  },
  {
    id: 'plank-pull-through', name: 'Plank Pull-Through', equip: ['kh'], muscles: 'Rumpf · Schultern · Rücken', mode: 'reps', side: true,
    desc: 'Hoher Stütz, Hantel neben einer Hand. Mit der anderen Hand unter dem Körper durchgreifen und die Hantel auf die andere Seite ziehen. Hüfte bleibt ruhig und tief.',
    props: [{ t: 'db', both: false }],
    poses: [
      { ...PUSH_UP, w2: [76, 90], w: [58, 88] },
      { ...PUSH_UP, w2: [76, 90], w: [88, 88] },
    ],
  },
  {
    id: 'hollow-brustpresse', name: 'Brustpresse im Hollow Hold', equip: ['kh'], muscles: 'Rumpf · Brust · Trizeps', mode: 'reps',
    desc: 'Hollow-Position: unterer Rücken am Boden, Schultern und Beine leicht angehoben. In dieser Haltung die Hanteln über der Brust nach oben drücken und senken, ohne dass der Rücken abhebt.',
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [54, 82], tr: 285, hd: 285, th: 75, sh: 75, ua: 110, fa: 15 },
      { hp: [54, 82], tr: 285, hd: 285, th: 75, sh: 75, ua: 10, fa: 10 },
    ],
  },
  {
    id: 'schulterdruecken-kniend', name: 'Schulterdrücken kniend', equip: ['kh'], muscles: 'Schultern · Trizeps · Rumpf', mode: 'reps', side: true,
    desc: 'Halbkniestand, ein Knie am Boden. Hantel auf der Seite des hinteren Beins auf Schulterhöhe, senkrecht nach oben drücken. Gesäß angespannt, Rumpf bleibt aufrecht.',
    view: OVERHEAD, props: [{ t: 'db', both: false }],
    poses: [
      { hp: [46, 69], tr: 0, a: [62, 90], th2: 182, sh2: 268, ua: 160, fa: 5, ua2: 180, fa2: 170 },
      { hp: [46, 69], tr: 0, a: [62, 90], th2: 182, sh2: 268, ua: 2, fa: 0, ua2: 180, fa2: 170 },
    ],
  },
  {
    id: 'v-sit-schulterdruecken', name: 'Schulterdrücken im V-Sitz', equip: ['kh'], muscles: 'Schultern · Rumpf', mode: 'reps',
    desc: 'Sitzen, Oberkörper leicht zurückgelehnt, Füße angehoben. In dieser Balance die Hanteln von den Schultern nach oben drücken. Rücken lang, Bauch fest.',
    props: [{ t: 'db' }],
    poses: [
      { hp: [44, 86], tr: 340, th: 55, sh: 105, ua: 150, fa: 345 },
      { hp: [44, 86], tr: 340, th: 55, sh: 105, ua: 345, fa: 345 },
    ],
  },
  {
    id: 'around-the-world', name: 'Around the World über Kopf', equip: ['kh'], muscles: 'Schultern · Rumpf', mode: 'reps',
    desc: 'Eine Hantel mit beiden Händen. In einem Kreis um den Kopf führen: vor dem Gesicht, über die Schulter, hinter dem Kopf entlang, über die andere Schulter. Richtung abwechseln.',
    view: OVERHEAD, props: [{ t: 'db', both: false }],
    poses: [
      { ...STAND, ua: 50, fa: 330 },
      { ...STAND, ua: 345, fa: 200 },
    ],
  },
  {
    id: 'curl-arnold', name: 'Curl zum Arnold Press', equip: ['kh'], muscles: 'Bizeps · Schultern', mode: 'reps',
    desc: 'Bizepscurl bis zur Schulter, dann die Hanteln eindrehen und in einer drehenden Bewegung über den Kopf drücken. Auf dem Weg zurück umgekehrt.',
    view: OVERHEAD, props: [{ t: 'db' }],
    poses: [{ ...STAND, ua: 172 }, { ...STAND, ua: 2, fa: 0 }],
  },
  {
    id: 'zottman-curl', name: 'Zottman Curl', equip: ['kh'], muscles: 'Bizeps · Unterarm', mode: 'reps',
    desc: 'Curl mit Untergriff nach oben, oben die Hände umdrehen und im Obergriff langsam absenken. Ellbogen bleiben am Körper.',
    props: [{ t: 'db' }],
    poses: [{ ...STAND, ua: 172 }, { ...STAND, ua: 165, fa: 20 }],
  },
  {
    id: 'bizepscurl-seitlich', name: 'Bizepscurl seitlich', equip: ['kh'], muscles: 'Bizeps', mode: 'reps',
    desc: 'Arme leicht vom Körper abgespreizt, Handflächen zeigen nach vorn. Hanteln seitlich zur Schulter beugen und langsam ablassen. Ellbogen bleiben auf Höhe.',
    props: [{ t: 'db' }],
    poses: [
      { ...STAND, ua: 160, fa: 165, ua2: 200, fa2: 195 },
      { ...STAND, ua: 160, fa: 20, ua2: 200, fa2: 340 },
    ],
  },
  {
    id: 'curl-trizeps', name: 'Bizepscurl zur Trizepsstreckung', equip: ['kh'], muscles: 'Bizeps · Trizeps', mode: 'reps',
    desc: 'Bizepscurl, oben die Hanteln über den Kopf führen und hinter dem Kopf absenken (Trizeps). Wieder strecken, zur Schulter zurück und ablassen.',
    view: OVERHEAD, props: [{ t: 'db' }],
    poses: [{ ...STAND, ua: 165, fa: 20 }, { ...STAND, ua: 352, fa: 190 }],
  },

  // Rumpf
  {
    id: 'dead-bug', name: 'Dead Bug', equip: [], muscles: 'Rumpf', mode: 'reps',
    desc: 'Rückenlage, Arme senkrecht, Knie über der Hüfte gebeugt. Gegengleich einen Arm hinter den Kopf und ein Bein gestreckt knapp über den Boden senken. Unterer Rücken bleibt am Boden.',
    poses: [
      { hp: [52, 84], tr: 270, hd: 270, th: 0, sh: 90, ua: 0, fa: 0 },
      { hp: [52, 84], tr: 270, hd: 270, th: 0, sh: 90, th2: 82, sh2: 82, ua: 0, fa: 0, ua2: 275, fa2: 275 },
    ],
  },
  {
    id: 'crunch-gestreckt', name: 'Crunch mit gestreckten Beinen', equip: [], muscles: 'Gerade Bauchmuskulatur', mode: 'reps',
    desc: 'Rückenlage, Beine senkrecht nach oben gestreckt. Oberkörper einrollen und mit den Händen Richtung Füße greifen. Langsam abrollen, Beine bleiben ruhig.',
    poses: [
      { hp: [56, 85], tr: 270, hd: 270, th: 5, sh: 5, ua: 300, fa: 300 },
      { hp: [56, 85], tr: 300, hd: 310, th: 5, sh: 5, ua: 25, fa: 25 },
    ],
  },
  {
    id: 'beinheben-seitlich', name: 'Beinheben seitlich (Scheibenwischer)', equip: [], muscles: 'Bauch · Seitliche Rumpfmuskulatur', mode: 'reps', side: true,
    desc: 'Rückenlage, Arme seitlich am Boden. Gestreckte Beine anheben und langsam zu einer Seite absenken, ohne den Boden zu berühren, zurück zur Mitte und zur anderen Seite. Schultern bleiben am Boden.',
    poses: [
      { hp: [50, 85], tr: 270, hd: 270, th: 5, sh: 5, ua: 270, fa: 270 },
      { hp: [50, 85], tr: 270, hd: 270, th: 55, sh: 55, ua: 270, fa: 270 },
    ],
  },
  {
    id: 'v-up', name: 'V-Up', equip: [], muscles: 'Bauch · Hüftbeuger', mode: 'reps',
    desc: 'Rückenlage gestreckt, Arme über dem Kopf. Gleichzeitig Oberkörper und gestreckte Beine anheben und mit den Händen Richtung Füße greifen. Langsam ablegen. Leichter: Knie anziehen.',
    poses: [
      { hp: [50, 86], tr: 268, hd: 268, th: 92, sh: 92, ua: 268, fa: 268 },
      { hp: [50, 86], tr: 320, hd: 330, th: 40, sh: 40, ua: 35, fa: 35 },
    ],
  },

  // Geräte: Schlingentrainer, Battle Rope
  {
    id: 'trx-rudern', name: 'Rudern am Schlingentrainer', equip: ['trx'], muscles: 'Rücken · Bizeps · Rumpf', mode: 'reps',
    desc: 'Griffe fassen, Körper gerade nach hinten lehnen. Brust zu den Händen ziehen, Schulterblätter zusammen, Körper bleibt eine Linie. Je steiler du stehst, desto leichter.',
    props: [{ t: 'band', from: [84, 4] }],
    poses: [
      { hp: [46, 52.5], tr: 340, a: [60, 90], w: [84, 4] },
      { hp: [53, 51], tr: 352, a: [60, 90], w: [60, 26] },
    ],
  },
  {
    id: 'trx-overhead-squat', name: 'Überkopf-Kniebeuge am Schlingentrainer', equip: ['trx'], muscles: 'Oberschenkel · Gesäß · Schultern', mode: 'reps',
    desc: 'Griffe mit gestreckten Armen über dem Kopf, leicht nach hinten lehnen. Tief in die Kniebeuge sitzen, Arme bleiben gestreckt, Brust offen. Über die Fersen aufstehen.',
    props: [{ t: 'band', from: [84, 4] }],
    poses: [
      { ...STAND, w: [84, 4] },
      { hp: [36, 68], tr: 25, a: [50, 90], w: [84, 4] },
    ],
  },
  {
    id: 'trx-curtsy', name: 'Curtsy Squat am Schlingentrainer', equip: ['trx'], muscles: 'Oberschenkel · Gesäß · Adduktoren', mode: 'reps', side: true,
    desc: 'Griffe vor dem Körper halten. Ein Bein diagonal hinter das andere setzen (wie ein Knicks) und tief absenken. Über das vordere Bein aufstehen.',
    props: [{ t: 'band', from: [92, 20] }],
    poses: [
      { ...STAND, w: [92, 20] },
      { hp: [46, 68], tr: 10, a: [60, 90], a2: [32, 90], w: [92, 20] },
    ],
  },
  {
    id: 'battle-rope', name: 'Battle Rope Wellen', equip: ['rope'], muscles: 'Schultern · Arme · Rumpf · Ausdauer', mode: 'time',
    desc: 'Halbe Hocke, Seilenden in den Händen. Arme abwechselnd oder gleichzeitig schnell auf und ab bewegen, sodass Wellen bis zum Anker laufen. Rumpf fest, Knie weich.',
    props: [{ t: 'band', from: [99, 89] }],
    poses: [
      { hp: [42, 62], tr: 15, a: [54, 90], a2: [34, 90], ua: 130, fa: 110 },
      { hp: [42, 62], tr: 15, a: [54, 90], a2: [34, 90], ua: 85, fa: 75 },
    ],
  },

  // ── Dehnen ─────────────────────────────────────────────────
  // kind: 'stretch' = Dehnübung (gehalten, ohne Verlauf). pos = Ausgangslage für eine ruhige Reihenfolge
  // (stand → knie → bauch → sitz → ruecken). t = Zielmuskeln mit Gewicht, Schlüssel siehe STRETCH_TARGETS.
  {
    id: 'trizeps-dehnung', name: 'Trizeps-Dehnung über Kopf', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Trizeps · Schultern', mode: 'time', side: true,
    t: { trizeps: 1, schulter: 0.4 },
    desc: 'Einen Arm nach oben strecken, Ellbogen beugen und die Hand zwischen die Schulterblätter sinken lassen. Mit der anderen Hand den Ellbogen sanft nach hinten ziehen. Kopf bleibt aufrecht.',
    view: OVERHEAD,
    from: { hd: 0, ua: 180, fa: 180, w2: null, ua2: 180, fa2: 180 },
    poses: [{ ...STAND, hd: 345, ua: 28, fa: 200, w2: [56, 11] }],
  },
  {
    id: 'brust-dehnung-wand', name: 'Brustdehnung an der Wand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Brust · Schultern · Bizeps', mode: 'time', side: true,
    t: { brust: 1, schulter: 0.4, bizeps: 0.3 },
    desc: 'Seitlich neben eine Wand oder einen Türrahmen stellen, Hand und Unterarm auf Schulterhöhe anlegen. Den Oberkörper langsam von der Wand wegdrehen, bis ein Zug in der Brust entsteht. Schulter bleibt tief.',
    props: [{ t: 'wall', x: 26 }],
    from: { w: null, ua: 180, fa: 180 },
    poses: [{ hp: [50, 51], tr: 0, a: [58, 90], a2: [44, 90], w: [27, 22], ua2: 180, fa2: 180 }],
  },
  {
    id: 'schulter-dehnung', name: 'Schulterdehnung vor der Brust', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Schultern · Oberer Rücken', mode: 'time', side: true,
    t: { schulter: 1, oruecken: 0.5 },
    desc: 'Einen Arm gestreckt quer vor die Brust führen. Mit der anderen Hand oberhalb des Ellbogens sanft heranziehen. Schultern locker und tief lassen.',
    from: { w: null, w2: null, ua: 180, fa: 180, ua2: 180, fa2: 180 },
    poses: [{ ...STAND, w: [66, 24], w2: [58, 25] }],
  },
  {
    id: 'bizeps-dehnung', name: 'Bizeps- und Unterarmdehnung', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Bizeps · Unterarm', mode: 'time', side: true,
    t: { bizeps: 1, unterarm: 1 },
    desc: 'Einen Arm gestreckt nach vorn heben, Handfläche zeigt nach vorn, Finger nach unten. Mit der anderen Hand die Finger sanft zum Körper ziehen. Ellbogen bleibt gestreckt, nicht durchdrücken.',
    from: { ua: 180, fa: 180, w2: null, ua2: 180, fa2: 180 },
    poses: [{ ...STAND, ua: 98, fa: 98, w2: [71, 28] }],
  },
  {
    id: 'nacken-dehnung', name: 'Nackendehnung', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Nacken · Oberer Rücken', mode: 'time',
    t: { schulter: 0.4, oruecken: 0.4 },
    desc: 'Aufrecht stehen, Hände locker an den Hinterkopf legen. Kinn langsam Richtung Brust sinken lassen, die Hände geben nur ihr Gewicht dazu. Ruhig weiteratmen, nicht ziehen.',
    from: { hd: 0 },
    poses: [{ ...STAND, hd: 35, w: [49, 9], w2: [49, 9], wb: -1, wb2: -1 }],
  },
  {
    id: 'rundruecken-dehnung', name: 'Rundrücken im Stand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Oberer Rücken · Schultern', mode: 'time',
    t: { oruecken: 1, schulter: 0.5, ruecken: 0.4 },
    desc: 'Hände vor dem Körper verschränken und die Arme nach vorn schieben. Den oberen Rücken rund machen, Kopf sinkt zwischen die Arme. Zwischen die Schulterblätter atmen.',
    from: { tr: 0, hd: 0 },
    poses: [{ hp: [46, 51], tr: 12, hd: 40, th: 178, sh: 180, ua: 90, fa: 90 }],
  },
  {
    id: 'lat-dehnung', name: 'Latissimus-Dehnung an der Wand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Rücken · Schultern · Trizeps', mode: 'time',
    t: { ruecken: 1, oruecken: 0.6, schulter: 0.5, trizeps: 0.3 },
    desc: 'Hände schulterbreit auf Hüfthöhe an eine Wand oder Stuhllehne legen. Mit dem Gesäß nach hinten gehen, bis Oberkörper und Arme eine Linie bilden. Brust sinkt sanft Richtung Boden.',
    props: [{ t: 'wall', x: 88 }],
    from: { hp: [46, 51], tr: 35, hd: 35 },
    poses: [{ hp: [36, 52], tr: 88, hd: 95, a: [40, 90], w: [87, 50] }],
  },
  {
    id: 'quadrizeps-dehnung', name: 'Oberschenkel vorn im Stand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Oberschenkel · Hüftbeuger', mode: 'time', side: true,
    t: { quad: 1, hueftbeuger: 0.6 },
    desc: 'Auf einem Bein stehen, die Ferse des anderen Beins zum Gesäß führen und den Fuß festhalten. Knie zeigen nach unten und bleiben nebeneinander. Becken leicht nach vorn kippen. Bei Bedarf an der Wand abstützen.',
    from: { th2: 188, sh2: 235, w: null, ua: 180, fa: 180 },
    poses: [{ ...STAND, th2: 215, sh2: 15, w: [43, 48], ua2: 175, fa2: 175 }],
  },
  {
    id: 'waden-dehnung', name: 'Wadendehnung an der Wand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Wade · Hintere Oberschenkel', mode: 'time', side: true,
    t: { wade: 1, hamstring: 0.3 },
    desc: 'Mit den Händen an der Wand abstützen, ein Bein weit nach hinten stellen. Hintere Ferse in den Boden drücken, Bein gestreckt. Das vordere Knie beugen, bis die Wade zieht.',
    props: [{ t: 'wall', x: 82 }],
    from: { hp: [41, 52], tr: 18 },
    poses: [{ hp: [46, 54], tr: 32, a: [54, 90], a2: [28, 90], w: [81, 30], w2: [81, 34] }],
  },
  {
    id: 'vorbeuge-stehend', name: 'Vorbeuge im Stand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Hintere Oberschenkel · Unterer Rücken · Wade', mode: 'time',
    t: { hamstring: 1, uruecken: 0.6, wade: 0.3 },
    desc: 'Füße hüftbreit, Knie leicht gebeugt. Aus der Hüfte nach vorn sinken und den Oberkörper locker hängen lassen. Hände Richtung Boden oder Schienbeine. Langsam Wirbel für Wirbel aufrollen.',
    from: { tr: 0, hd: 0, w: null, w2: null },
    poses: [{ hp: [44, 50], tr: 150, hd: 165, a: [46, 90], w: [56, 88], w2: [58, 88] }],
  },
  {
    id: 'hueftbeuger-dehnung', name: 'Hüftbeuger im Kniestand', kind: 'stretch', pos: 'knie', equip: [], muscles: 'Hüftbeuger · Oberschenkel', mode: 'time', side: true,
    t: { hueftbeuger: 1, quad: 0.6 },
    desc: 'Aus dem Ausfallschritt das hintere Knie auf den Boden setzen (gern auf ein Kissen). Gesäß anspannen und die Hüfte langsam nach vorn schieben, Oberkörper aufrecht. Vorderes Knie bleibt über dem Fuß.',
    from: { hp: [39, 70], tr: 2 },
    poses: [{ hp: [44, 71], tr: 355, a: [66, 90], th2: 200, sh2: 268, w: [61, 71], w2: [61, 72] }],
  },
  {
    id: 'herabschauender-hund', name: 'Herabschauender Hund', kind: 'stretch', pos: 'knie', equip: [], muscles: 'Wade · Hintere Oberschenkel · Schultern · Rücken', mode: 'time',
    t: { wade: 0.8, hamstring: 0.8, schulter: 0.5, ruecken: 0.3 },
    desc: 'Aus dem Vierfüßlerstand das Gesäß nach oben und hinten schieben, bis der Körper ein umgedrehtes V bildet. Arme lang, Kopf zwischen den Armen. Knie dürfen gebeugt bleiben, Fersen Richtung Boden.',
    from: { hp: [46, 68], tr: 98, hd: 105 },
    poses: [{ hp: [44, 52], tr: 132, hd: 150, a: [30, 90], w: [82, 90], w2: [80, 90] }],
  },
  {
    id: 'katze-kuh', name: 'Katze-Kuh', kind: 'stretch', dynamic: true, pos: 'knie', equip: [], muscles: 'Rücken · Rumpf', mode: 'time',
    t: { ruecken: 0.7, uruecken: 0.7, rumpf: 0.5 },
    desc: 'Im Vierfüßlerstand mit dem Ausatmen den Rücken rund machen, Kinn zur Brust. Mit dem Einatmen das Brustbein nach vorn schieben, Blick leicht nach vorn. Langsam im Atemrhythmus wechseln.',
    poses: [
      { hp: [40, 69], tr: 80, hd: 125, th: 180, sh: 270, w: [68, 90], w2: [67, 90] },
      { hp: [40, 71], tr: 86, hd: 55, th: 180, sh: 270, w: [68, 90], w2: [67, 90] },
    ],
  },
  {
    id: 'kindhaltung', name: 'Kindhaltung', kind: 'stretch', pos: 'knie', equip: [], muscles: 'Rücken · Schultern · Gesäß', mode: 'time',
    t: { ruecken: 0.8, uruecken: 0.6, schulter: 0.3, gesaess: 0.3 },
    desc: 'Aus dem Vierfüßlerstand das Gesäß auf die Fersen sinken lassen. Arme lang nach vorn ablegen, Stirn Richtung Boden. Knie dürfen auseinander. In den Rücken atmen und loslassen.',
    from: { hp: [40, 70], tr: 82, hd: 90, th: 180, sh: 270, w: [68, 90], w2: [67, 90] },
    poses: [{ hp: [34, 76], tr: 98, hd: 115, th: 112, sh: 262, w: [88, 89], w2: [86, 89] }],
  },
  {
    id: 'kobra', name: 'Kobra', kind: 'stretch', pos: 'bauch', equip: [], muscles: 'Bauch · Hüftbeuger', mode: 'time',
    t: { rumpf: 1, hueftbeuger: 0.5 },
    desc: 'In Bauchlage die Hände unter die Schultern setzen. Den Oberkörper langsam aufrichten, Becken bleibt am Boden. Nur so weit, wie es sich im unteren Rücken gut anfühlt. Schultern weg von den Ohren.',
    from: { tr: 86, hd: 88 },
    poses: [{ hp: [46, 87], tr: 52, hd: 30, th: 270, sh: 270, w: [70, 90], w2: [69, 90] }],
  },
  {
    id: 'sitzende-vorbeuge', name: 'Vorbeuge im Sitzen', kind: 'stretch', pos: 'sitz', equip: [], muscles: 'Hintere Oberschenkel · Rücken', mode: 'time',
    t: { hamstring: 1, uruecken: 0.6, ruecken: 0.3 },
    desc: 'Mit gestreckten Beinen aufrecht sitzen. Aus der Hüfte nach vorn neigen, Hände Richtung Füße. Rücken möglichst lang lassen, Knie dürfen leicht gebeugt sein.',
    from: { tr: 8, hd: 5, w: [50, 85], w2: [51, 85] },
    poses: [{ hp: [32, 86], tr: 55, hd: 70, th: 90, sh: 90, w: [64, 82], w2: [66, 82] }],
  },
  {
    id: 'schmetterling', name: 'Schmetterling', kind: 'stretch', pos: 'sitz', equip: [], muscles: 'Adduktoren · Gesäß', mode: 'time',
    t: { adduktoren: 1, gesaess: 0.3 },
    desc: 'Aufrecht sitzen, Fußsohlen aneinander, Knie fallen nach außen. Füße mit den Händen halten und die Fersen nah zum Körper ziehen. Knie sanft sinken lassen, nicht drücken.',
    from: { tr: 0, th: 40, sh: 205 },
    poses: [{ hp: [42, 86], tr: 8, th: 58, sh: 222, w: [52, 86], w2: [53, 86] }],
  },
  {
    id: 'figur-vier', name: 'Gesäßdehnung liegend (Figur 4)', kind: 'stretch', pos: 'ruecken', equip: [], muscles: 'Gesäß · Unterer Rücken', mode: 'time', side: true,
    t: { gesaess: 1, uruecken: 0.3 },
    desc: 'In Rückenlage einen Fuß auf das andere Knie legen. Das untere Bein anheben und den Oberschenkel mit beiden Händen zur Brust ziehen. Kopf und Schultern bleiben entspannt am Boden.',
    from: { th2: 45, sh2: 150, w: null, w2: null, ua: 90, fa: 90, ua2: 90, fa2: 90 },
    poses: [{ hp: [52, 84], tr: 270, hd: 270, th: 55, sh: 165, th2: 20, sh2: 95, w: [56, 67], w2: [57, 68] }],
  },
  {
    id: 'hamstring-liegend', name: 'Oberschenkel hinten liegend', kind: 'stretch', pos: 'ruecken', equip: [], muscles: 'Hintere Oberschenkel · Wade', mode: 'time', side: true,
    t: { hamstring: 1, wade: 0.3 },
    desc: 'In Rückenlage ein Bein gestreckt nach oben heben, ein Handtuch oder Band um die Fußsohle legen. Das Bein sanft zu dir ziehen, das andere Bein bleibt lang am Boden.',
    props: [{ t: 'band', from: [54, 45] }],
    from: { th: 55, sh: 55 },
    poses: [{ hp: [52, 84], tr: 270, hd: 270, th: 5, sh: 5, th2: 90, sh2: 90, w: [44, 62], w2: [45, 63] }],
  },
  {
    id: 'rotation-liegend', name: 'Rotation liegend', kind: 'stretch', pos: 'ruecken', equip: [], muscles: 'Seitliche Rumpfmuskulatur · Unterer Rücken · Gesäß', mode: 'time', side: true,
    t: { seitrumpf: 1, uruecken: 0.6, rumpf: 0.4, gesaess: 0.3 },
    desc: 'In Rückenlage die Arme seitlich ablegen. Beide Knie anwinkeln und langsam zu einer Seite sinken lassen. Schultern bleiben am Boden, Blick zur anderen Seite.',
    from: { th: 18, sh: 160 },
    poses: [{ hp: [54, 84], tr: 270, hd: 270, th: 45, sh: 140, ua: 300, fa: 300 }],
  },
  {
    id: 'hueftbeuger-stehend', name: 'Hüftbeuger im Stand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Hüftbeuger · Oberschenkel', mode: 'time', side: true,
    t: { hueftbeuger: 1, quad: 0.5 },
    desc: 'Großer Schritt nach vorn, hinteres Bein lang, Ferse hoch. Gesäß anspannen und die Hüfte sanft nach vorn schieben, Oberkörper bleibt aufrecht. Hände an der Hüfte.',
    from: { hp: [43, 54], tr: 0 },
    poses: [{ hp: [47, 56], tr: 355, a: [66, 90], a2: [25, 90], w: [49, 55], w2: [49, 55] }],
  },
  {
    id: 'brustoeffner', name: 'Brustöffner im Stand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Brust · Schultern', mode: 'time',
    t: { brust: 1, schulter: 0.5 },
    desc: 'Hände hinter dem Rücken verschränken, Arme lang machen. Schulterblätter zusammenziehen und die Hände sanft vom Gesäß weg nach hinten-unten schieben. Brustbein hebt sich, Blick geradeaus.',
    from: { tr: 0, hd: 0, ua: 180, fa: 180 },
    poses: [{ ...STAND, tr: 356, hd: 350, ua: 215, fa: 210 }],
  },
  {
    id: 'waden-stufe', name: 'Wadendehnung an der Stufe', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Wade', mode: 'time', side: true,
    t: { wade: 1 },
    desc: 'Mit dem Fußballen auf eine Stufe stellen, an Wand oder Geländer festhalten. Bein gestreckt lassen und die Ferse langsam unter die Stufe sinken lassen. Das andere Bein ist locker angehoben.',
    view: '0 -8 100 100', props: [{ t: 'bench', x: 46, y: 81, w: 22 }, { t: 'wall', x: 84 }],
    from: { hp: [52, 38] },
    poses: [{ hp: [52, 42], tr: 0, a: [53, 82], th2: 172, sh2: 200, w: [83, 26], ua2: 180, fa2: 180 }],
  },
  {
    id: 'knie-zur-brust', name: 'Knie zur Brust', kind: 'stretch', pos: 'ruecken', equip: [], muscles: 'Unterer Rücken · Gesäß', mode: 'time',
    t: { uruecken: 1, ruecken: 0.5, gesaess: 0.4 },
    desc: 'In Rückenlage beide Knie zur Brust ziehen und die Hände um die Schienbeine legen. Unteren Rücken lang in den Boden sinken lassen, Kopf bleibt liegen. Gern sanft hin und her wiegen.',
    from: { th: 30, sh: 150, w: null, w2: null, ua: 90, fa: 90, ua2: 90, fa2: 90 },
    poses: [{ hp: [56, 84], tr: 270, hd: 270, th: 328, sh: 65, w: [45, 68], w2: [46, 69] }],
  },
];

// Dehnungen: from = Ausgangspose als Abweichung von der Dehnpose (null = Wert entfernen).
// Daraus werden zwei Posen [Ausgang, Dehnung] – die Animation zeigt das Einnehmen, im Training wird die Dehnung gehalten.
for (const e of EXERCISES) {
  if (!e.from || e.poses.length !== 1) continue;
  const p0 = { ...e.poses[0], ...e.from };
  for (const k in p0) if (p0[k] === null) delete p0[k];
  e.poses = [p0, e.poses[0]];
}

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
  crawling: 2.5, 'reverse-lunge-knee': 3, 'seitlicher-ausfallschritt': 3, 'cossack-squat': 3.5, 'clock-lunges': 8,
  'bulgarian-split-squat': 3.5, 'einbeiniges-kreuzheben': 4, 'hip-thrust': 3, 'hip-thrust-einbeinig': 3, 'hamstring-bruecke': 3,
  'good-morning': 3, 'kang-squat': 4.5, 'beincurl-kh': 3, 'diagonal-ausfallschritt-band': 3.5, 'jump-squat': 2, 'jump-lunge': 1.5,
  einbeinsprung: 1, walkout: 6, 'wand-liegestuetz': 2.5, thruster: 3, 'snatch-einarmig': 2.5, 'snatch-beidarmig': 3, 'high-pull': 2.5,
  'kreuzheben-push-press': 4, 'rdl-rudern': 5, 'burpee-kh': 5, 'goblet-reverse-lunge': 9, 'sumo-jump-squat': 2.5, 'einbein-rotation': 3,
  seitheben: 3, 'seit-frontheben': 4, 'reverse-flys': 3, 'rudern-breit': 3, 'rudern-einarmig': 3, 'vierfuessler-rudern': 3,
  'renegade-row': 3, 'floor-press': 3, flys: 3, 'skull-crusher': 3, 'trizeps-ueberkopf': 3, 'trizeps-plank': 3, 'push-plank': 4,
  'schulter-tippen': 1.5, 'plank-pull-through': 3, 'hollow-brustpresse': 2.5, 'schulterdruecken-kniend': 3, 'v-sit-schulterdruecken': 3,
  'around-the-world': 4, 'curl-arnold': 5, 'zottman-curl': 4, 'bizepscurl-seitlich': 3, 'curl-trizeps': 6, 'dead-bug': 3,
  'crunch-gestreckt': 2.5, 'beinheben-seitlich': 4, 'katze-kuh': 6, 'v-up': 3, 'trx-rudern': 3, 'trx-overhead-squat': 3.5, 'trx-curtsy': 3.5,
};

// Muskelgruppen für Filter und Plan-Icons – automatisch aus der Muskel-Beschreibung abgeleitet,
// damit neue Übungen ohne Zusatzangabe einsortiert werden.
export const MUSCLE_GROUPS = [
  { id: 'beine', name: 'Beine', match: /oberschenkel|hüftbeuger|wade|adduktor/i },
  { id: 'gesaess', name: 'Gesäß', match: /gesäß/i },
  { id: 'brust', name: 'Brust', match: /brust/i },
  { id: 'ruecken', name: 'Rücken', match: /rücken/i },
  { id: 'schultern', name: 'Schultern', match: /schulter|nacken/i },
  { id: 'arme', name: 'Arme', match: /bizeps|trizeps|unterarm/i },
  { id: 'rumpf', name: 'Rumpf', match: /rumpf|bauch/i },
];
for (const e of EXERCISES) e.groups = MUSCLE_GROUPS.filter((g) => g.match.test(e.muscles)).map((g) => g.id);

// ── Dehnen ────────────────────────────────────────────────
export const isStretch = (ex) => ex?.kind === 'stretch';
export const STRETCHES = EXERCISES.filter(isStretch);
export const STRENGTH = EXERCISES.filter((e) => !isStretch(e));
export const STRETCH_POS = ['stand', 'knie', 'bauch', 'sitz', 'ruecken'];

// Zielmuskeln der Dehnungen ← Muskel-Beschreibung der Kraftübungen.
// „Oberschenkel“ allein = vorn, „hintere Oberschenkel“ = hinten.
export const STRETCH_TARGETS = {
  brust: /brust/, trizeps: /trizeps|arme/, bizeps: /bizeps|arme/, unterarm: /unterarm/, schulter: /schulter/,
  oruecken: /oberer rücken/, ruecken: /rücken/, uruecken: /unterer rücken/,
  quad: (m) => /oberschenkel/.test(m.replace(/hintere oberschenkel/g, '')), hamstring: /hintere oberschenkel/,
  gesaess: /gesäß/, hueftbeuger: /hüftbeuger/, adduktoren: /adduktor/, wade: /wade/,
  rumpf: /rumpf|bauch/, seitrumpf: /seitliche rumpf/,
};
export function targetsOf(ex) {
  const m = ex.muscles.toLowerCase();
  return Object.keys(STRETCH_TARGETS).filter((k) => { const t = STRETCH_TARGETS[k]; return typeof t === 'function' ? t(m) : t.test(m); });
}
