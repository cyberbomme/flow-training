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
- Übungstexte (Wunsch 2026-11-19): `how` = „So geht’s“, vollständiger Ablauf inkl. Zählweise/Seitenwechsel; `cues` = „Worauf ich achte“, nur Stil, Technik,
  Varianten (optional, ohne Inhalt fällt der Bereich weg). Text und Animation müssen zusammenpassen.
- Neue Übungen in `js/exercises.js`; Figuren danach per Playwright-Screenshot prüfen (`~/pw-venv`).
  Muskelgruppen (Filter, Plan-Icons) werden automatisch aus `muscles` abgeleitet (`MUSCLE_GROUPS`) – Begriffe dort ggf. ergänzen.
  `side: true` = Wiederholungen je Seite: Anzeige „Wdh. je Seite“, Autopilot und Plandauer zählen doppelt (`sidesOf`).
  Zeit-Übung mit `side: true` (Seitstütz): zwei Schritte im Training (rechts, links) mit 5 s „Seite wechseln“, ein Satz im Verlauf (Dauer je Seite).
  Fehlende Gelenkwinkel in einer Pose = Glied hängt senkrecht (Vorgabe in `figure.js`). Zwischenposen über Gelenkwinkel, nicht Punkte (`inbetween`),
  damit Glieder ihre Länge behalten; `front: true` = Frontalansicht (Arme zur Seite, kürzester Weg).
  Mehr als zwei Posen: `seq` = Reihenfolge je Wiederholung (danach zurück zur ersten), `via: true` = ohne Halt durchlaufen, `key` = Pose fürs Standbild,
  `alt: true` = jede zweite Wiederholung mit der anderen Seite, `flat: true` = Bewegung auf den Betrachter zu (Glied darf kürzer wirken), `fd` = Fußrichtung.
  Dehnungen bleiben bei zwei Posen (Training hält bei Phase 0,5). Prüfseite: `docs/figuren-review.html` (nicht im Offline-Cache).
- Plan-Icons automatisch (`js/planicon.js`): erst Stichwort im Titel (Zyklusphasen, HIIT, Mobilität, Regeneration, Klettern,
  Core, Beine, Oberkörper, Ganzkörper, Kraft), sonst aus Muskelgruppen/Zeitanteil der Übungen.
- Version steht nur in `js/version.js` (Anzeige in *Einstellungen*, Cache-Name im Service Worker). Bei jedem Deploy hochzählen.
- Bei neuen Dateien `sw.js` → `SHELL` ergänzen. SW-Strategie: Netz zuerst (3 s), sonst Cache; neue Version lädt die App sofort neu.
- localStorage-Schlüssel `kraftkatalog.v1` nicht umbenennen (bestehende Daten auf dem iPhone).
- Neues Feld in `defaults()` (`js/store.js`) auch in `FIELDS` eintragen, sonst übernimmt der Import es nicht.

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

## Dehnen (Wunsch 2026-11-22)
- Dehnübungen stehen in `js/exercises.js` mit `kind: 'stretch'`, `pos` (stand → knie → bauch → sitz → ruecken, für eine ruhige Reihenfolge)
  und `t` (Zielmuskeln mit Gewicht; Schlüssel in `STRETCH_TARGETS`, abgeleitet aus `muscles` der Kraftübungen). Immer gehalten (`mode: 'time'`),
  `side: true` = je Seite (zwei Schritte im Training: rechts, links). `from` = Ausgangspose (Abweichung von der Dehnpose) → Animation
  Ausgang → Dehnung (6 s je Zyklus); im Training bewegt sich die Figur während „Einnehmen“ hinein und hält dann. `dynamic: true` (Katze-Kuh) wechselt weiter.
  Alle Dehnungen mit Animation: `docs/dehnen-demo.html` (nicht im Offline-Cache).
- Bezeichnung: **Kraft · Dehnen** (Katalog-Umschalter `db.catKind`, Planfilter Alle · Kraft · Dehnen in `db.planFilter`).
- Pläne sind entweder Kraft- oder Dehnpläne (`plan.kind === 'stretch'`), nie gemischt. Farbe trägt die Art: **Rosé = Dehnen, Salbei = Kraft**
  (auch Zyklus-Pläne sind Salbei). Dehnpläne: keine Supersets, keine Pausen; Regler Haltezeit + Durchgänge. „+“ fragt bei Filter „Alle“ nach der Art.
