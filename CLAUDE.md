# flow.training

Statische PWA (Vanilla JS, kein Build), primär fürs iPhone, gehostet auf GitHub Pages
(`cyberbomme/flow-training` → https://cyberbomme.github.io/flow-training/). Details zur Struktur: `README.md`.

## Design
**Aussehen, Komponenten und Texte richten sich nach [`docs/DESIGN.md`](docs/DESIGN.md).** Kurz:
- Tokens als CSS-Variablen in `app.css` (`--color-*`). Dunkelmodus ist daraus abgeleitet (gleiche Farbfamilien),
  Umschaltung Hell/Dunkel/System über `data-theme` auf `<html>`.
- Zweites Design „Klassisch“ (ursprüngliches orange Design) über `data-design="classic"`: setzt nur dieselben Tokens neu.
  Komponenten-CSS nutzt ausschließlich Tokens, damit beide Designs funktionieren. Wahl unter *Einstellungen*.
- Schriften lokal in `fonts/` (Oswald = Display/Zahlen, Gilda Display = Emotion, Montserrat = Body). Keine Google-CDN-Einbindung.
- Text in Salbei/Rosé nur dekorativ oder als große Headline; Buttons/Links in `forest`. Fehler/Löschen in `--color-rose-ink`.
- Offene Punkte aus DESIGN.md §11 sind als `TODO(Design)` im Code markiert (Brand-Farben, Logo-SVG, Fotos, Schriftlizenz).
- Microcopy: Du-Ansprache, ruhig, bestärkend; bei Gesundheit vorsichtig formulieren. Keine Emojis in UI-Elementen.
- Motivationstexte zentral in `js/texts.js` (Leitsätze der Marke unverändert in `BRAND`). Längengrenzen je Platz stehen dort; je Training gemischt, ohne Wiederholung.

## Arbeitsweise
- Neue Übungen in `js/exercises.js`; Figuren danach per Playwright-Screenshot prüfen (`~/pw-venv`).
  Muskelgruppen (Filter, Plan-Icons) werden automatisch aus `muscles` abgeleitet (`MUSCLE_GROUPS`) – Begriffe dort ggf. ergänzen.
- Plan-Icons automatisch (`js/planicon.js`): erst Stichwort im Titel (Zyklusphasen, HIIT, Mobilität, Regeneration, Klettern,
  Core, Beine, Oberkörper, Ganzkörper, Kraft), sonst aus Muskelgruppen/Zeitanteil der Übungen.
- Version steht nur in `js/version.js` (Anzeige in *Einstellungen*, Cache-Name im Service Worker). Bei jedem Deploy hochzählen.
- Bei neuen Dateien `sw.js` → `SHELL` ergänzen. SW-Strategie: Netz zuerst (3 s), sonst Cache; neue Version lädt die App sofort neu.
- localStorage-Schlüssel `kraftkatalog.v1` nicht umbenennen (bestehende Daten auf dem iPhone).

## Pläne & Supersets
- Beispielpläne als Vorlagen in `js/templates.js` (Kurzform ex/ss/rest). „Übernehmen“ kopiert mit neuen IDs, Herkunft in `plan.tpl`.
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
  Karte 1 · Karte 2 · Hauptaktion · Als Nächstes · Navigation – feste Höhen, nur der Inhalt wechselt. Neue Seitentypen nur über dieses Gerüst.
- Pause läuft immer von selbst: Karte 1 = −15 s / +15 s, Karte 2 = Gewicht für den nächsten Satz (`active.weightFor`), Hauptaktion „Pause beenden“.
- Abschluss steht im selben Raster (Sätze, Volumen bzw. Zeit unter Spannung, Merksatz).

## Backlog
- **Export nach WHOOP Strength Trainer** (geprüft 2026-11-18, noch nicht gebaut):
  - WHOOP hat keine öffentliche Schreib-API (Developer-API v2 nur lesend). Inoffizielle private API (z. B. hevy2whoop) verstößt gegen die WHOOP-AGB → nicht nutzen.
  - Gangbarer Weg über Strava: Strava nimmt seit 21.05.2026 Kraft-Sätze an (`POST /api/v3/uploads`, `data_type=json`, Scope `activity:write`,
    Sätze mit `exercise_type`, `repetitions`, `weight` kg, `duration` s). WHOOP importiert Strava-Kraftaktivitäten inkl. Übungen.
  - Offen: Zuordnung unserer Übungen zu Stravas `exercise_type`-Kennungen; ob WHOOP daraus Muscular Load berechnet (Community berichtet gemischt);
    OAuth braucht das Client-Secret → eigener Strava-API-Zugang der Besitzerin oder kleiner Server-Proxy. Daten verlassen dann das Gerät.
  - Vorschlag: erst Machbarkeitstest mit einem echten Training (Upload-Skript), dann Einbau.
