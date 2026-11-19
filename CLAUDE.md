# flow.training

Statische PWA (Vanilla JS, kein Build), primär fürs iPhone, gehostet auf GitHub Pages
(`cyberbomme/flow-training` → https://cyberbomme.github.io/flow-training/). Details zur Struktur: `README.md`.

## Design
**Aussehen, Komponenten und Texte richten sich nach [`docs/DESIGN.md`](docs/DESIGN.md).** Kurz:
- Tokens als CSS-Variablen in `app.css` (`--color-*`). Dunkelmodus ist daraus abgeleitet (gleiche Farbfamilien),
  Umschaltung Hell/Dunkel/System über `data-theme` auf `<html>`.
- Weitere Designs über `data-design="…"` (Liste `DESIGNS` in `js/app.js`): gleiche Schriften, Formen und Regeln,
  nur andere Farbfamilien – jedes setzt nur dieselben Tokens neu, hell und dunkel, Kontraste nach WCAG AA geprüft.
  Komponenten-CSS nutzt ausschließlich Tokens. Wahl unter *Einstellungen*. „Klassisch“ wurde entfernt (2026-11-18).
- Schriften lokal in `fonts/` (Oswald = Display/Zahlen, Gilda Display = Emotion, Montserrat = Body). Keine Google-CDN-Einbindung.
- Text in Salbei/Rosé nur dekorativ oder als große Headline; Buttons/Links in `forest`. Fehler/Löschen in `--color-rose-ink`.
- Logo: `js/logo.js` (aus der Vorlage vektorisiert), Farbe `--color-sage` über currentColor; App-Icon `icons/` = Entwurf A (Creme + Salbei).
- Offene Punkte aus DESIGN.md §11 sind als `TODO(Design)` im Code markiert (Brand-Farben, Logo-SVG, Fotos, Schriftlizenz).
- Microcopy: Du-Ansprache, ruhig, bestärkend; bei Gesundheit vorsichtig formulieren. Keine Emojis in UI-Elementen.
- Motivationstexte zentral in `js/texts.js` (Leitsätze der Marke unverändert in `BRAND`). Längengrenzen je Platz stehen dort; je Training gemischt, ohne Wiederholung.

## Baukasten (ein Stil pro Aufgabe, gilt für jeden neuen Screen)
- **Abschnitt:** immer `pill()` (PillLabel). Die Versal-Zeile (`.overline`) nur als Dachzeile über einem Titel.
- **Mehr / weiter:** Text + Chevron-Icon (`more()`), überall gleich. Keine Zeichen wie ›, ››› oder ».
- **Zurück:** immer das Icon `icon.back`, auch im Training.
- **Knöpfe, drei Stufen:** `.btn.primary` = Hauptaktion (eine pro Screen), `.btn` = Fläche (Nebenaktion), `.btn.text` = selten.
  Löschen/Entfernen/Verwerfen immer in `--color-rose-ink` (`.danger-text`, im Menü `.li.danger`).
- **An / aus:** Schalter (`input.switch` mit `role="switch"`), keine Kästchen.
- **Listenzeile:** `lrow()` – Kreis-Icon · Titel · eine Unterzeile · rechts ein Element (Chevron, Griff, Play oder Wert).
  Gruppierte Liste (Einstellungen, Sheets): `.listbox` mit `.li`.
- Plan-Editor: „···“ oben rechts bleibt immer (Kopieren, Verwerfen, Löschen), wird nie durch „Speichern“ ersetzt.
  Feste Aktionsleiste unten; mit Entwurf „Speichern · Starten“. Starten fragt: „Speichern & starten“ oder „Ohne Speichern starten“ –
  ohne Speichern wird der Entwurf nach Ende oder Abbruch des Trainings automatisch verworfen (`active.tempDraft`).
- Tab-Leiste: Pläne · Übungen · Verlauf · Einstellungen; Start-Seite sind die Pläne.
- Übungen hinzufügen: Mehrfachauswahl, unten „Hinzufügen (n)“.
- Katalog: eine wischbare Filterzeile (Ausrüstung als Sheet, Muskelgruppen mit Mehrfachauswahl in `db.muscles`).

## Arbeitsweise
- Neue Übungen in `js/exercises.js`; Figuren danach per Playwright-Screenshot prüfen (`~/pw-venv`).
  Muskelgruppen (Filter, Plan-Icons) werden automatisch aus `muscles` abgeleitet (`MUSCLE_GROUPS`) – Begriffe dort ggf. ergänzen.
  `side: true` = Wiederholungen je Seite: Anzeige „Wdh. je Seite“, Autopilot und Plandauer zählen doppelt (`sidesOf`).
  Fehlende Gelenkwinkel in einer Pose = Glied hängt senkrecht (Vorgabe in `figure.js`).
- Plan-Icons automatisch (`js/planicon.js`): erst Stichwort im Titel (Zyklusphasen, HIIT, Mobilität, Regeneration, Klettern,
  Core, Beine, Oberkörper, Ganzkörper, Kraft), sonst aus Muskelgruppen/Zeitanteil der Übungen.
- Version steht nur in `js/version.js` (Anzeige in *Einstellungen*, Cache-Name im Service Worker). Bei jedem Deploy hochzählen.
- Bei neuen Dateien `sw.js` → `SHELL` ergänzen. SW-Strategie: Netz zuerst (3 s), sonst Cache; neue Version lädt die App sofort neu.
- localStorage-Schlüssel `kraftkatalog.v1` nicht umbenennen (bestehende Daten auf dem iPhone).

## Pläne & Supersets
- Beispielpläne als Vorlagen in `js/templates.js` (Kurzform ex/ss/rest). „Übernehmen“ kopiert mit neuen IDs, Herkunft in `plan.tpl`.
  Sechs Vorlagen `tpl-studio-*` stammen aus den Studio-Workouts der Besitzerin (2026-11-19): 2 Runden Aufwärmen + Supersets aus zwei Übungen à 3 Runden,
  Übungen auf Schwerpunkte verteilt (Power, Beine & Po, Oberkörper, Schlingentrainer, Core, Hantel-Komplexe), damit sich die Pläne kaum wiederholen.
- Plan-Items: `ex` | `rest` | `group` (Superset: `rounds`, `rest` nach jeder Runde, `items` = Übungen). Logik in `js/planedit.js`.
- Superset-Regeln (vom Besitzer festgelegt): keine Pause zwischen den Übungen, beliebig viele Übungen, eine Rundenzahl für alle.
- Plan-Editor: Optik „Zeilen“ (Konzept A), Aufbau „Aufklappen“ (Konzept C). Griff ziehen = sortieren,
  auf Übung ziehen + 450 ms halten = Superset. Alle Zeilen gleich aufgebaut, Regler = Stepper aus dem Training.
- Änderungen im Editor landen in `db.drafts[planId]` (Entwurf). Start-Button heißt dann „Speichern & starten“,
  dazu „Speichern“/„Verwerfen“. Entwurf, der wieder dem Plan gleicht, wird automatisch entfernt. Start aus der Planliste nutzt die gespeicherte Fassung.

## Training-Ablauf
- Zeit-Übungen starten nach einer Pause automatisch. Bildaufbau Wiederholung/Zeit identisch (Ring im Figur-Kreis, Regler-Karte).
- Autopilot (Einstellung): auch Wiederholungen zählen herunter (Tempo × Wdh.) und schalten automatisch weiter.
  Tempo-Schätzungen in `TEMPO` (`js/exercises.js`), eigene Werte in `db.tempo` (1–8 s); Vorlauf `db.setup` nur vor Sätzen ohne Pause davor.
- Tempo ist die eine Quelle für Animation, Autopilot und Plandauer: 1 Animationszyklus = 1 Wiederholung; mit Timer phasengenau gekoppelt.
- „Als Nächstes“-Karte mit Piktogramm auf Übungs- und Pausen-Screens.
- **Alle Trainingsseiten teilen ein Gerüst** (`trScreen` in `js/app.js`, Konzept A): Kopf · Fortschritt · Kreis · Titel · Untertitel ·
  Karte 1 · Karte 2 · Hauptaktion (links Zurück, rechts Überspringen als Icon) · Als Nächstes – feste Höhen, nur der Inhalt wechselt. Neue Seitentypen nur über dieses Gerüst.
- Pause läuft immer von selbst: Karte 1 = −15 s / +15 s, Karte 2 = Gewicht für den nächsten Satz (`active.weightFor`), Hauptaktion „Pause beenden ›“
  nimmt den Platz von Überspringen mit ein (kein doppelter Knopf). „Satz erledigt“ speichert den Satz, Überspringen nicht.
- Abschluss steht im selben Raster (Sätze, Volumen bzw. Zeit unter Spannung, Merksatz).

## Backlog
- **App-Icon auswählen + Logo-Grafik verbessern** (Wunsch 2026-11-18, noch nicht gebaut):
  - Vier Icon-Entwürfe in `docs/icon-entwuerfe/` (A Creme·Salbei – eingebaut, B Creme·Waldgrün, C Salbei·Creme, D Waldgrün·Creme). Entscheidung offen.
  - Idee: Auswahl in den Einstellungen. Achtung: iOS liest das Home-Bildschirm-Icon nur beim „Zum Home-Bildschirm“ –
    eine Änderung wirkt erst nach Entfernen und erneutem Hinzufügen. Alternativ einfach die gewählte Variante fest einbauen.
  - Logo (`js/logo.js`) ist aus einer kleinen Vorlage vektorisiert; feine Fließlinien sind grob. Später durch die
    Original-Vektordatei bzw. eine bessere Grafik ersetzen (dann auch Icons neu erzeugen).
- **Zyklusphase als Plan-Parameter** (Wunsch 2026-11-18, noch nicht gebaut):
  - Im Trainingsplan eine Zyklusphase wählbar machen (Menstruation, Follikelphase, Eisprung, Lutealphase);
    daraus passen sich Intensität (Gewicht) und Wiederholungen automatisch an.
  - **Formel wird gemeinsam mit der Besitzerin erarbeitet – nicht selbst festlegen.** Bis dahin nur Konzept/Platzhalter.
  - Optional: Variation von Übungen je Phase (z. B. Alternativen mit weniger Belastung).
  - Überlegung: alle zyklusbasierten Funktionen in den Einstellungen gesammelt an-/abschaltbar
    (betrifft dann auch Zyklus-Stichworte bei Plan-Icons und Vorlagen).
  - Anknüpfungspunkte: Plan-Icons erkennen Phasen schon am Titel (`js/planicon.js`), Vorlagen Follikel/Luteal (`js/templates.js`).
    Microcopy vorsichtig formulieren (DESIGN.md §7, „Anpassung – nicht Verzicht“).
- **Export nach WHOOP Strength Trainer** (geprüft 2026-11-18, noch nicht gebaut):
  - WHOOP hat keine öffentliche Schreib-API (Developer-API v2 nur lesend). Inoffizielle private API (z. B. hevy2whoop) verstößt gegen die WHOOP-AGB → nicht nutzen.
  - Gangbarer Weg über Strava: Strava nimmt seit 21.05.2026 Kraft-Sätze an (`POST /api/v3/uploads`, `data_type=json`, Scope `activity:write`,
    Sätze mit `exercise_type`, `repetitions`, `weight` kg, `duration` s). WHOOP importiert Strava-Kraftaktivitäten inkl. Übungen.
  - Offen: Zuordnung unserer Übungen zu Stravas `exercise_type`-Kennungen; ob WHOOP daraus Muscular Load berechnet (Community berichtet gemischt);
    OAuth braucht das Client-Secret → eigener Strava-API-Zugang der Besitzerin oder kleiner Server-Proxy. Daten verlassen dann das Gerät.
  - Vorschlag: erst Machbarkeitstest mit einem echten Training (Upload-Skript), dann Einbau.
- **Apple Health Integration** statt oder ergänzend zu Strava/WHOOP (Wunsch 2026-11-19, noch nicht geprüft, noch nicht gebaut):
  - Trainings als Workout (Krafttraining, Dauer, ggf. Energie) in Apple Health schreiben; Daten bleiben auf dem Gerät, kein OAuth/Server nötig.
  - Hürde: HealthKit ist nur für native Apps zugänglich, nicht für eine PWA im Safari/Home-Bildschirm.
  - Mögliche Wege (zu prüfen): (a) Kurzbefehl (Shortcuts) mit Health-Aktion, aus der App per `shortcuts://run-shortcut?name=…&input=text&text=…`
    mit den Trainingsdaten aufgerufen; (b) native Hülle (z. B. Capacitor) mit HealthKit-Plugin – bricht mit „kein Build“ und GitHub Pages.
  - Zu klären: ob Strava bzw. WHOOP Trainings ohnehin nach Apple Health weiterreichen (dann reicht evtl. ein Weg);
    welche Felder Health für Krafttraining annimmt (einzelne Sätze/Übungen vermutlich nicht).
- **Native App für iPhone/Android in den App Stores** (Wunsch 2026-11-19, noch nicht gebaut; Weg für Apple Health, s. o.):
  - GitHub Pages bleibt die Lösung zum Teilen im privaten Umfeld; Store-Apps kommen ergänzend dazu.
  - Weg: Capacitor-Hülle um den bestehenden Code (ein Code für Web + Apps, Ordner `ios/` und `android/` neu im Repo).
    Genutzte Browser-Funktionen (localStorage, wakeLock, AudioContext, navigator.share) laufen dort weiter. Kein Neuschreiben in Swift/Kotlin.
  - Health: HealthKit-Plugin für Capacitor (iOS), Health Connect (Android).
  - Aufwand/Kosten: Xcode (Mac) bzw. Android Studio; Apple Developer 99 USD/Jahr, Google Play 25 USD einmalig;
    privates Testen über TestFlight bzw. internen Test-Track ohne öffentliche Veröffentlichung.
  - Zu beachten: Apple-Richtlinie 4.2 (keine reine Website-Hülle – Offline + HealthKit sprechen dagegen);
    Datenschutzerklärung und Store-Datenschutzangaben (Gesundheitsdaten, besonders Zyklusphase);
    Daten unter `kraftkatalog.v1` liegen im Safari-Speicher der PWA → einmaliger Export/Import (z. B. Datei über Teilen) nötig;
    Store-Versionen müssen gebaut und hochgeladen werden, `git push` reicht dafür nicht.
  - Vorschlag: Machbarkeitstest (ca. 1–2 Tage) – Capacitor einrichten, auf dem eigenen iPhone starten, ein Training in Apple Health schreiben.