- Nach einem Krafttraining: automatischer Dehnplan (`js/stretch.js`, `pickStretches`) – wird nicht gespeichert und erscheint nicht in der Planliste.
  Zusammensetzung: **Standard-Set** (Rückenstrecker, Hüftlendenmuskel, Brustmuskel, Oberschenkel hinten, Zwillingswadenmuskel – `STANDARD_SET`),
  je Bereich wechselt die Übung von Training zu Training (`db.stretchRot`, zählt beim Start des Dehnens weiter); dann **gezielte** Dehnungen
  zu den trainierten Übungen. Beides zusammen = Umfang (Kurz 5 / Normal 7 / Ausführlich 10), das Standard-Set hat Vorrang, keine zwei Übungen desselben Bereichs.
  Einstellungen: an/aus (`db.stretchOffer`), Haltezeit 20–60 s (`db.stretchHold`), Umfang (`db.stretchSize`).
- Angebot nach dem Training (Variante A, entschieden 2026-11-22): nach „Speichern“ Rückfrage „Passende Dehnungen zum Abschluss?“
  mit gezielten/Standard-Dehnungen, Umfang, „Dehnen starten“ und „Überspringen“.
- Dehn-Training (`active.stretch`): jede Dehnung mit 5 s Vorlauf „Einnehmen“, startet von selbst. Karte 2 = Haltezeit ±5 s, Hauptaktion „Weiter“ breit
  (kein Überspringen-Knopf, es wird ohnehin nichts gespeichert). × beendet sofort. **Kein Verlauf**, Abschluss „Fertig“ führt zurück zum Krafttraining im Verlauf.

## Training-Ablauf
- Zeit-Übungen starten nach einer Pause automatisch. Bildaufbau Wiederholung/Zeit identisch (Ring im Figur-Kreis, Regler-Karte).
- Autopilot (Einstellung): auch Wiederholungen zählen herunter (Tempo × Wdh.) und schalten automatisch weiter.
  Tempo-Schätzungen in `TEMPO` (`js/exercises.js`), eigene Werte in `db.tempo` (1–8 s); Vorlauf `db.setup` nur vor Sätzen ohne Pause davor.
  Tempo stellt man **bei der Übung** ein (Übungen › Übung › Tempo, `tempoField`), nicht in den Einstellungen (Wunsch 2026-11-22);
  *Einstellungen › Vorlauf für den Autopilot* enthält nur noch den Vorlauf und „Alle auf Schätzung zurücksetzen“.
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
- **Apple Health Integration** statt oder ergänzend zu Strava/WHOOP (Wunsch 2026-11-19, noch nicht gebaut):
  - Trainings als Workout (Krafttraining, Start, Ende) in Apple Health schreiben; Daten bleiben auf dem Gerät, kein OAuth/Server nötig.
  - HealthKit ist nur für native Apps zugänglich, nicht für die PWA. Weg (2026-11-24): als Teil der nativen App, s. u.
    Alternative ohne App bliebe ein Kurzbefehl (`shortcuts://run-shortcut?name=…&input=text&text=…`), ungeprüft.
  - Zu klären: ob Strava bzw. WHOOP Trainings ohnehin nach Apple Health weiterreichen (dann reicht evtl. ein Weg).
