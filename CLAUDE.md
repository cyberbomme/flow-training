# flow.training

Statische PWA (Vanilla JS, kein Build), primär fürs iPhone, gehostet auf GitHub Pages
(`cyberbomme/kraftkatalog` → https://cyberbomme.github.io/kraftkatalog/). Details zur Struktur: `README.md`.

## Design
**Aussehen, Komponenten und Texte richten sich nach [`docs/DESIGN.md`](docs/DESIGN.md).** Kurz:
- Tokens als CSS-Variablen in `app.css` (`--color-*`). Dunkelmodus ist daraus abgeleitet (gleiche Farbfamilien),
  Umschaltung Hell/Dunkel/System über `data-theme` auf `<html>`.
- Schriften lokal in `fonts/` (Oswald = Display/Zahlen, Gilda Display = Emotion, Montserrat = Body). Keine Google-CDN-Einbindung.
- Text in Salbei/Rosé nur dekorativ oder als große Headline; Buttons/Links in `forest`. Fehler/Löschen in `--color-rose-ink`.
- Offene Punkte aus DESIGN.md §11 sind als `TODO(Design)` im Code markiert (Brand-Farben, Logo-SVG, Fotos, Schriftlizenz).
- Microcopy: Du-Ansprache, ruhig, bestärkend; bei Gesundheit vorsichtig formulieren. Keine Emojis in UI-Elementen.

## Arbeitsweise
- Neue Übungen in `js/exercises.js`; Figuren danach per Playwright-Screenshot prüfen (`~/pw-venv`).
- Bei neuen Dateien `sw.js` → `SHELL` ergänzen und `CACHE` hochzählen.
- localStorage-Schlüssel `kraftkatalog.v1` nicht umbenennen (bestehende Daten auf dem iPhone).

## Backlog
- Supersets (mehrere Übungen abwechselnd im Satz-Wechsel, gemeinsame Pause danach)
