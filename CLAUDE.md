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

## Arbeitsweise
- Neue Übungen in `js/exercises.js`; Figuren danach per Playwright-Screenshot prüfen (`~/pw-venv`).
- Version steht nur in `js/version.js` (Anzeige in *Einstellungen*, Cache-Name im Service Worker). Bei jedem Deploy hochzählen.
- Bei neuen Dateien `sw.js` → `SHELL` ergänzen.
- localStorage-Schlüssel `kraftkatalog.v1` nicht umbenennen (bestehende Daten auf dem iPhone).

## Pläne & Supersets
- Plan-Items: `ex` | `rest` | `group` (Superset: `rounds`, `rest` nach jeder Runde, `items` = Übungen). Logik in `js/planedit.js`.
- Superset-Regeln (vom Besitzer festgelegt): keine Pause zwischen den Übungen, beliebig viele Übungen, eine Rundenzahl für alle.
- Plan-Editor: Optik „Zeilen“ (Konzept A), Aufbau „Aufklappen“ (Konzept C). Griff ziehen = sortieren,
  auf Übung ziehen + 450 ms halten = Superset. Alle Zeilen gleich aufgebaut, Regler = Stepper aus dem Training.

## Training-Ablauf
- Zeit-Übungen starten nach einer Pause automatisch. Bildaufbau Wiederholung/Zeit identisch (Ring im Figur-Kreis, Regler-Karte).
- Autopilot (Einstellung): auch Wiederholungen zählen herunter (Tempo × Wdh.) und schalten automatisch weiter.
  Tempo-Schätzungen in `TEMPO` (`js/exercises.js`), eigene Werte in `db.tempo`; Vorlauf `db.setup` nur vor Sätzen ohne Pause davor.
- „Als Nächstes“-Karte mit Piktogramm auf Übungs- und Pausen-Screens.
