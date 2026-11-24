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

// how = „So geht’s“: vollständiger Ablauf (Ausgangsposition, Bewegung, Rückweg, Zählweise/Seitenwechsel).
// cues = „Worauf ich achte“: nur Stil, Technik, Varianten – optional, ohne Inhalt fällt der Bereich weg.
export const EXERCISES = [
  // ── Körpergewicht ──────────────────────────────────────────
  {
    id: 'liegestuetz', name: 'Liegestütz', equip: [], muscles: 'Brust · Trizeps · Schultern', mode: 'reps',
    how: 'Hände etwas breiter als schulterbreit aufsetzen, Füße zusammen, Körper vom Kopf bis zu den Fersen in einer Linie. Brust kontrolliert bis knapp über den Boden senken und kräftig wieder hochdrücken, bis die Arme gestreckt sind.',
    cues: ['Ellbogen etwa 45° vom Körper, nicht weit nach außen.', 'Hüfte weder durchhängen lassen noch hochschieben.', 'Leichter: Knie am Boden.'],
    poses: [PUSH_UP, { hp: [53.7, 85.3], tr: 83, a: [14, 90], w: [76, 90] }],
  },
  {
    id: 'kniebeuge', name: 'Kniebeuge', equip: [], muscles: 'Oberschenkel · Gesäß', mode: 'reps',
    how: 'Füße schulterbreit, Zehen leicht nach außen. Hüfte nach hinten und unten schieben, bis die Oberschenkel etwa waagerecht sind. Über die ganze Fußsohle wieder in den Stand drücken.',
    cues: ['Fersen bleiben am Boden.', 'Knie folgen der Richtung der Zehen.', 'Oberkörper aufrecht, Blick nach vorn.'],
    poses: [
      { hp: [50, 50], tr: 0, a: [50, 90], ua: 90, fa: 90 },
      { hp: [37, 68], tr: 40, a: [50, 90], ua: 90, fa: 90 },
    ],
  },
  {
    id: 'ausfallschritt', name: 'Ausfallschritt', equip: [], muscles: 'Oberschenkel · Gesäß', mode: 'reps',
    how: 'Aus dem Stand einen großen Schritt nach vorn machen. Senkrecht absenken, bis das hintere Knie knapp über dem Boden ist. Über den vorderen Fuß abdrücken und zurück in den Stand. Seiten abwechseln.',
    cues: ['Oberkörper aufrecht.', 'Vorderes Knie bleibt über dem Fuß, nicht nach innen.'],
    seq: [0, 1, 2, 3, 2, 1], key: 3, alt: true,
    poses: [
      { hp: [38, 50], tr: 0, a: [38, 90], a2: [38, 90], ua: 180, fa: 180 },
      { via: true, hp: [42, 51], tr: 0, a: [50, 83], a2: [38, 90], ua: 180, fa: 180 },
      { via: true, hp: [52, 54], tr: 0, a: [70, 90], a2: [38, 90], ua: 180, fa: 180 },
      { hp: [54, 70], tr: 0, a: [70, 90], a2: [38, 90], ua: 180, fa: 180 },
    ],
  },
  {
    id: 'unterarmstuetz', name: 'Unterarmstütz (Plank)', equip: [], muscles: 'Rumpf', mode: 'time',
    how: 'Auf Unterarme und Zehenspitzen stützen, Ellbogen unter den Schultern. Körper vom Kopf bis zu den Fersen gerade halten und die Position für die vorgegebene Zeit halten.',
    cues: ['Bauch und Gesäß anspannen.', 'Kein Hohlkreuz, Hüfte nicht nach oben schieben.', 'Ruhig weiteratmen.'],
    poses: [{ hp: [46.8, 80.6], tr: 76.4, a: [8, 90], ua: 180, fa: 90 }],
  },
  {
    id: 'seitstuetz', name: 'Seitstütz', equip: [], muscles: 'Seitliche Rumpfmuskulatur', mode: 'time', side: true,
    how: 'Seitlich auf einen Unterarm stützen, Ellbogen unter der Schulter, Füße übereinander. Hüfte anheben, bis der Körper eine Linie bildet, freien Arm nach oben strecken und halten. Danach die Seite wechseln.',
    cues: ['Hüfte nicht absinken lassen.', 'Leichter: unteres Knie am Boden.'],
    poses: [{ hp: [46.8, 80.6], tr: 76.4, a: [8, 90], ua: 180, fa: 90, ua2: 0, fa2: 0 }],
  },
  {
    id: 'hueftheben', name: 'Hüftheben (Glute Bridge)', equip: [], muscles: 'Gesäß · hintere Oberschenkel', mode: 'reps',
    how: 'Rückenlage, Füße hüftbreit aufgestellt, Arme neben dem Körper. Hüfte heben, bis Knie, Hüfte und Schultern eine Linie bilden. Oben kurz halten und langsam wieder absenken.',
    cues: ['Oben das Gesäß bewusst anspannen.', 'Über die Fersen drücken, nicht ins Hohlkreuz.'],
    poses: [
      { hp: [50, 84], tr: 270, hd: 270, a: [72, 90], ua: 100, fa: 95 },
      { hp: [48, 73.6], tr: 248, hd: 270, a: [72, 90], ua: 100, fa: 95 },
    ],
  },
  {
    id: 'bergsteiger', name: 'Bergsteiger (Mountain Climber)', equip: [], muscles: 'Rumpf · Hüftbeuger · Ausdauer', mode: 'time',
    how: 'Hoher Liegestütz, Hände unter den Schultern. Abwechselnd ein Knie zügig zur Brust ziehen und zurücksetzen, im Wechsel wie beim Laufen.',
    cues: ['Hüfte tief und ruhig halten.', 'Schultern bleiben über den Händen.'],
    poses: [
      { ...PUSH_UP, a2: [52, 86] },
      { ...PUSH_UP, a: [52, 86], a2: [14, 90] },
    ],
  },
  {
    id: 'wandsitzen', name: 'Wandsitzen', equip: [], muscles: 'Oberschenkel', mode: 'time',
    how: 'Mit dem Rücken an die Wand lehnen und herunterrutschen, bis die Oberschenkel waagerecht sind und die Knie über den Fersen stehen. Position für die vorgegebene Zeit halten.',
    cues: ['Gleichmäßig atmen.', 'Ganzer Rücken bleibt an der Wand.'],
    props: [{ t: 'wall', x: 26 }],
    poses: [{ hp: [31, 66], tr: 0, a: [53, 90], ua: 90, fa: 90 }],
  },
  {
    id: 'superman', name: 'Superman', equip: [], muscles: 'Unterer Rücken · Gesäß', mode: 'reps',
    how: 'Bauchlage, Arme nach vorn gestreckt. Arme, Brust und Beine gleichzeitig leicht anheben, kurz halten und kontrolliert wieder ablegen.',
    cues: ['Blick bleibt zum Boden, Nacken lang.', 'Lieber niedrig und kontrolliert als hoch mit Schwung.'],
    poses: [
      { hp: [40, 85], tr: 91, hd: 89, th: 268, sh: 268, ua: 95, fa: 95 },
      { hp: [40, 85], tr: 77, hd: 73, th: 280, sh: 280, ua: 74, fa: 74 },
    ],
  },
  {
    id: 'crunch', name: 'Crunch', equip: [], muscles: 'Gerade Bauchmuskulatur', mode: 'reps',
    how: 'Rückenlage, Beine aufgestellt, Hände locker an den Schläfen. Oberkörper einrollen, bis die Schulterblätter abheben, und langsam wieder ablegen.',
    cues: ['Unterer Rücken bleibt am Boden.', 'Nacken locker, nicht am Kopf ziehen.'],
    poses: [
      { hp: [56, 84], tr: 270, hd: 270, a: [80, 90], w: [19, 80], wb: 1 },
      { hp: [56, 84], tr: 300, hd: 305, a: [80, 90], w: [25, 61], wb: 1 },
    ],
  },
  {
    id: 'hollow-hold', name: 'Hollow Hold', equip: [], muscles: 'Rumpf', mode: 'time',
    how: 'Rückenlage, unteren Rücken fest in den Boden drücken. Schultern und gestreckte Beine leicht anheben, Arme neben den Ohren nach hinten strecken und die Spannung halten.',
    cues: ['Der untere Rücken darf nicht abheben.', 'Je flacher Arme und Beine, desto schwerer.', 'Leichter: Knie anwinkeln.'],
    poses: [{ hp: [54, 82], tr: 285, hd: 285, th: 75, sh: 75, ua: 290, fa: 290 }],
  },
  {
    id: 'bank-dips', name: 'Dips an der Bank', equip: ['bank'], muscles: 'Trizeps · Brust', mode: 'reps',
    how: 'Hände schulterbreit hinter dir auf die Bankkante, Finger zeigen nach vorn, Beine gestreckt. Ellbogen nach hinten beugen und den Körper absenken, bis die Oberarme etwa waagerecht sind. Wieder hochdrücken, bis die Arme gestreckt sind.',
    cues: ['Rücken bleibt nah an der Bank.', 'Schultern weg von den Ohren.', 'Leichter: Knie gebeugt.'],
    props: [{ t: 'bench', x: 12, y: 66, w: 32 }],
    poses: [
      { hp: [50.6, 68], tr: 356, w: [42, 66], a: [84, 90] },
      { hp: [45.3, 80], tr: 356, w: [42, 66], a: [84, 90] },
    ],
  },
  {
    id: 'klimmzug', name: 'Klimmzug', equip: ['stange'], muscles: 'Rücken · Bizeps', mode: 'reps',
    how: 'Stange im Obergriff etwas breiter als schulterbreit greifen und gestreckt hängen. Schulterblätter nach unten ziehen und den Körper hochziehen, bis das Kinn über der Stange ist. Kontrolliert ablassen, bis die Arme wieder gestreckt sind.',
    cues: ['Ohne Schwung aus den Beinen.', 'Leichter: mit Band oder nur langsam ablassen.'],
    noGround: true, view: '-6 -8 112 112', props: [{ t: 'bar', x: 56, y: 12 }],
    poses: [
      { hp: [51, 67], tr: 0, w: [56, 12], th: 185, sh: 245 },
      { hp: [48, 42], tr: 0, hd: 6, w: [56, 12], th: 185, sh: 245 },
    ],
  },
  {
    id: 'beinheben-haengend', name: 'Hängendes Beinheben', equip: ['stange'], muscles: 'Bauch · Hüftbeuger', mode: 'reps',
    how: 'An der Stange hängen, Schultern aktiv nach unten gezogen. Gestreckte Beine bis zur Waagerechten oder höher heben und langsam wieder senken.',
    cues: ['Ohne Schwung arbeiten.', 'Leichter: Knie anziehen statt gestreckter Beine.'],
    noGround: true, view: '0 0 100 106', props: [{ t: 'bar', x: 56, y: 8 }],
    poses: [
      { hp: [51, 63], tr: 0, w: [56, 8], th: 180, sh: 180 },
      { hp: [50, 63], tr: 354, w: [56, 8], th: 95, sh: 95 },
    ],
  },

  // ── Kurzhanteln ───────────────────────────────────────────
  {
    id: 'bizepscurl', name: 'Bizepscurl', equip: ['kh'], muscles: 'Bizeps', mode: 'reps',
    how: 'Aufrecht stehen, Hanteln im Untergriff neben dem Körper. Hanteln zur Schulter beugen und langsam wieder ablassen, bis die Arme gestreckt sind.',
    cues: ['Ellbogen bleiben fest am Körper.', 'Kein Schwung aus dem Rücken.'],
    props: [{ t: 'db' }],
    poses: [{ ...STAND, ua: 172 }, { ...STAND, ua: 165, fa: 20 }],
  },
  {
    id: 'schulterdruecken-kh', name: 'Schulterdrücken', equip: ['kh'], muscles: 'Schultern · Trizeps', mode: 'reps',
    how: 'Aufrecht stehen, Hanteln auf Schulterhöhe, Handflächen nach vorn. Hanteln senkrecht über den Kopf drücken, bis die Arme gestreckt sind, und kontrolliert zurück auf Schulterhöhe senken.',
    cues: ['Kein Hohlkreuz, Bauch fest.', 'Hanteln oben nicht zusammenschlagen.'],
    view: OVERHEAD, props: [{ t: 'db' }],
    poses: [{ ...STAND, ua: 160, fa: 5 }, { ...STAND, ua: 2, fa: 0 }],
  },
  {
    id: 'rudern-kh', name: 'Vorgebeugtes Rudern', equip: ['kh'], muscles: 'Oberer Rücken · Bizeps', mode: 'reps',
    how: 'Knie leicht gebeugt, Oberkörper mit geradem Rücken weit vorbeugen, Hanteln hängen unter den Schultern. Hanteln zur Hüfte ziehen und langsam wieder ablassen.',
    cues: ['Schulterblätter beim Ziehen zusammen.', 'Rücken bleibt gerade, kein Rundrücken.'],
    props: [{ t: 'db' }],
    poses: [
      { hp: [44, 52], tr: 68, a: [50, 90], ua: 180, fa: 180 },
      { hp: [44, 52], tr: 68, a: [50, 90], ua: 240, fa: 180 },
    ],
  },
  {
    id: 'goblet-squat', name: 'Goblet Squat', equip: ['kh'], muscles: 'Oberschenkel · Gesäß · Rumpf', mode: 'reps',
    how: 'Eine Hantel senkrecht vor der Brust halten, Füße etwas breiter als schulterbreit. Tief in die Hocke gehen, bis die Ellbogen zwischen den Knien sind. Über die Fersen wieder in den Stand drücken.',
    cues: ['Oberkörper aufrecht.', 'Knie folgen den Zehen.', 'Geht auch mit Kettlebell.'],
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [50, 50], tr: 0, a: [50, 90], w: [61, 30] },
      { hp: [37, 68], tr: 35, a: [50, 90], w: [63, 44] },
    ],
  },
  {
    id: 'rumaenisches-kreuzheben', name: 'Rumänisches Kreuzheben', equip: ['kh'], muscles: 'Hintere Oberschenkel · Gesäß · Rücken', mode: 'reps',
    how: 'Aufrecht stehen, Hanteln vor den Oberschenkeln, Knie leicht gebeugt. Hüfte nach hinten schieben und die Hanteln nah an den Beinen bis unter die Knie führen. Hüfte nach vorn bringen und aufrichten.',
    cues: ['Rücken bleibt gerade.', 'Die Bewegung kommt aus der Hüfte, die Knie bleiben fast gleich gebeugt.'],
    props: [{ t: 'db' }],
    poses: [STAND, { hp: [41, 52], tr: 80, a: [50, 90], ua: 180, fa: 180 }],
  },
  {
    id: 'bankdruecken-kh', name: 'Bankdrücken (Kurzhantel)', equip: ['kh', 'bank'], muscles: 'Brust · Trizeps · Schultern', mode: 'reps',
    how: 'Rückenlage auf der Bank, Füße fest am Boden, Hanteln über der Brust. Hanteln seitlich bis auf Brusthöhe absenken und wieder nach oben drücken, bis sie über der Brust zusammenkommen.',
    cues: ['Schulterblätter zusammen und auf die Bank drücken.', 'Kontrolliert absenken, nicht fallen lassen.'],
    props: [{ t: 'bench', x: 8, y: 72, w: 56 }, { t: 'db', both: false }],
    poses: [
      { hp: [52, 67], tr: 270, hd: 270, a: [76, 90], w: [30, 56] },
      { hp: [52, 67], tr: 270, hd: 270, a: [76, 90], w: [25, 40] },
    ],
  },
  {
    id: 'frontheben', name: 'Frontheben', equip: ['kh'], muscles: 'Vordere Schulter', mode: 'reps',
    how: 'Aufrecht stehen, Hanteln vor den Oberschenkeln. Mit fast gestreckten Armen nach vorn bis auf Schulterhöhe heben und langsam wieder senken.',
    cues: ['Leichtes Gewicht wählen.', 'Kein Schwung aus dem Oberkörper.'],
    props: [{ t: 'db' }],
    poses: [STAND, { ...STAND, ua: 90, fa: 88 }],
  },

  // ── Langhantel ────────────────────────────────────────────
  {
    id: 'kniebeuge-lh', name: 'Kniebeuge (Langhantel)', equip: ['lh'], muscles: 'Oberschenkel · Gesäß · Rücken', mode: 'reps',
    how: 'Hantel auf den oberen Rücken legen, nicht auf den Nacken, Füße schulterbreit. Hüfte nach hinten und unten schieben, bis die Oberschenkel mindestens waagerecht sind. Kraftvoll wieder aufstehen.',
    cues: ['Brust raus, Rumpf fest.', 'Fersen bleiben am Boden.', 'Am besten im Rack mit Sicherung.'],
    props: [{ t: 'bb', at: 'n', back: 4 }],
    poses: [
      { hp: [50, 50], tr: 0, a: [50, 90], ua: 195, fa: 15 },
      { hp: [37, 68], tr: 35, a: [50, 90], ua: 230, fa: 50 },
    ],
  },
  {
    id: 'kreuzheben', name: 'Kreuzheben', equip: ['lh'], muscles: 'Rücken · Gesäß · hintere Oberschenkel', mode: 'reps',
    how: 'Füße hüftbreit, Stange über dem Mittelfuß, schulterbreit greifen. Mit geradem Rücken die Hantel nah am Körper vom Boden drücken, bis du aufrecht stehst. Kontrolliert auf demselben Weg ablegen.',
    cues: ['Rücken gerade, Brust raus.', 'Stange bleibt nah an den Beinen.', 'Oben nicht nach hinten lehnen.'],
    props: [{ t: 'bb' }],
    poses: [
      { hp: [40, 68], tr: 65, a: [55, 90], w: [56, 83] },
      { hp: [55, 50], tr: 0, a: [55, 90], ua: 180, fa: 180 },
    ],
  },
  {
    id: 'bankdruecken-lh', name: 'Bankdrücken (Langhantel)', equip: ['lh', 'bank'], muscles: 'Brust · Trizeps · Schultern', mode: 'reps',
    how: 'Rückenlage auf der Bank, Füße fest am Boden, Stange etwas breiter als schulterbreit greifen und aus der Ablage heben. Kontrolliert zur unteren Brust senken und senkrecht wieder nach oben drücken.',
    cues: ['Schulterblätter zusammen.', 'Am besten mit Ablage und Sicherung.'],
    props: [{ t: 'bench', x: 8, y: 72, w: 56 }, { t: 'bb' }],
    poses: [
      { hp: [52, 67], tr: 270, hd: 270, a: [76, 90], w: [30, 59] },
      { hp: [52, 67], tr: 270, hd: 270, a: [76, 90], w: [26, 40] },
    ],
  },
  {
    id: 'rudern-lh', name: 'Langhantelrudern', equip: ['lh'], muscles: 'Oberer Rücken · Bizeps', mode: 'reps',
    how: 'Stange schulterbreit greifen, Knie leicht gebeugt, Oberkörper mit geradem Rücken vorbeugen. Stange zum Bauchnabel ziehen und langsam wieder ablassen.',
    cues: ['Ellbogen nah am Körper.', 'Schulterblätter beim Ziehen zusammen.', 'Rücken bleibt gerade.'],
    props: [{ t: 'bb' }],
    poses: [
      { hp: [44, 52], tr: 68, a: [50, 90], ua: 180, fa: 180 },
      { hp: [44, 52], tr: 68, a: [50, 90], ua: 240, fa: 180 },
    ],
  },

  // ── Kettlebell ────────────────────────────────────────────
  {
    id: 'kb-swing', name: 'Kettlebell Swing', equip: ['kb'], muscles: 'Gesäß · hintere Oberschenkel · Rumpf', mode: 'reps',
    how: 'Füße etwas breiter als schulterbreit, Kettlebell mit beiden Händen. Kettlebell zwischen den Beinen nach hinten schwingen und dabei die Hüfte beugen. Mit einem kräftigen Hüftstoß nach vorn bis auf Brusthöhe schwingen und wieder zurückfallen lassen.',
    cues: ['Die Kraft kommt aus der Hüfte, nicht aus den Armen.', 'Rücken gerade, oben Gesäß anspannen.'],
    props: [{ t: 'kb' }],
    poses: [
      { hp: [40, 53], tr: 80, a: [52, 90], ua: 240, fa: 240 },
      { hp: [51, 50], tr: 0, a: [52, 90], ua: 90, fa: 90 },
    ],
  },

  // ── Widerstandsband ───────────────────────────────────────
  {
    id: 'band-rudern', name: 'Rudern mit Band', equip: ['band'], muscles: 'Oberer Rücken · Bizeps', mode: 'reps',
    how: 'Band vorn auf Brusthöhe befestigen, Enden greifen und mit gestreckten Armen zurückgehen, bis es leicht spannt. Ellbogen nach hinten ziehen und langsam wieder nachgeben.',
    cues: ['Schulterblätter zusammendrücken.', 'Aufrecht stehen, nicht zurücklehnen.'],
    props: [{ t: 'band', from: [97, 34] }],
    poses: [{ ...STAND, ua: 98, fa: 95 }, { ...STAND, ua: 205, fa: 85 }],
  },
  {
    id: 'band-brustpresse', name: 'Brustpresse mit Band', equip: ['band'], muscles: 'Brust · Trizeps', mode: 'reps',
    how: 'Band hinter dir auf Brusthöhe befestigen, Enden greifen, Hände vor der Brust. Nach vorn drücken, bis die Arme gestreckt sind, und kontrolliert zurückführen.',
    cues: ['Rumpf fest, nicht ins Hohlkreuz.'],
    props: [{ t: 'band', from: [3, 34] }],
    poses: [{ ...STAND, ua: 205, fa: 85 }, { ...STAND, ua: 95, fa: 92 }],
  },
  // ── Aus den Studio-Workouts (2026-11-19) ──────────────────
  // side: true = Wiederholungen je Seite
  // Aufwärmen / Ausdauer
  {
    id: 'rudergeraet', name: 'Rudergerät', equip: ['ruder'], muscles: 'Rücken · Oberschenkel · Ausdauer', mode: 'time',
    how: 'Auf den Sitz setzen, Füße festschnallen, Griff mit gestreckten Armen fassen. Zuerst mit den Beinen abdrücken, dann den Oberkörper leicht zurücklehnen und zuletzt den Griff zur unteren Brust ziehen. Zurück in umgekehrter Reihenfolge: Arme strecken, Oberkörper vor, Knie beugen.',
    cues: ['Rücken lang, Griff locker.', 'Zum Aufwärmen ruhiges, gleichmäßiges Tempo.'],
    props: [{ t: 'bench', x: 10, y: 82, w: 62 }, { t: 'band', from: [78, 70] }],
    poses: [
      { hp: [38, 79], tr: 22, a: [66, 80], ab: -1, ua: 70, fa: 75 },
      { hp: [20, 79], tr: 345, a: [60, 80], w: [34, 62] },
    ],
  },
  {
    id: 'crawling', name: 'Bärengang (Crawling)', equip: [], muscles: 'Rumpf · Schultern · Oberschenkel', mode: 'reps',
    how: 'Vierfüßlerstand, Hände unter den Schultern, Knie unter der Hüfte, Knie eine Handbreit vom Boden abheben. Gegengleich eine Hand und den anderen Fuß ein kleines Stück nach vorn setzen, dann die andere Seite. Jeder Schritt zählt als Wiederholung.',
    cues: ['Rücken flach, Hüfte ruhig.', 'Langsam ist schwerer als schnell.'],
    poses: [
      { hp: [42, 64], tr: 86, a: [41, 90], a2: [34, 90], w: [70, 90], w2: [76, 90] },
      { hp: [48, 64], tr: 86, a: [41, 90], a2: [48, 90], w: [82, 90], w2: [76, 90] },
    ],
  },
  {
    id: 'schattenboxen', name: 'Schattenboxen', equip: [], muscles: 'Schultern · Arme · Ausdauer', mode: 'time',
    how: 'Lockere Schrittstellung, Knie leicht gebeugt, Fäuste vor dem Kinn. Abwechselnd mit links und rechts gerade nach vorn schlagen und die Faust sofort wieder vors Kinn zurückholen.',
    cues: ['Aus der Hüfte drehen.', 'Leicht auf den Fußballen federn.'],
    poses: [
      { hp: [48, 52], tr: 4, a: [60, 90], a2: [38, 90], ua: 160, fa: 25, ua2: 165, fa2: 20 },
      { hp: [50, 52], tr: 8, a: [60, 90], a2: [38, 90], ua: 88, fa: 88, ua2: 165, fa2: 20 },
    ],
  },
  {
    id: 'seitsprints', front: true, name: 'Seitliche Sprints (Side Shuffle)', equip: [], muscles: 'Oberschenkel · Gesäß · Ausdauer', mode: 'time',
    how: 'Breite, tiefe Grundstellung, Knie gebeugt. Mit schnellen, kurzen Schritten seitlich laufen und nach ein paar Schritten die Richtung wechseln.',
    cues: ['Füße nicht überkreuzen.', 'Tief bleiben, nicht aufrichten.'],
    seq: [0, 1, 2, 3, 2, 1], key: 3,
    poses: [
      { hp: [42, 62], tr: 0, a: [27, 90], a2: [57, 90], ab: 1, ua: 165, fa: 60, ua2: 195, fa2: 300 },
      { via: true, hp: [47, 61], tr: 0, a: [27, 90], a2: [66, 86], ab: 1, ua: 165, fa: 60, ua2: 195, fa2: 300 },
      { via: true, hp: [53, 61], tr: 0, a: [36, 86], a2: [71, 90], ab: 1, ua: 165, fa: 60, ua2: 195, fa2: 300 },
      { hp: [56, 62], tr: 0, a: [41, 90], a2: [71, 90], ab: 1, ua: 165, fa: 60, ua2: 195, fa2: 300 },
    ],
  },
  {
    id: 'sprints', name: 'Sprint auf der Stelle', equip: [], muscles: 'Oberschenkel · Hüftbeuger · Ausdauer', mode: 'time',
    how: 'Auf der Stelle laufen, die Knie zügig bis etwa auf Hüfthöhe ziehen und auf den Fußballen landen. Arme gegengleich mitschwingen.',
    cues: ['Arme kräftig mitnehmen.', 'Oberkörper aufrecht.'],
    poses: [
      { hp: [50, 49], tr: 5, th: 85, sh: 175, th2: 182, sh2: 182, ua: 210, fa: 120, ua2: 130, fa2: 40 },
      { hp: [50, 49], tr: 5, th: 182, sh: 182, th2: 85, sh2: 175, ua: 130, fa: 40, ua2: 210, fa2: 120 },
    ],
  },
  {
    id: 'crossleg-jumps', front: true, name: 'Hampelmann mit Überkreuzen', equip: [], muscles: 'Oberschenkel · Schultern · Ausdauer', mode: 'time',
    how: 'Aufrecht stehen. Abspringen, die Beine in der Luft grätschen und die Arme über den Kopf schwingen. Beim nächsten Sprung mit überkreuzten Beinen landen und die Arme vor dem Körper zusammenführen. Bei jedem Kreuzen das vordere Bein wechseln.',
    cues: ['Leicht und federnd auf den Fußballen landen.'],
    view: OVERHEAD,
    poses: [
      { hp: [50, 50], tr: 0, a: [57, 90], a2: [43, 90], ua: 160, fa: 160, ua2: 200, fa2: 200 },
      { hp: [50, 48], tr: 0, a: [32, 88], a2: [68, 88], ua: 35, fa: 25, ua2: 325, fa2: 335 },
    ],
  },
  {
    id: 'walkout', name: 'Walkout', equip: [], muscles: 'Rumpf · Schultern · hintere Oberschenkel', mode: 'reps',
    how: 'Aus dem Stand mit möglichst gestreckten Beinen nach vorn beugen und die Hände vor den Füßen aufsetzen. Mit den Händen nach vorn laufen, bis du im hohen Liegestütz bist. Kurz halten, mit den Händen zurücklaufen und aufrichten.',
    cues: ['Im Stütz Körper gerade, Hüfte nicht durchhängen lassen.', 'Knie dürfen beim Aufsetzen leicht gebeugt sein.'],
    seq: [0, 1, 2, 3, 2, 1], key: 3,
    poses: [
      { hp: [18, 50], tr: 0, a: [18, 90] },
      { hp: [16, 51], tr: 130, a: [18, 90], w: [44, 90] },
      { via: true, hp: [33, 58], tr: 100, a: [18, 90], w: [64, 90] },
      { hp: [54.7, 74.1], tr: 67, a: [18, 90], w: [80, 90] },
    ],
  },
  {
    id: 'wand-liegestuetz', name: 'Liegestütz an der Wand', equip: [], muscles: 'Brust · Trizeps · Schultern', mode: 'reps',
    how: 'Hände schulterbreit auf Brusthöhe an die Wand, Füße ein Stück zurück. Brust zur Wand senken und wieder wegdrücken, bis die Arme gestreckt sind.',
    cues: ['Körper bleibt eine gerade Linie.', 'Leichter Einstieg oder zum Aufwärmen.'],
    props: [{ t: 'wall', x: 86 }],
    poses: [
      { hp: [52, 54], tr: 18, a: [40, 90], w: [86, 33] },
      { hp: [58, 55], tr: 27, a: [40, 90], w: [86, 33] },
    ],
  },

  // Beine & Gesäß
  {
    id: 'jump-squat', name: 'Sprungkniebeuge (Jump Squat)', equip: [], muscles: 'Oberschenkel · Gesäß · Ausdauer', mode: 'reps',
    how: 'Füße schulterbreit, in die Kniebeuge gehen. Explosiv nach oben springen, die Arme schwingen mit. Weich über die Fußballen landen und direkt in die nächste Kniebeuge abfedern.',
    cues: ['Leise landen, Knie nicht nach innen.', 'Lieber weniger hoch und sauber.'],
    view: OVERHEAD,
    poses: [
      { hp: [37, 68], tr: 40, a: [50, 90], ua: 215, fa: 215 },
      { hp: [50, 42], tr: 2, th: 182, sh: 176, ua: 20, fa: 15 },
    ],
  },
  {
    id: 'jump-lunge', name: 'Ausfallschrittsprung (Jump Lunge)', equip: [], muscles: 'Oberschenkel · Gesäß · Ausdauer', mode: 'reps',
    how: 'Ausfallschritt, beide Knie gebeugt. Hochspringen, in der Luft die Beine wechseln und im Ausfallschritt mit dem anderen Bein vorn landen. Jede Landung ist eine Wiederholung.',
    cues: ['Weich landen, hinteres Knie knapp über dem Boden.', 'Oberkörper aufrecht.'],
    key: 1, alt: true,
    poses: [
      { hp: [46, 70], tr: 0, a: [62, 90], a2: [30, 90], ua: 200, fa: 140, ua2: 150, fa2: 60 },
      { via: true, hp: [46, 47], tr: 0, a: [52, 83], a2: [40, 83], ua: 190, fa: 120, ua2: 160, fa2: 80 },
      { via: true, hp: [46, 47], tr: 0, a: [40, 83], a2: [52, 83], ua: 160, fa: 80, ua2: 190, fa2: 120 },
    ],
  },
  {
    id: 'einbeinsprung', name: 'Einbeinige Sprünge', equip: [], muscles: 'Oberschenkel · Wade · Gesäß', mode: 'reps', side: true,
    how: 'Auf einem Bein stehen, Knie leicht gebeugt, das andere Bein angewinkelt. Kleine Sprünge nach oben machen und auf demselben Bein landen. Erst alle Wiederholungen auf einer Seite, dann wechseln.',
    cues: ['Weich und leise über den Fußballen landen.', 'Knie bleibt über dem Fuß.'],
    poses: [
      { hp: [48, 56], tr: 10, a: [50, 90], th2: 160, sh2: 230, ua: 200, fa: 200 },
      { hp: [50, 46], tr: 4, th: 182, sh: 178, th2: 160, sh2: 230, ua: 30, fa: 30 },
    ],
  },
  {
    id: 'reverse-lunge-knee', name: 'Ausfallschritt rückwärts + Knieheben', equip: [], muscles: 'Oberschenkel · Gesäß · Hüftbeuger', mode: 'reps', side: true,
    how: 'Aus dem Stand einen großen Schritt zurück machen und absenken, bis das hintere Knie fast den Boden berührt. Kraftvoll über das vordere Bein aufstehen und das hintere Knie dabei bis auf Hüfthöhe nach vorn ziehen. Erst alle Wiederholungen auf einer Seite, dann wechseln.',
    cues: ['Oberkörper aufrecht.', 'Arme gegengleich mitnehmen.'],
    poses: [
      { hp: [50, 70], tr: 5, a2: [64, 90], a: [32, 90], ua: 150, fa: 60, ua2: 200, fa2: 160 },
      { hp: [50, 50], tr: 0, th2: 180, sh2: 180, th: 85, sh: 180, ua: 200, fa: 160, ua2: 150, fa2: 60 },
    ],
  },
  {
    id: 'seitlicher-ausfallschritt', front: true, name: 'Seitlicher Ausfallschritt', equip: [], muscles: 'Oberschenkel · Gesäß · Adduktoren', mode: 'reps', side: true,
    how: 'Aus dem Stand einen breiten Schritt zur Seite machen. Hüfte nach hinten schieben und ins Knie des Schrittbeins sinken, das andere Bein bleibt gestreckt. Über das Schrittbein zurück in den Stand drücken. Erst alle Wiederholungen auf einer Seite.',
    cues: ['Beide Fersen bleiben am Boden.', 'Knie zeigt in Richtung Zehen.'],
    seq: [0, 1, 2, 1], key: 2,
    poses: [
      { hp: [65, 50], tr: 0, a: [60, 90], a2: [70, 90], ab: 1, ua: 160, fa: 40, ua2: 200, fa2: 320 },
      { via: true, hp: [57, 53], tr: 0, a: [44, 84], a2: [70, 90], ab: 1, ua: 160, fa: 40, ua2: 200, fa2: 320 },
      { hp: [37.2, 67.2], tr: 355, a: [28, 90], a2: [70, 90], ab: 1, ua: 160, fa: 40, ua2: 200, fa2: 320 },
    ],
  },
  {
    id: 'cossack-squat', front: true, name: 'Kosakenkniebeuge (Cossack Squat)', equip: [], muscles: 'Oberschenkel · Gesäß · Adduktoren', mode: 'reps', side: true,
    how: 'Sehr breiter Stand, Zehen leicht nach außen. Gewicht auf eine Seite verlagern und tief in dieses Knie sinken, das andere Bein streckt sich, Zehen zeigen nach oben. Zur Mitte zurück und zur anderen Seite.',
    cues: ['Oberkörper aufrecht, Ferse des gebeugten Beins bleibt am Boden.', 'Variante: gehend, mit jedem Schritt die Seite wechseln.'],
    poses: [
      { hp: [50, 55], tr: 0, a: [30, 90], a2: [70, 90], ab: 1, ua: 150, fa: 60, ua2: 210, fa2: 300 },
      { hp: [37, 73], tr: 5, a: [30, 90], a2: [76, 88], ab: 1, ua: 120, fa: 80, ua2: 240, fa2: 280 },
    ],
  },
  {
    id: 'clock-lunges', name: 'Uhr-Ausfallschritte (Clock Lunges)', equip: [], muscles: 'Oberschenkel · Gesäß', mode: 'reps', side: true,
    how: 'Ein Bein bleibt in der Mitte stehen. Mit dem anderen nacheinander einen Ausfallschritt nach vorn, zur Seite und nach hinten machen, jeweils zurück zur Mitte – wie die Zeiger einer Uhr. Eine Runde ist eine Wiederholung, danach Seite wechseln.',
    cues: ['Standbein stabil, Knie über dem Fuß.', 'Oberkörper aufrecht.'],
    seq: [0, 1, 2, 1, 0, 3, 4, 3, 0, 5, 6, 5], key: 2,
    poses: [
      { hp: [50, 50], tr: 0, a: [50, 90], a2: [50, 90] },
      { via: true, hp: [56, 53], tr: 0, a: [64, 83], a2: [50, 90] },
      { hp: [66, 70], tr: 0, a: [82, 90], a2: [50, 90] },
      { via: true, hp: [49, 55], tr: 2, a: [53, 89], a2: [50, 90] },
      { hp: [44, 66], tr: 8, a: [57, 96], a2: [50, 90] },
      { via: true, hp: [46, 53], tr: 0, a: [35, 83], a2: [50, 90] },
      { hp: [35, 70], tr: 4, a: [18, 90], a2: [50, 90] },
    ],
  },
  {
    id: 'bulgarian-split-squat', name: 'Bulgarische Kniebeuge', equip: ['bank'], muscles: 'Oberschenkel · Gesäß', mode: 'reps', side: true,
    how: 'Rückwärts vor die Bank stellen und den hinteren Fußrücken auf die Bank legen, vorderer Fuß ein großes Stück vor der Bank. Senkrecht absenken, bis der vordere Oberschenkel fast waagerecht ist, und über den vorderen Fuß wieder hochdrücken. Erst alle Wiederholungen auf einer Seite.',
    cues: ['Vorderes Knie über dem Fuß.', 'Oberkörper leicht vorgeneigt.', 'Schwerer: mit Kurzhanteln.'],
    props: [{ t: 'bench', x: 6, y: 70, w: 24 }],
    poses: [
      { hp: [50, 52], tr: 4, a: [64, 90], a2: [26, 70] },
      { hp: [46, 68], tr: 12, a: [64, 90], a2: [26, 70] },
    ],
  },
  {
    id: 'einbeiniges-kreuzheben', name: 'Einbeiniges Kreuzheben', equip: ['kh'], muscles: 'Hintere Oberschenkel · Gesäß · Rumpf', mode: 'reps', side: true,
    how: 'Auf einem Bein stehen, Hanteln vor den Oberschenkeln, Knie des Standbeins leicht gebeugt. Oberkörper nach vorn kippen, das freie Bein streckt sich nach hinten, bis Rumpf und Bein fast waagerecht sind. Auf demselben Weg aufrichten. Erst alle Wiederholungen auf einer Seite.',
    cues: ['Hüfte bleibt gerade, nicht aufdrehen.', 'Hanteln nah am Standbein.'],
    props: [{ t: 'db' }],
    poses: [
      { ...STAND, th2: 182, sh2: 182 },
      { hp: [46, 51], tr: 84, a: [48, 90], th2: 268, sh2: 268, ua: 180, fa: 180 },
    ],
  },
  {
    id: 'hip-thrust', name: 'Hip Thrust', equip: ['bank'], muscles: 'Gesäß · hintere Oberschenkel', mode: 'reps',
    how: 'Mit dem oberen Rücken an die Bankkante lehnen, Füße hüftbreit aufgestellt. Hüfte heben, bis Knie, Hüfte und Schultern eine Linie bilden, und wieder absenken, bis das Gesäß knapp über dem Boden ist.',
    cues: ['Oben das Gesäß fest anspannen.', 'Kinn zur Brust, kein Hohlkreuz.', 'Schwerer: Kurzhantel auf der Hüfte.'],
    props: [{ t: 'bench', x: 6, y: 62, w: 30 }],
    poses: [
      { hp: [50, 80], tr: 302, hd: 290, a: [72, 90], ua: 260, fa: 260 },
      { hp: [58, 64], tr: 272, hd: 290, a: [72, 90], ua: 260, fa: 260 },
    ],
  },
  {
    id: 'hip-thrust-einbeinig', name: 'Hip Thrust einbeinig', equip: ['bank'], muscles: 'Gesäß · hintere Oberschenkel', mode: 'reps', side: true,
    how: 'Mit dem oberen Rücken an die Bankkante lehnen, ein Fuß aufgestellt, das andere Bein angewinkelt angehoben. Über die Ferse des Standbeins die Hüfte heben, bis Knie, Hüfte und Schultern eine Linie bilden, und wieder absenken. Erst alle Wiederholungen auf einer Seite.',
    cues: ['Becken bleibt waagerecht.', 'Oben das Gesäß anspannen.'],
    props: [{ t: 'bench', x: 6, y: 62, w: 30 }],
    poses: [
      { hp: [50, 80], tr: 302, hd: 290, a: [72, 90], th2: 30, sh2: 110, ua: 260, fa: 260 },
      { hp: [58, 64], tr: 272, hd: 290, a: [72, 90], th2: 40, sh2: 120, ua: 260, fa: 260 },
    ],
  },
  {
    id: 'hamstring-bruecke', name: 'Hüftheben mit Füßen auf der Box', equip: ['bank'], muscles: 'Hintere Oberschenkel · Gesäß', mode: 'reps',
    how: 'Rückenlage, Fersen auf Box oder Bank, Knie leicht gebeugt. Über die Fersen drücken und die Hüfte heben, bis Schultern, Hüfte und Knie eine Linie bilden. Oben kurz halten und langsam absenken.',
    cues: ['Die Spannung liegt in den hinteren Oberschenkeln.', 'Schwerer: einbeinig.'],
    props: [{ t: 'bench', x: 62, y: 72, w: 24 }],
    poses: [
      { hp: [46, 85], tr: 270, hd: 270, a: [74, 72], ua: 90, fa: 90 },
      { hp: [44, 73], tr: 245, hd: 265, a: [74, 72], ua: 110, fa: 100 },
    ],
  },
  {
    id: 'good-morning', name: 'Good Morning', equip: [], muscles: 'Hintere Oberschenkel · Gesäß · Unterer Rücken', mode: 'reps',
    how: 'Aufrecht stehen, Hände an den Hinterkopf, Knie leicht gebeugt. Hüfte nach hinten schieben und den Oberkörper nach vorn kippen, bis er fast waagerecht ist. Über die Hüfte wieder aufrichten.',
    cues: ['Rücken bleibt gerade.', 'Schwerer: Hantel auf dem oberen Rücken.'],
    poses: [
      { ...STAND, ua: 30, fa: 230 },
      { hp: [42, 51], tr: 82, a: [50, 90], ua: 115, fa: 315 },
    ],
  },
  {
    id: 'kang-squat', name: 'Kang Squat', equip: [], muscles: 'Hintere Oberschenkel · Gesäß · Oberschenkel', mode: 'reps',
    how: 'Aufrecht stehen, Hände an den Hinterkopf. Hüfte nach hinten schieben und den Oberkörper waagerecht kippen wie beim Good Morning. Aus dieser Position in die tiefe Hocke sinken und dabei den Oberkörper aufrichten. Zurück in umgekehrter Reihenfolge: Hüfte hoch in die Vorbeuge, dann aufrichten.',
    cues: ['Rücken in jeder Phase gerade.', 'Langsam und kontrolliert.'],
    seq: [0, 1, 2, 1], key: 2,
    poses: [
      { ...STAND, a: [50, 90], ua: 30, fa: 230 },
      { hp: [42, 51], tr: 82, a: [50, 90], ua: 115, fa: 315 },
      { hp: [37, 70], tr: 35, a: [50, 90], ua: 60, fa: 260 },
    ],
  },
  {
    id: 'beincurl-kh', name: 'Beincurl liegend', equip: ['kh'], muscles: 'Hintere Oberschenkel', mode: 'reps',
    how: 'Bauchlage, eine Kurzhantel zwischen den Füßen einklemmen. Unterschenkel langsam bis senkrecht anbeugen und kontrolliert wieder absenken.',
    cues: ['Becken bleibt am Boden.', 'Alternative: Gleitpads in Rückenlage.'],
    props: [{ t: 'db', at: 'f' }],
    poses: [
      { hp: [50, 86], tr: 268, hd: 280, th: 92, sh: 92, ua: 230, fa: 80 },
      { hp: [50, 86], tr: 268, hd: 280, th: 92, sh: 10, ua: 230, fa: 80 },
    ],
  },
  {
    id: 'diagonal-ausfallschritt-band', name: 'Diagonaler Ausfallschritt mit Band', equip: ['band'], muscles: 'Oberschenkel · Gesäß', mode: 'reps', side: true,
    how: 'Mini-Band über den Knien. Schräg nach vorn in den Ausfallschritt gehen, unten zweimal leicht nachfedern und zurück in den Stand. Erst alle Wiederholungen auf einer Seite.',
    cues: ['Knie gegen das Band nach außen drücken.', 'Oberkörper aufrecht.'],
    seq: [0, 1, 2, 3, 4, 3, 4, 3, 2, 1], key: 3, props: [{ t: 'band', from: 'k', to: 'k2' }],
    poses: [
      { hp: [38, 50], tr: 0, a: [38, 90], a2: [38, 90], ua: 160, fa: 40 },
      { via: true, hp: [42, 51], tr: 2, a: [50, 83], a2: [38, 90], ua: 160, fa: 40 },
      { via: true, hp: [52, 54], tr: 4, a: [70, 90], a2: [38, 90], ua: 160, fa: 40 },
      { hp: [54, 69], tr: 8, a: [70, 90], a2: [38, 90], ua: 160, fa: 40 },
      { via: true, hp: [54, 64], tr: 8, a: [70, 90], a2: [38, 90], ua: 160, fa: 40 },
    ],
  },

  // Ganzkörper mit Kurzhanteln
  {
    id: 'thruster', name: 'Thruster', equip: ['kh'], muscles: 'Oberschenkel · Gesäß · Schultern', mode: 'reps',
    how: 'Hanteln auf Schulterhöhe, Füße schulterbreit. In die Kniebeuge gehen, kraftvoll aufstehen und den Schwung direkt nutzen, um die Hanteln über den Kopf zu drücken. Hanteln zurück auf die Schultern und in die nächste Kniebeuge.',
    cues: ['Eine flüssige Bewegung ohne Pause.', 'Rumpf fest, kein Hohlkreuz oben.'],
    view: OVERHEAD, props: [{ t: 'db' }],
    poses: [
      { hp: [37, 68], tr: 35, a: [50, 90], ua: 190, fa: 25 },
      { ...STAND, ua: 2, fa: 0 },
    ],
  },
  {
    id: 'snatch-einarmig', name: 'Snatch einarmig', equip: ['kh'], muscles: 'Gesäß · hintere Oberschenkel · Schultern', mode: 'reps', side: true,
    how: 'Füße schulterbreit, in die Hocke gehen und die Hantel zwischen den Füßen greifen. Aus Hüfte und Beinen explosiv strecken, die Hantel nah am Körper hochziehen und in einem Zug über den Kopf führen, bis der Arm gestreckt ist. Kontrolliert zurück zwischen die Füße. Erst alle Wiederholungen auf einer Seite.',
    cues: ['Hantel nah am Körper führen.', 'Rücken gerade beim Absenken.'],
    view: OVERHEAD, props: [{ t: 'db', both: false }],
    seq: [0, 1, 2, 1], key: 2,
    poses: [
      { hp: [38, 70], tr: 60, a: [52, 90], w: [54, 81], ua2: 170, fa2: 170 },
      { via: true, hp: [48, 53], tr: 10, a: [52, 90], ua: 168, fa: 20, ua2: 180, fa2: 180 },
      { hp: [52, 50], tr: 0, a: [52, 90], ua: 2, fa: 0, ua2: 182, fa2: 182 },
    ],
  },
  {
    id: 'snatch-beidarmig', name: 'Snatch beidarmig (Double Snatch)', equip: ['kh'], muscles: 'Gesäß · hintere Oberschenkel · Schultern', mode: 'reps',
    how: 'Füße schulterbreit, in die Hocke gehen, in jeder Hand eine Hantel zwischen den Füßen. Explosiv aus Hüfte und Beinen strecken und beide Hanteln in einem Zug über den Kopf bringen. Kontrolliert zurück zwischen die Füße.',
    cues: ['Rumpf fest, kein Hohlkreuz.', 'Rücken gerade beim Absenken.'],
    view: OVERHEAD, props: [{ t: 'db' }],
    seq: [0, 1, 2, 1], key: 2,
    poses: [
      { hp: [38, 70], tr: 60, a: [52, 90], w: [54, 81] },
      { via: true, hp: [48, 53], tr: 10, a: [52, 90], ua: 168, fa: 20 },
      { hp: [52, 50], tr: 0, a: [52, 90], ua: 2, fa: 0 },
    ],
  },
  {
    id: 'high-pull', name: 'Sumo High Pull', equip: ['kh'], muscles: 'Schultern · Oberer Rücken · Gesäß', mode: 'reps',
    how: 'Breiter Stand, Zehen nach außen, eine Hantel oder Kettlebell mit beiden Händen vor dem Körper. In die Hocke gehen, kraftvoll aufstehen und das Gewicht nah am Körper bis unters Kinn ziehen. Kontrolliert zurück in die Hocke.',
    cues: ['Ellbogen ziehen hoch und nach außen.', 'Schultern nicht zu den Ohren hochziehen.'],
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [44, 63], tr: 18, a: [54, 90], ua: 178, fa: 178 },
      { ...STAND, ua: 75, fa: 255 },
    ],
  },
  {
    id: 'kreuzheben-push-press', name: 'Kreuzheben mit Push Press', equip: ['kh'], muscles: 'Gesäß · hintere Oberschenkel · Schultern', mode: 'reps',
    how: 'Hanteln vor den Oberschenkeln. Hüfte nach hinten schieben und die Hanteln bis unter die Knie führen, aufrichten und die Hanteln auf die Schultern bringen. Leicht in die Knie federn und mit Schwung aus den Beinen über den Kopf drücken. Kontrolliert zurück auf die Schultern und vor die Oberschenkel.',
    cues: ['Rücken gerade beim Kreuzheben.', 'Oben Rumpf fest, kein Hohlkreuz.'],
    view: OVERHEAD, props: [{ t: 'db' }],
    seq: [0, 1, 0, 2, 3, 4, 2], key: 4,
    poses: [
      { ...STAND, a: [50, 90] },
      { hp: [41, 52], tr: 80, a: [50, 90], ua: 208, fa: 208 },
      { ...STAND, a: [50, 90], ua: 160, fa: 5 },
      { via: true, hp: [46, 54], tr: 6, a: [50, 90], ua: 166, fa: 11 },
      { ...STAND, a: [50, 90], ua: 2, fa: 0 },
    ],
  },
  {
    id: 'rdl-rudern', name: 'Rumänisches Kreuzheben mit Rudern', equip: ['kh'], muscles: 'Hintere Oberschenkel · Gesäß · Rücken', mode: 'reps',
    how: 'Hanteln vor den Oberschenkeln, Knie leicht gebeugt. Hüfte nach hinten schieben und die Hanteln an den Beinen bis unter die Knie führen. In der Vorbeuge einmal zur Hüfte rudern, Hanteln absenken und aufrichten.',
    cues: ['Rücken bleibt gerade.', 'Schulterblätter beim Rudern zusammen.'],
    props: [{ t: 'db' }],
    seq: [0, 1, 2, 1], key: 2,
    poses: [
      STAND,
      { hp: [41, 52], tr: 78, a: [50, 90], ua: 206, fa: 206 },
      { hp: [41, 52], tr: 78, a: [50, 90], ua: 240, fa: 180 },
    ],
  },
  {
    id: 'burpee-kh', name: 'Burpee mit Kurzhanteln', equip: ['kh'], muscles: 'Oberschenkel · Brust · Rumpf · Ausdauer', mode: 'reps',
    how: 'Hanteln neben den Füßen. In die Hocke, Hände auf die Hanteln und mit den Füßen in den Liegestütz springen. Füße wieder heranspringen, mit den Hanteln aufstehen und sie über den Kopf drücken. Hanteln absetzen und von vorn.',
    cues: ['Im Stütz Körper gerade.', 'Schwerer: unten ein Liegestütz.'],
    view: OVERHEAD, props: [{ t: 'db', both: false }],
    seq: [0, 1, 2, 1, 0, 3, 4, 5, 4, 3], key: 5,
    poses: [
      { hp: [52, 70], tr: 70, a: [66, 90], w: [76, 88] },
      { via: true, hp: [49, 64], tr: 80, a: [40, 84], w: [76, 88] },
      { ...PUSH_UP, w: [76, 88] },
      { via: true, hp: [66, 50], tr: 0, a: [66, 90], ua: 180, fa: 180 },
      { via: true, hp: [66, 50], tr: 0, a: [66, 90], ua: 160, fa: 5 },
      { hp: [66, 50], tr: 0, a: [66, 90], ua: 2, fa: 0 },
    ],
  },
  {
    id: 'goblet-reverse-lunge', name: 'Goblet Squat + Ausfallschritt rückwärts', equip: ['kh'], muscles: 'Oberschenkel · Gesäß', mode: 'reps',
    how: 'Hantel senkrecht vor der Brust. Eine Goblet-Kniebeuge machen, aufstehen, dann je einen Ausfallschritt rückwärts links und rechts. Diese Folge ist eine Wiederholung.',
    cues: ['Oberkörper aufrecht.', 'Hantel bleibt eng an der Brust.'],
    props: [{ t: 'db', both: false }],
    seq: [0, 1, 0, 2, 3, 2, 0, 4, 5, 4], key: 3,
    poses: [
      { hp: [50, 50], tr: 0, a: [50, 90], a2: [50, 90], w: [61, 30] },
      { hp: [37, 68], tr: 35, a: [50, 90], a2: [50, 90], w: [63, 44] },
      { via: true, hp: [46, 53], tr: 1, a: [50, 90], a2: [36, 84], w: [57, 31] },
      { hp: [38, 70], tr: 2, a: [50, 90], a2: [20, 90], w: [50, 46] },
      { via: true, hp: [46, 53], tr: 1, a: [36, 84], a2: [50, 90], w: [57, 31] },
      { hp: [38, 70], tr: 2, a: [20, 90], a2: [50, 90], w: [50, 46] },
    ],
  },
  {
    id: 'sumo-jump-squat', name: 'Sumo-Sprungkniebeuge mit Kurzhantel', equip: ['kh'], muscles: 'Oberschenkel · Gesäß · Adduktoren', mode: 'reps',
    how: 'Breiter Stand, Zehen nach außen, eine Hantel senkrecht mit beiden Händen zwischen den Beinen. Tief in die Sumo-Hocke gehen, explosiv abspringen und weich wieder in der Hocke landen.',
    cues: ['Leichtes Gewicht wählen.', 'Knie zeigen nach außen.'],
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [50, 68], tr: 0, a: [30, 90], a2: [70, 90], ab: 1, w: [50, 86], w2: [50, 86] },
      { hp: [50, 46], tr: 0, a: [40, 85], a2: [60, 85], ab: 1, w: [50, 70], w2: [50, 70] },
    ],
  },
  {
    id: 'einbein-rotation', name: 'Rumpfrotation auf einem Bein', equip: ['kh'], muscles: 'Rumpf · Gesäß · Schultern', mode: 'reps', side: true,
    how: 'Auf einem Bein stehen, Hantel mit beiden Händen und gestreckten Armen vor der Brust. Oberkörper und Arme langsam zu einer Seite drehen und zurück zur Mitte, dann zur anderen Seite. Erst alle Wiederholungen auf einem Bein, dann wechseln.',
    cues: ['Becken bleibt ruhig nach vorn gerichtet.', 'Gleichgewicht vor Tempo.'],
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [50, 50], tr: 0, th: 180, sh: 180, th2: 165, sh2: 210, ua: 85, fa: 85, ua2: 85, fa2: 85 },
      { hp: [50, 50], tr: 0, th: 180, sh: 180, th2: 165, sh2: 210, ua: 130, fa: 140, ua2: 130, fa2: 140 },
    ],
  },

  // Oberkörper
  {
    id: 'seitheben', front: true, name: 'Seitheben', equip: ['kh'], muscles: 'Seitliche Schulter', mode: 'reps',
    how: 'Aufrecht stehen, Hanteln seitlich neben dem Körper. Mit leicht gebeugten Ellbogen seitlich bis auf Schulterhöhe heben, kurz halten und langsam senken.',
    cues: ['Leichtes Gewicht, kein Schwung.', 'Schultern nicht hochziehen.'],
    props: [{ t: 'db' }],
    poses: [
      { ...STAND, ua: 165, fa: 168, ua2: 195, fa2: 192 },
      { ...STAND, ua: 88, fa: 95, ua2: 272, fa2: 265 },
    ],
  },
  {
    id: 'seit-frontheben', front: true, name: 'Seitheben zum Frontheben', equip: ['kh'], muscles: 'Schultern', mode: 'reps',
    how: 'Aufrecht stehen, Hanteln neben dem Körper. Seitlich bis auf Schulterhöhe heben, oben vor dem Körper zusammenführen und nach vorn absenken. Die nächste Wiederholung umgekehrt: nach vorn heben, oben zur Seite öffnen, seitlich absenken.',
    cues: ['Leichtes Gewicht.', 'Arme leicht gebeugt, kein Schwung.'],
    props: [{ t: 'db' }],
    seq: [0, 1, 2], key: 1,
    poses: [
      { ...STAND, ua: 165, fa: 168, ua2: 195, fa2: 192 },
      { flat: true, ...STAND, ua: 88, fa: 95, ua2: 272, fa2: 265 },
      { ...STAND, ua: 90, fa: 88, ua2: 90, fa2: 88 },
    ],
  },
  {
    id: 'reverse-flys', name: 'Reverse Flys vorgebeugt', equip: ['kh'], muscles: 'Hintere Schulter · Oberer Rücken', mode: 'reps',
    how: 'Knie leicht gebeugt, Oberkörper mit geradem Rücken weit vorbeugen, Arme hängen leicht gebeugt unter den Schultern. Hanteln seitlich nach außen heben, bis die Arme auf Schulterhöhe sind, und langsam senken.',
    cues: ['Schulterblätter zusammen.', 'Leichtes Gewicht, kein Schwung.'],
    props: [{ t: 'db' }],
    poses: [
      { hp: [44, 52], tr: 72, a: [50, 90], ua: 182, fa: 175 },
      { hp: [44, 52], tr: 72, a: [50, 90], ua: 265, fa: 250 },
    ],
  },
  {
    id: 'rudern-breit', name: 'Rudern im breiten Stand', equip: ['kh'], muscles: 'Oberer Rücken · Hintere Schulter · Bizeps', mode: 'reps',
    how: 'Breiter Stand, Knie gebeugt, Oberkörper weit vorgeneigt, Hanteln hängen unter den Schultern. Hanteln mit weit abgespreizten Ellbogen seitlich hochziehen und langsam ablassen.',
    cues: ['Schulterblätter zusammen.', 'Rücken gerade.'],
    props: [{ t: 'db' }],
    poses: [
      { hp: [44, 55], tr: 65, a: [56, 90], a2: [36, 90], ua: 180, fa: 180 },
      { hp: [44, 55], tr: 65, a: [56, 90], a2: [36, 90], ua: 275, fa: 185 },
    ],
  },
  {
    id: 'rudern-einarmig', name: 'Einarmiges Rudern', equip: ['kh'], muscles: 'Oberer Rücken · Bizeps', mode: 'reps', side: true,
    how: 'Schrittstellung, freie Hand auf Bank oder Oberschenkel, Oberkörper vorgeneigt, Hantel hängt unter der Schulter. Hantel zur Hüfte ziehen und langsam wieder ablassen. Erst alle Wiederholungen auf einer Seite.',
    cues: ['Rücken gerade.', 'Ellbogen nah am Körper.'],
    props: [{ t: 'bench', x: 60, y: 66, w: 30 }, { t: 'db', both: false }],
    poses: [
      { hp: [40, 50], tr: 74, a: [46, 90], a2: [30, 90], w2: [72, 66], ua: 180, fa: 180 },
      { hp: [40, 50], tr: 74, a: [46, 90], a2: [30, 90], w2: [72, 66], ua: 245, fa: 180 },
    ],
  },
  {
    id: 'vierfuessler-rudern', name: 'Rudern im Vierfüßlerstand', equip: ['kh'], muscles: 'Oberer Rücken · Rumpf · Bizeps', mode: 'reps', side: true,
    how: 'Vierfüßlerstand, eine Hand stützt, die andere hält die Hantel unter der Schulter. Hantel zur Hüfte rudern und langsam wieder absenken. Erst alle Wiederholungen auf einer Seite.',
    cues: ['Becken und Schultern verdrehen sich nicht.', 'Rumpf fest.'],
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [40, 70], tr: 82, th: 180, sh: 270, w2: [68, 90], w: [67, 87] },
      { hp: [40, 70], tr: 82, th: 180, sh: 270, w2: [68, 90], ua: 250, fa: 175 },
    ],
  },
  {
    id: 'renegade-row', name: 'Rudern im Stütz (Renegade Row)', equip: ['kh'], muscles: 'Rücken · Rumpf · Bizeps', mode: 'reps', side: true,
    how: 'Hoher Liegestütz, Hände auf den Hanteln, Füße etwas breiter als hüftbreit. Eine Hantel zur Hüfte ziehen, wieder abstellen und mit der anderen Seite rudern.',
    cues: ['Hüfte nicht aufdrehen.', 'Leichter: Knie am Boden.'],
    props: [{ t: 'db' }],
    poses: [
      { ...PUSH_UP, w2: [76, 90] },
      { ...PUSH_UP, w2: [76, 90], w: undefined, ua: 245, fa: 175 },
    ],
  },
  {
    id: 'floor-press', name: 'Floor Press', equip: ['kh'], muscles: 'Brust · Trizeps', mode: 'reps',
    how: 'Rückenlage am Boden, Knie aufgestellt, Hanteln über der Brust. Hanteln absenken, bis die Oberarme den Boden berühren, und wieder nach oben drücken.',
    cues: ['Ellbogen etwa 45° vom Körper.', 'Schont die Schultern, weil der Boden die Bewegung begrenzt.'],
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [56, 84], tr: 270, hd: 270, a: [74, 90], ua: 90, fa: 0 },
      { hp: [56, 84], tr: 270, hd: 270, a: [74, 90], ua: 2, fa: 0 },
    ],
  },
  {
    id: 'flys', name: 'Fliegende (Flys)', equip: ['kh'], muscles: 'Brust', mode: 'reps',
    how: 'Rückenlage am Boden oder auf der Bank, Hanteln über der Brust, Ellbogen leicht gebeugt. Arme in einem weiten Bogen zur Seite öffnen und auf demselben Weg wieder über der Brust zusammenführen.',
    cues: ['Ellbogen-Winkel bleibt gleich.', 'Nur so weit öffnen, wie es sich angenehm anfühlt.'],
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [56, 84], tr: 270, hd: 270, a: [74, 90], ua: 2, fa: 0 },
      { hp: [56, 84], tr: 270, hd: 270, a: [74, 90], ua: 60, fa: 100 },
    ],
  },
  {
    id: 'skull-crusher', name: 'Trizepsdrücken liegend (Skull Crusher)', equip: ['kh'], muscles: 'Trizeps', mode: 'reps',
    how: 'Rückenlage auf Boden, Bank oder Schrägbank, Hanteln mit gestreckten Armen über den Schultern. Nur die Unterarme beugen, bis die Hanteln neben dem Kopf sind, und wieder strecken.',
    cues: ['Oberarme bleiben ruhig.', 'Langsam absenken.'],
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [56, 84], tr: 270, hd: 270, a: [74, 90], ua: 2, fa: 0 },
      { hp: [56, 84], tr: 270, hd: 270, a: [74, 90], ua: 350, fa: 250 },
    ],
  },
  {
    id: 'trizeps-ueberkopf', name: 'Trizepsdrücken über Kopf', equip: ['kh'], muscles: 'Trizeps', mode: 'reps',
    how: 'Aufrecht stehen, eine Hantel mit beiden Händen über den Kopf strecken. Unterarme hinter den Kopf senken und wieder strecken.',
    cues: ['Ellbogen zeigen nach oben und bleiben eng.', 'Rumpf fest, kein Hohlkreuz.'],
    view: OVERHEAD, props: [{ t: 'db', both: false }],
    poses: [
      { ...STAND, ua: 2, fa: 0 },
      { ...STAND, ua: 352, fa: 190 },
    ],
  },
  {
    id: 'trizeps-plank', name: 'Trizeps-Stütz (Push Plank)', equip: [], muscles: 'Trizeps · Rumpf', mode: 'reps',
    how: 'Unterarmstütz, Handflächen flach am Boden. Nur durch Strecken der Ellbogen in den hohen Stütz drücken, die Hände bleiben, wo sie sind. Langsam zurück auf die Unterarme.',
    cues: ['Körper bleibt eine Linie.', 'Leichter: Knie am Boden.'],
    poses: [
      { hp: [46.8, 80.6], tr: 76.4, a: [8, 90], ua: 180, fa: 90 },
      { hp: [52, 72], tr: 68, a: [14, 90], w: [87, 90] },
    ],
  },
  {
    id: 'push-plank', name: 'Push Plank (Up-Down)', equip: [], muscles: 'Rumpf · Schultern · Trizeps', mode: 'reps',
    how: 'Unterarmstütz. Erst eine, dann die andere Hand aufsetzen und in den hohen Stütz drücken. Arm für Arm zurück auf die Unterarme. Die Startseite bei jeder Wiederholung wechseln.',
    cues: ['Hüfte ruhig halten, nicht schaukeln.', 'Füße etwas breiter für mehr Stabilität.'],
    seq: [0, 1, 2, 1], key: 2, alt: true,
    poses: [
      { hp: [46.8, 80.6], tr: 76.4, a: [8, 90], ua: 180, fa: 90, ua2: 180, fa2: 90 },
      { hp: [46.4, 77.3], tr: 72, a: [8, 90], w: [72, 90], w2: [86, 89] },
      { ...PUSH_UP, a: [8, 90], hp: [46, 74], w: [72, 90], w2: [72, 90] },
    ],
  },
  {
    id: 'schulter-tippen', name: 'Schultertippen im Stütz', equip: [], muscles: 'Rumpf · Schultern', mode: 'reps',
    how: 'Hoher Liegestütz, Füße etwas breiter als hüftbreit. Abwechselnd mit einer Hand die gegenüberliegende Schulter antippen und zurück aufsetzen.',
    cues: ['Hüfte bleibt ruhig.', 'Je langsamer, desto stabiler.'],
    poses: [
      { ...PUSH_UP, w2: [76, 90] },
      { ...PUSH_UP, w2: [76, 90], w: [74, 68] },
    ],
  },
  {
    id: 'plank-pull-through', name: 'Plank Pull-Through', equip: ['kh'], muscles: 'Rumpf · Schultern · Rücken', mode: 'reps', side: true,
    how: 'Hoher Stütz, Hantel neben einer Hand. Mit der anderen Hand unter dem Körper durchgreifen und die Hantel auf die andere Seite ziehen. Hand zurücksetzen und die Hantel mit der anderen Hand zurückholen.',
    cues: ['Hüfte bleibt ruhig und tief.', 'Leichter: Füße breiter.'],
    props: [{ t: 'db', both: false }],
    poses: [
      { ...PUSH_UP, w2: [76, 90], w: [58, 88] },
      { ...PUSH_UP, w2: [76, 90], w: [88, 88] },
    ],
  },
  {
    id: 'hollow-brustpresse', name: 'Brustpresse im Hollow Hold', equip: ['kh'], muscles: 'Rumpf · Brust · Trizeps', mode: 'reps',
    how: 'Rückenlage, Hanteln über der Brust. In die Hollow-Position gehen: unteren Rücken in den Boden drücken, Schultern und Beine leicht anheben. In dieser Haltung die Hanteln senken, bis die Oberarme den Boden berühren, und wieder nach oben drücken.',
    cues: ['Der Rücken hebt nicht ab.', 'Leichter: Knie angewinkelt.'],
    props: [{ t: 'db', both: false }],
    poses: [
      { hp: [54, 82], tr: 285, hd: 285, th: 75, sh: 75, ua: 110, fa: 15 },
      { hp: [54, 82], tr: 285, hd: 285, th: 75, sh: 75, ua: 10, fa: 10 },
    ],
  },
  {
    id: 'schulterdruecken-kniend', name: 'Schulterdrücken kniend', equip: ['kh'], muscles: 'Schultern · Trizeps · Rumpf', mode: 'reps', side: true,
    how: 'Halbkniestand: ein Knie am Boden, der andere Fuß vorn aufgestellt. Hantel auf der Seite des hinteren Beins auf Schulterhöhe. Senkrecht nach oben drücken und wieder auf Schulterhöhe senken. Erst alle Wiederholungen auf einer Seite.',
    cues: ['Gesäß angespannt, Rumpf aufrecht.', 'Nicht zur Seite lehnen.'],
    view: OVERHEAD, props: [{ t: 'db', both: false }],
    poses: [
      { hp: [46, 69], tr: 0, th: 182, sh: 268, a2: [62, 90], ua: 160, fa: 5, ua2: 180, fa2: 170 },
      { hp: [46, 69], tr: 0, th: 182, sh: 268, a2: [62, 90], ua: 2, fa: 0, ua2: 180, fa2: 170 },
    ],
  },
  {
    id: 'v-sit-schulterdruecken', name: 'Schulterdrücken im V-Sitz', equip: ['kh'], muscles: 'Schultern · Rumpf', mode: 'reps',
    how: 'Sitzen, Oberkörper leicht zurückgelehnt, Füße vom Boden angehoben, Hanteln auf Schulterhöhe. In dieser Balance die Hanteln nach oben drücken und wieder auf Schulterhöhe senken.',
    cues: ['Rücken lang, Bauch fest.', 'Leichter: Fersen am Boden.'],
    props: [{ t: 'db' }],
    poses: [
      { hp: [44, 86], tr: 340, th: 55, sh: 105, ua: 150, fa: 345 },
      { hp: [44, 86], tr: 340, th: 55, sh: 105, ua: 345, fa: 345 },
    ],
  },
  {
    id: 'around-the-world', name: 'Around the World über Kopf', equip: ['kh'], muscles: 'Schultern · Rumpf', mode: 'reps',
    how: 'Aufrecht stehen, eine Hantel mit beiden Händen vor dem Gesicht. In einem Kreis um den Kopf führen: über die eine Schulter, hinter dem Kopf entlang, über die andere Schulter zurück nach vorn. Ein Kreis ist eine Wiederholung, Richtung abwechseln.',
    cues: ['Kopf bleibt ruhig.', 'Rumpf fest, Hüfte bewegt sich nicht mit.'],
    view: OVERHEAD, props: [{ t: 'db', both: false }],
    poses: [
      { ...STAND, ua: 50, fa: 330 },
      { ...STAND, ua: 345, fa: 200 },
    ],
  },
  {
    id: 'curl-arnold', name: 'Curl zum Arnold Press', equip: ['kh'], muscles: 'Bizeps · Schultern', mode: 'reps',
    how: 'Aufrecht stehen, Hanteln im Untergriff neben dem Körper. Bizepscurl bis zur Schulter, dann die Hanteln eindrehen und in einer drehenden Bewegung über den Kopf drücken. Auf demselben Weg zurück: herabdrehen auf Schulterhöhe, dann ablassen.',
    cues: ['Kein Schwung aus dem Rücken.', 'Oben kein Hohlkreuz.'],
    view: OVERHEAD, props: [{ t: 'db' }],
    seq: [0, 1, 2, 1], key: 2,
    poses: [
      { ...STAND, ua: 172 },
      { ...STAND, ua: 165, fa: 20 },
      { ...STAND, ua: 2, fa: 0 },
    ],
  },
  {
    id: 'zottman-curl', name: 'Zottman Curl', equip: ['kh'], muscles: 'Bizeps · Unterarm', mode: 'reps',
    how: 'Aufrecht stehen, Hanteln im Untergriff neben dem Körper. Zur Schulter beugen, oben die Hände umdrehen und im Obergriff langsam absenken. Unten wieder in den Untergriff drehen.',
    cues: ['Ellbogen bleiben am Körper.', 'Absenken bewusst langsam.'],
    props: [{ t: 'db' }],
    poses: [{ ...STAND, ua: 172 }, { ...STAND, ua: 165, fa: 20 }],
  },
  {
    id: 'bizepscurl-seitlich', front: true, name: 'Bizepscurl seitlich', equip: ['kh'], muscles: 'Bizeps', mode: 'reps',
    how: 'Aufrecht stehen, Arme leicht vom Körper abgespreizt, Handflächen zeigen nach vorn. Hanteln seitlich zur Schulter beugen und langsam ablassen.',
    cues: ['Ellbogen bleiben auf derselben Höhe.', 'Kein Schwung.'],
    props: [{ t: 'db' }],
    poses: [
      { ...STAND, ua: 160, fa: 165, ua2: 200, fa2: 195 },
      { ...STAND, ua: 160, fa: 20, ua2: 200, fa2: 340 },
    ],
  },
  {
    id: 'curl-trizeps', name: 'Bizepscurl zur Trizepsstreckung', equip: ['kh'], muscles: 'Bizeps · Trizeps', mode: 'reps',
    how: 'Aufrecht stehen, Hanteln im Untergriff. Bizepscurl zur Schulter, Hanteln über den Kopf strecken und hinter dem Kopf absenken. Wieder strecken, zur Schulter zurückführen und ablassen.',
    cues: ['Beim Trizepsteil Ellbogen eng.', 'Rumpf fest, kein Hohlkreuz.'],
    view: OVERHEAD, props: [{ t: 'db' }],
    seq: [0, 1, 2, 3, 2, 1], key: 3,
    poses: [
      { ...STAND, ua: 172 },
      { ...STAND, ua: 165, fa: 20 },
      { ...STAND, ua: 2, fa: 0 },
      { ...STAND, ua: 352, fa: 190 },
    ],
  },

  // Rumpf
  {
    id: 'dead-bug', name: 'Dead Bug', equip: [], muscles: 'Rumpf', mode: 'reps',
    how: 'Rückenlage, Arme senkrecht nach oben, Knie über der Hüfte im rechten Winkel. Gegengleich einen Arm hinter den Kopf und das andere Bein gestreckt knapp über den Boden senken. Zurück zur Mitte und Seite wechseln.',
    cues: ['Unterer Rücken bleibt am Boden.', 'Langsam ausatmen beim Senken.'],
    alt: true,
    poses: [
      { hp: [52, 84], tr: 270, hd: 270, th: 0, sh: 90, th2: 0, sh2: 90, ua: 0, fa: 0, ua2: 0, fa2: 0 },
      { hp: [52, 84], tr: 270, hd: 270, th: 0, sh: 90, th2: 82, sh2: 82, ua: 275, fa: 275, ua2: 0, fa2: 0 },
    ],
  },
  {
    id: 'crunch-gestreckt', name: 'Crunch mit gestreckten Beinen', equip: [], muscles: 'Gerade Bauchmuskulatur', mode: 'reps',
    how: 'Rückenlage, Beine senkrecht nach oben gestreckt. Oberkörper einrollen und mit den Händen Richtung Füße greifen. Langsam wieder abrollen.',
    cues: ['Beine bleiben ruhig.', 'Nacken locker.'],
    poses: [
      { hp: [56, 85], tr: 270, hd: 270, th: 5, sh: 5, ua: 300, fa: 300 },
      { hp: [56, 85], tr: 300, hd: 310, th: 5, sh: 5, ua: 25, fa: 25 },
    ],
  },
  {
    id: 'beinheben-seitlich', name: 'Beinheben seitlich (Scheibenwischer)', equip: [], muscles: 'Bauch · Seitliche Rumpfmuskulatur', mode: 'reps', side: true,
    how: 'Rückenlage, Arme seitlich am Boden, gestreckte Beine senkrecht anheben. Beine langsam zu einer Seite absenken, ohne den Boden zu berühren, zurück zur Mitte und zur anderen Seite.',
    cues: ['Schultern bleiben am Boden.', 'Leichter: Knie angewinkelt.'],
    poses: [
      { hp: [50, 85], tr: 270, hd: 270, th: 5, sh: 5, ua: 270, fa: 270 },
      { hp: [50, 85], tr: 270, hd: 270, th: 55, sh: 55, ua: 270, fa: 270 },
    ],
  },
  {
    id: 'v-up', name: 'V-Up', equip: [], muscles: 'Bauch · Hüftbeuger', mode: 'reps',
    how: 'Rückenlage gestreckt, Arme über dem Kopf. Gleichzeitig Oberkörper und gestreckte Beine anheben und mit den Händen Richtung Füße greifen. Langsam wieder ablegen.',
    cues: ['Mit Kontrolle, nicht mit Schwung.', 'Leichter: Knie anziehen.'],
    poses: [
      { hp: [50, 86], tr: 268, hd: 268, th: 92, sh: 92, ua: 268, fa: 268 },
      { hp: [50, 86], tr: 320, hd: 330, th: 40, sh: 40, ua: 35, fa: 35 },
    ],
  },

  // Geräte: Schlingentrainer, Battle Rope
  {
    id: 'trx-rudern', name: 'Rudern am Schlingentrainer', equip: ['trx'], muscles: 'Rücken · Bizeps · Rumpf', mode: 'reps',
    how: 'Griffe fassen, Arme gestreckt, Füße vor dem Ankerpunkt, Körper gerade nach hinten lehnen. Brust zu den Händen ziehen und langsam wieder zurücklehnen, bis die Arme gestreckt sind.',
    cues: ['Körper bleibt eine Linie.', 'Schulterblätter zusammen.', 'Je steiler du stehst, desto leichter.'],
    props: [{ t: 'band', from: [84, 4] }],
    poses: [
      { hp: [46, 52.5], tr: 340, a: [60, 90], w: [84, 4] },
      { hp: [53, 51], tr: 352, a: [60, 90], w: [60, 26] },
    ],
  },
  {
    id: 'trx-overhead-squat', name: 'Überkopf-Kniebeuge am Schlingentrainer', equip: ['trx'], muscles: 'Oberschenkel · Gesäß · Schultern', mode: 'reps',
    how: 'Mit Blick zum Ankerpunkt stehen, Griffe mit gestreckten Armen über dem Kopf, leicht nach hinten lehnen. Tief in die Kniebeuge sitzen und über die Fersen wieder aufstehen.',
    cues: ['Arme bleiben gestreckt, Brust offen.', 'Knie folgen den Zehen.'],
    props: [{ t: 'band', from: [84, 4] }],
    poses: [
      { ...STAND, w: [84, 4] },
      { hp: [36, 68], tr: 25, a: [50, 90], w: [84, 4] },
    ],
  },
  {
    id: 'trx-curtsy', name: 'Curtsy Squat am Schlingentrainer', equip: ['trx'], muscles: 'Oberschenkel · Gesäß · Adduktoren', mode: 'reps', side: true,
    how: 'Mit Blick zum Ankerpunkt stehen, Griffe vor dem Körper. Ein Bein diagonal hinter das andere setzen und tief absenken wie bei einem Knicks. Über das vordere Bein aufstehen. Erst alle Wiederholungen auf einer Seite.',
    cues: ['Vorderes Knie bleibt über dem Fuß.', 'Hüfte bleibt nach vorn gerichtet.'],
    props: [{ t: 'band', from: [92, 20] }],
    seq: [0, 1, 2, 1], key: 2,
    poses: [
      { hp: [56, 50], tr: 0, a: [56, 90], a2: [56, 90], w: [92, 20] },
      { via: true, hp: [51, 54], tr: 4, a: [56, 90], a2: [42, 84], w: [92, 20] },
      { hp: [42, 68], tr: 10, a: [56, 90], a2: [28, 90], w: [92, 20] },
    ],
  },
  {
    id: 'battle-rope', name: 'Battle Rope Wellen', equip: ['rope'], muscles: 'Schultern · Arme · Rumpf · Ausdauer', mode: 'time',
    how: 'Halbe Hocke, Füße schulterbreit, je ein Seilende in einer Hand. Arme abwechselnd oder gleichzeitig schnell auf und ab bewegen, sodass Wellen bis zum Anker laufen.',
    cues: ['Rumpf fest, Knie weich.', 'Gleichmäßige Wellen statt großer Ausholbewegung.'],
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
    how: 'Aufrecht stehen, einen Arm nach oben strecken, Ellbogen beugen und die Hand zwischen die Schulterblätter sinken lassen. Mit der anderen Hand den Ellbogen sanft nach hinten ziehen und halten. Danach die Seite wechseln.',
    cues: ['Kopf bleibt aufrecht.', 'Kein Hohlkreuz, Bauch leicht anspannen.'],
    view: OVERHEAD,
    from: { hd: 0, ua: 180, fa: 180, w2: null, ua2: 180, fa2: 180 },
    poses: [{ ...STAND, hd: 345, ua: 28, fa: 200, w2: [56, 11] }],
  },
  {
    id: 'brust-dehnung-wand', front: true, name: 'Brustdehnung an der Wand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Brust · Schultern · Bizeps', mode: 'time', side: true,
    t: { brust: 1, schulter: 0.4, bizeps: 0.3 },
    how: 'Seitlich neben eine Wand oder einen Türrahmen stellen, Hand und Unterarm auf Schulterhöhe anlegen. Den Oberkörper langsam von der Wand wegdrehen, bis ein Zug in der Brust entsteht, und halten. Danach die Seite wechseln.',
    cues: ['Schulter bleibt tief.', 'Aus dem ganzen Oberkörper drehen, nicht ins Hohlkreuz gehen.'],
    props: [{ t: 'wall', x: 26 }],
    from: { w: null, ua: 180, fa: 180 },
    poses: [{ hp: [50, 51], tr: 0, a: [58, 90], a2: [44, 90], w: [27, 22], ua2: 180, fa2: 180 }],
  },
  {
    id: 'schulter-dehnung', name: 'Schulterdehnung vor der Brust', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Schultern · Oberer Rücken', mode: 'time', side: true,
    t: { schulter: 1, oruecken: 0.5 },
    how: 'Aufrecht stehen und einen Arm gestreckt quer vor die Brust führen. Mit der anderen Hand oberhalb des Ellbogens sanft heranziehen und halten. Danach die Seite wechseln.',
    cues: ['Schultern locker und tief lassen.', 'Oberkörper nicht mitdrehen.'],
    from: { w2: null, ua: 180, fa: 180, ua2: 180, fa2: 180 },
    poses: [{ ...STAND, ua: 92, fa: 92, w2: [62, 25] }],
  },
  {
    id: 'bizeps-dehnung', name: 'Bizeps- und Unterarmdehnung', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Bizeps · Unterarm', mode: 'time', side: true,
    t: { bizeps: 1, unterarm: 1 },
    how: 'Aufrecht stehen, einen Arm gestreckt nach vorn heben, Handfläche zeigt nach vorn, Finger nach unten. Mit der anderen Hand die Finger sanft zum Körper ziehen und halten. Danach die Seite wechseln.',
    cues: ['Ellbogen bleibt gestreckt, nicht durchdrücken.', 'Schulter tief lassen.'],
    from: { ua: 180, fa: 180, w2: null, ua2: 180, fa2: 180 },
    poses: [{ ...STAND, ua: 98, fa: 98, w2: [71, 28] }],
  },
  {
    id: 'nacken-dehnung', name: 'Nackendehnung', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Nacken · Oberer Rücken', mode: 'time',
    t: { schulter: 0.4, oruecken: 0.4 },
    how: 'Aufrecht stehen, Hände locker an den Hinterkopf legen. Kinn langsam Richtung Brust sinken lassen und halten. Zum Lösen den Kopf langsam wieder aufrichten.',
    cues: ['Die Hände geben nur ihr Gewicht dazu, nicht ziehen.', 'Ruhig weiteratmen.'],
    from: { hd: 0 },
    poses: [{ ...STAND, hd: 35, w: [49, 9], w2: [49, 9], wb: -1, wb2: -1 }],
  },
  {
    id: 'rundruecken-dehnung', name: 'Rundrücken im Stand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Oberer Rücken · Schultern', mode: 'time',
    t: { oruecken: 1, schulter: 0.5, ruecken: 0.4 },
    how: 'Aufrecht stehen, Hände vor dem Körper verschränken und die Arme nach vorn schieben. Den oberen Rücken rund machen, den Kopf zwischen die Arme sinken lassen und halten. Langsam wieder aufrichten.',
    cues: ['Zwischen die Schulterblätter atmen.', 'Knie locker lassen.'],
    from: { tr: 0, hd: 0 },
    poses: [{ hp: [46, 51], tr: 12, hd: 40, th: 178, sh: 180, ua: 90, fa: 90 }],
  },
  {
    id: 'lat-dehnung', name: 'Latissimus-Dehnung an der Wand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Rücken · Schultern · Trizeps', mode: 'time',
    t: { ruecken: 1, oruecken: 0.6, schulter: 0.5, trizeps: 0.3 },
    how: 'Hände schulterbreit auf Hüfthöhe an eine Wand oder Stuhllehne legen. Mit dem Gesäß nach hinten gehen und den Oberkörper vorbeugen, bis Oberkörper und Arme eine Linie bilden. Brust sanft Richtung Boden sinken lassen und halten. Zum Lösen einen Schritt nach vorn gehen und aufrichten.',
    cues: ['Nacken lang, Kopf zwischen den Armen.', 'Knie dürfen leicht gebeugt sein.'],
    props: [{ t: 'wall', x: 88 }],
    from: { hp: [46, 51], tr: 35, hd: 35 },
    poses: [{ hp: [36, 52], tr: 88, hd: 95, a: [40, 90], w: [87, 50] }],
  },
  {
    id: 'quadrizeps-dehnung', name: 'Oberschenkel vorn im Stand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Oberschenkel · Hüftbeuger', mode: 'time', side: true,
    t: { quad: 1, hueftbeuger: 0.6 },
    how: 'Auf einem Bein stehen, die Ferse des anderen Beins zum Gesäß führen, den Fuß festhalten und die Position halten. Danach die Seite wechseln.',
    cues: ['Knie zeigen nach unten und bleiben nebeneinander.', 'Becken aufrichten, kein Hohlkreuz.', 'Bei Bedarf an der Wand abstützen.'],
    from: { th2: 188, sh2: 235, w: null, ua: 180, fa: 180 },
    poses: [{ ...STAND, th2: 215, sh2: 15, w: [43, 48], ua2: 175, fa2: 175 }],
  },
  {
    id: 'waden-dehnung', name: 'Wadendehnung an der Wand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Wade · Hintere Oberschenkel', mode: 'time', side: true,
    t: { wade: 1, hamstring: 0.3 },
    how: 'Mit den Händen an der Wand abstützen und ein Bein weit nach hinten stellen. Hintere Ferse in den Boden drücken, das hintere Bein bleibt gestreckt. Das vordere Knie beugen, bis die hintere Wade zieht, und halten. Danach die Seite wechseln.',
    cues: ['Beide Füße zeigen gerade nach vorn.', 'Hintere Ferse bleibt am Boden.'],
    props: [{ t: 'wall', x: 82 }],
    from: { hp: [41, 52], tr: 18 },
    poses: [{ hp: [46, 54], tr: 32, a: [54, 90], a2: [28, 90], w: [81, 30], w2: [81, 34] }],
  },
  {
    id: 'vorbeuge-stehend', name: 'Vorbeuge im Stand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Hintere Oberschenkel · Unterer Rücken · Wade', mode: 'time',
    t: { hamstring: 1, uruecken: 0.6, wade: 0.3 },
    how: 'Füße hüftbreit, Knie leicht gebeugt. Aus der Hüfte nach vorn sinken, den Oberkörper locker hängen lassen, Hände Richtung Boden oder Schienbeine, und halten. Danach langsam Wirbel für Wirbel aufrollen.',
    cues: ['Kopf und Nacken locker hängen lassen.', 'Nicht wippen.'],
    from: { tr: 0, hd: 0, w: null, w2: null },
    poses: [{ hp: [44, 50], tr: 150, hd: 165, a: [46, 90], w: [56, 88], w2: [58, 88] }],
  },
  {
    id: 'hueftbeuger-dehnung', name: 'Hüftbeuger im Kniestand', kind: 'stretch', pos: 'knie', equip: [], muscles: 'Hüftbeuger · Oberschenkel', mode: 'time', side: true,
    t: { hueftbeuger: 1, quad: 0.6 },
    how: 'Aus dem Ausfallschritt das hintere Knie auf den Boden setzen, Hände auf den vorderen Oberschenkel. Die Hüfte langsam nach vorn schieben, bis es vorn an der Hüfte des hinteren Beins zieht, und halten. Danach die Seite wechseln.',
    cues: ['Gesäß anspannen, Oberkörper aufrecht.', 'Vorderes Knie bleibt über dem Fuß.', 'Angenehmer: Kissen unter das hintere Knie.'],
    from: { hp: [39, 70], tr: 2 },
    poses: [{ hp: [44, 71], tr: 355, a: [66, 90], th2: 200, sh2: 268, w: [61, 71], w2: [61, 72] }],
  },
  {
    id: 'herabschauender-hund', name: 'Herabschauender Hund', kind: 'stretch', pos: 'knie', equip: [], muscles: 'Wade · Hintere Oberschenkel · Schultern · Rücken', mode: 'time',
    t: { wade: 0.8, hamstring: 0.8, schulter: 0.5, ruecken: 0.3 },
    how: 'Aus dem Vierfüßlerstand das Gesäß nach oben und hinten schieben, bis der Körper ein umgedrehtes V bildet. Arme lang, Kopf zwischen den Armen, Fersen Richtung Boden, und halten. Zum Lösen die Knie wieder zum Boden senken.',
    cues: ['Rücken lang lassen, dafür dürfen die Knie gebeugt bleiben.', 'Schultern weg von den Ohren.'],
    from: { hp: [46, 68], tr: 98, hd: 105 },
    poses: [{ hp: [44, 52], tr: 132, hd: 150, a: [30, 90], w: [82, 90], w2: [80, 90] }],
  },
  {
    id: 'katze-kuh', name: 'Katze-Kuh', kind: 'stretch', dynamic: true, pos: 'knie', equip: [], muscles: 'Rücken · Rumpf', mode: 'time',
    t: { ruecken: 0.7, uruecken: 0.7, rumpf: 0.5 },
    how: 'Vierfüßlerstand, Hände unter den Schultern, Knie unter der Hüfte. Mit dem Ausatmen den Rücken rund machen, Kinn zur Brust. Mit dem Einatmen das Brustbein nach vorn schieben, Blick leicht nach vorn. Langsam im Atemrhythmus wechseln.',
    cues: ['Arme bleiben gestreckt.', 'Bewegung klein und fließend halten.'],
    poses: [
      { hp: [40, 69], tr: 80, hd: 125, th: 180, sh: 270, w: [68, 90], w2: [67, 90] },
      { hp: [40, 71], tr: 86, hd: 55, th: 180, sh: 270, w: [68, 90], w2: [67, 90] },
    ],
  },
  {
    id: 'kindhaltung', name: 'Kindhaltung', kind: 'stretch', pos: 'knie', equip: [], muscles: 'Rücken · Schultern · Gesäß', mode: 'time',
    t: { ruecken: 0.8, uruecken: 0.6, schulter: 0.3, gesaess: 0.3 },
    how: 'Aus dem Vierfüßlerstand das Gesäß auf die Fersen sinken lassen. Arme lang nach vorn ablegen, Stirn Richtung Boden, und halten. Zum Lösen die Hände heranholen und aufrichten.',
    cues: ['In den Rücken atmen und loslassen.', 'Knie dürfen auseinander.'],
    from: { hp: [40, 70], tr: 82, hd: 90, th: 180, sh: 270, w: [68, 90], w2: [67, 90] },
    poses: [{ hp: [34, 76], tr: 98, hd: 115, th: 112, sh: 262, w: [88, 89], w2: [86, 89] }],
  },
  {
    id: 'kobra', name: 'Kobra', kind: 'stretch', pos: 'bauch', equip: [], muscles: 'Bauch · Hüftbeuger', mode: 'time',
    t: { rumpf: 1, hueftbeuger: 0.5 },
    how: 'Bauchlage, Beine gestreckt, Hände unter die Schultern setzen. Den Oberkörper langsam aufrichten, das Becken bleibt am Boden, und halten. Langsam wieder ablegen.',
    cues: ['Nur so weit, wie es sich im unteren Rücken gut anfühlt.', 'Schultern weg von den Ohren.'],
    from: { tr: 86, hd: 88 },
    poses: [{ hp: [46, 87], tr: 52, hd: 30, th: 270, sh: 270, w: [70, 90], w2: [69, 90] }],
  },
  {
    id: 'sitzende-vorbeuge', name: 'Vorbeuge im Sitzen', kind: 'stretch', pos: 'sitz', equip: [], muscles: 'Hintere Oberschenkel · Rücken', mode: 'time',
    t: { hamstring: 1, uruecken: 0.6, ruecken: 0.3 },
    how: 'Mit gestreckten Beinen aufrecht sitzen. Aus der Hüfte nach vorn neigen, Hände Richtung Füße, und halten. Langsam wieder aufrichten.',
    cues: ['Rücken möglichst lang lassen.', 'Knie dürfen leicht gebeugt sein.'],
    from: { tr: 8, hd: 5, w: [50, 85], w2: [51, 85] },
    poses: [{ hp: [32, 86], tr: 55, hd: 70, th: 90, sh: 90, w: [64, 82], w2: [66, 82] }],
  },
  {
    id: 'schmetterling', name: 'Schmetterling', kind: 'stretch', pos: 'sitz', equip: [], muscles: 'Adduktoren · Gesäß', mode: 'time',
    t: { adduktoren: 1, gesaess: 0.3 },
    how: 'Aufrecht sitzen, Fußsohlen aneinander, Knie nach außen fallen lassen. Füße mit den Händen halten und die Fersen nah zum Körper ziehen. Knie sanft sinken lassen und halten.',
    cues: ['Knie nicht nach unten drücken.', 'Rücken lang lassen.'],
    from: { tr: 0, th: 40, sh: 205 },
    poses: [{ hp: [42, 86], tr: 8, th: 58, sh: 222, w: [52, 86], w2: [53, 86] }],
  },
  {
    id: 'figur-vier', name: 'Gesäßdehnung liegend (Figur 4)', kind: 'stretch', pos: 'ruecken', equip: [], muscles: 'Gesäß · Unterer Rücken', mode: 'time', side: true,
    t: { gesaess: 1, uruecken: 0.3 },
    how: 'Rückenlage, einen Fuß auf das andere Knie legen. Das untere Bein anheben, den Oberschenkel mit beiden Händen zur Brust ziehen und halten. Danach die Seite wechseln.',
    cues: ['Kopf und Schultern bleiben entspannt am Boden.', 'Knie des oberen Beins sanft nach außen öffnen.'],
    from: { th2: 45, sh2: 150, a: [66, 69], ab: 1, w: null, w2: null, ua: 90, fa: 90, ua2: 90, fa2: 90 },
    poses: [{ hp: [52, 84], tr: 270, hd: 270, a: [46, 64], ab: 1, th2: 340, sh2: 75, w: [47, 73], w2: [48, 74] }],
  },
  {
    id: 'hamstring-liegend', name: 'Oberschenkel hinten liegend', kind: 'stretch', pos: 'ruecken', equip: [], muscles: 'Hintere Oberschenkel · Wade', mode: 'time', side: true,
    t: { hamstring: 1, wade: 0.3 },
    how: 'Rückenlage, ein Bein gestreckt nach oben heben und ein Handtuch oder Band um die Fußsohle legen. Das Bein sanft zu dir ziehen und halten, das andere Bein bleibt lang am Boden. Danach die Seite wechseln.',
    cues: ['Becken bleibt am Boden.', 'Leichter: Knie leicht gebeugt.'],
    props: [{ t: 'band', from: 'a' }],
    from: { th: 55, sh: 55 },
    poses: [{ hp: [52, 84], tr: 270, hd: 270, th: 5, sh: 5, th2: 90, sh2: 90, w: [44, 62], w2: [45, 63] }],
  },
  {
    id: 'rotation-liegend', name: 'Rotation liegend', kind: 'stretch', pos: 'ruecken', equip: [], muscles: 'Seitliche Rumpfmuskulatur · Unterer Rücken · Gesäß', mode: 'time', side: true,
    t: { seitrumpf: 1, uruecken: 0.6, rumpf: 0.4, gesaess: 0.3 },
    how: 'Rückenlage, Arme seitlich ablegen, beide Knie anwinkeln. Die Knie langsam zu einer Seite sinken lassen, den Blick zur anderen Seite drehen und halten. Zur Mitte zurück und die Seite wechseln.',
    cues: ['Beide Schultern bleiben am Boden.', 'Knie nur so weit sinken lassen, wie es angenehm ist.'],
    from: { th: 18, sh: 160 },
    poses: [{ hp: [54, 84], tr: 270, hd: 270, th: 45, sh: 140, ua: 300, fa: 300 }],
  },
  {
    id: 'hueftbeuger-stehend', name: 'Hüftbeuger im Stand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Hüftbeuger · Oberschenkel', mode: 'time', side: true,
    t: { hueftbeuger: 1, quad: 0.5 },
    how: 'Aus dem Stand einen großen Schritt nach vorn machen, hinteres Bein lang, Ferse hoch, Hände an die Hüfte. Die Hüfte sanft nach vorn schieben, bis es vorn an der Hüfte des hinteren Beins zieht, und halten. Danach die Seite wechseln.',
    cues: ['Gesäß anspannen.', 'Oberkörper bleibt aufrecht, kein Hohlkreuz.'],
    from: { hp: [43, 54], tr: 0 },
    poses: [{ hp: [47, 56], tr: 355, a: [66, 90], a2: [25, 90], w: [49, 55], w2: [49, 55] }],
  },
  {
    id: 'brustoeffner', name: 'Brustöffner im Stand', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Brust · Schultern', mode: 'time',
    t: { brust: 1, schulter: 0.5 },
    how: 'Aufrecht stehen, Hände hinter dem Rücken verschränken und die Arme lang machen. Schulterblätter zusammenziehen, die Hände sanft vom Gesäß weg nach hinten unten schieben und halten.',
    cues: ['Brustbein hebt sich, Blick geradeaus.', 'Kein Hohlkreuz.'],
    from: { tr: 0, hd: 0, ua: 180, fa: 180 },
    poses: [{ ...STAND, tr: 356, hd: 350, ua: 215, fa: 210 }],
  },
  {
    id: 'waden-stufe', name: 'Wadendehnung an der Stufe', kind: 'stretch', pos: 'stand', equip: [], muscles: 'Wade', mode: 'time', side: true,
    t: { wade: 1 },
    how: 'Mit dem Fußballen auf eine Stufe stellen, an Wand oder Geländer festhalten, das andere Bein locker anheben. Das Standbein gestreckt lassen, die Ferse langsam unter die Stufe sinken lassen und halten. Danach die Seite wechseln.',
    cues: ['Langsam absenken, nicht wippen.', 'Oberkörper aufrecht.'],
    view: '0 -8 100 100', props: [{ t: 'bench', x: 56, y: 81, w: 20 }, { t: 'wall', x: 76 }],
    from: { hp: [52, 41], a: [53, 81], fd: 90 },
    poses: [{ hp: [52.6, 44.6], tr: 0, a: [53.6, 84.6], fd: 51, th2: 172, sh2: 200, w: [75, 26], ua2: 180, fa2: 180 }],
  },
  {
    id: 'knie-zur-brust', name: 'Knie zur Brust', kind: 'stretch', pos: 'ruecken', equip: [], muscles: 'Unterer Rücken · Gesäß', mode: 'time',
    t: { uruecken: 1, ruecken: 0.5, gesaess: 0.4 },
    how: 'Rückenlage, beide Knie zur Brust ziehen, die Hände um die Schienbeine legen und halten. Danach die Füße wieder abstellen.',
    cues: ['Unteren Rücken lang in den Boden sinken lassen.', 'Kopf bleibt liegen.', 'Gern sanft hin und her wiegen.'],
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