- **Native App für iPhone, danach Android** (Wunsch 2026-11-19, Konzept vom Besitzer bestätigt 2026-11-24, noch nicht gebaut):
  - **Prinzip:** Capacitor-Hülle, kein Neuschreiben in Swift/Kotlin. Eine Codebasis für Web, iOS und Android, gemeinsam weiterentwickelt.
    Die Web-App auf GitHub Pages bleibt (Teilen im privaten Umfeld) und verhält sich gleich. Entwicklung auf Branch `ios-app`.
  - **Getrennt bleiben:** Veröffentlichung (Web: `git push`; Apps: `www/` befüllen, `npx cap sync`, Build, Upload) und Daten
    (kein Abgleich zwischen Web und App; pro Person dauerhaft nur eine Variante, Import ersetzt den Stand).
  - **Aufbau:** Plattformunterschiede gebündelt in `js/platform.js`, nach Funktionen (speichern, teilen, Pausenende melden, wach halten,
    Workout schreiben), keine verstreuten „ist iOS?“-Abfragen. Neue Datei auch in `sw.js` → `SHELL`.
    `www/` (Skript kopiert `index.html`, `app.css`, `js/`, `fonts/`, `icons/`) und `node_modules/` in `.gitignore`.
    Zu prüfen: Capacitor-Plugins ohne Bundler einbinden, damit die Web-App ohne Build bleibt.
  - **Schritte iOS** (Aufwand geschätzt):
    1. Mac einrichten (½ Tag): Xcode ≥ 26, Node ≥ 22 (beides fehlt am 2026-11-24). CocoaPods nicht nötig (Capacitor 8 nutzt SPM).
    2. Hülle anlegen (½ Tag): `@capacitor/core`, `@capacitor/ios`, `@capacitor/cli`; `npx cap init … --web-dir www`, `npx cap add ios`; auf dem iPhone starten.
    3. Code anpassen (1–2 Tage), für zuverlässigen Betrieb nötig, nicht für den ersten Start:
       Daten in native Datei statt `localStorage` (iOS kann es bei Platzmangel löschen), vor dem Start laden, Web unverändert ·
       Service Worker und „Nach Update suchen“ in der App abschalten (die Prüfung auf `localhost` in `js/app.js`
       trifft auch in Capacitor zu) · lokale Mitteilung zum Pausenende (bei gesperrtem Display kein Ton), bei Pause/Überspringen löschen ·
       Export per Teilen testen, sonst Share-Plugin. Auf dem Gerät prüfen: Ton (stumm, neben Musik), Wachhalten, Safe Areas, Tastatur, Zurück-Wischen.
    4. Apple Health (1–2 Tage): eigenes kleines Swift-Plugin mit `HKWorkoutBuilder`; `@capgo/capacitor-health` 8.13.0 kann Workouts
       laut README nur lesen. HealthKit-Capability, Berechtigungstext, Schalter in den Einstellungen (Standard: aus). Einzelne Sätze bleiben in der App.
    5. Daten umziehen: PWA exportieren, in der App importieren, vergleichen, **erst danach** die PWA löschen (kein Zugriff auf ihren Speicher).
    6. TestFlight (½ Tag): interne Tester ohne Review, Builds laufen nach 90 Tagen ab. Icon 1024 px ohne Transparenz.
    7. App Store (optional, 1–2 Tage + Review): Datenschutzerklärung und -angaben (Gesundheitsdaten, besonders Zyklusphase), Privacy Manifest,
       Support-URL, Screenshots; Richtlinie 4.2 (keine reine Website-Hülle); Schriftlizenz (DESIGN.md §11) klären.
  - **Android nach iOS** (2–4 Tage; Angaben nicht neu recherchiert, vor dem Start prüfen): `@capacitor/android`, `npx cap add android`, Android Studio, Testgerät.
    Share-Plugin Pflicht (`navigator.share` und Blob-Download gehen in der WebView nicht); Zurück-Taste/-Geste (Sheets schließen, Training nicht
    versehentlich beenden); Mitteilungs-Berechtigung und exakte Alarme; Health Connect über eigenes Kotlin-Plugin; prüfen: Wachhalten, Ton, Ränder, ältere WebViews.
    Google Play: interner Test bis 100 Personen; öffentlich bei neuen Privatkonten vorher geschlossener Test (12 Personen, 14 Tage) und Health-Erklärung.
  - **Schon bei iOS beachten:** App-ID auf beiden Plattformen gültig (nur Kleinbuchstaben, Ziffern, Punkte, keine Bindestriche; nach dem ersten
    Upload fest); Capacitor-Plugins wählen, die beide Plattformen abdecken; Health-Plugin mit gleichem JavaScript-Aufruf (darunter Swift bzw. Kotlin).
  - **Kosten:** Apple Developer 99 USD/Jahr (ab TestFlight), Google Play 25 USD einmalig.
  - **Offen:** Reicht TestFlight oder App Store (Vorschlag: mit TestFlight anfangen)? Apple-Konto auf Besitzer oder Besitzerin der Marke
    (Name erscheint im Store als Anbieter)? App-ID?
  - **Nächster Schritt:** Machbarkeitstest (ca. 1–2 Tage): Schritte 1 und 2 plus ein Test-Workout in Apple Health.
