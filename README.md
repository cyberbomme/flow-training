# Kraftkatalog

Statische Web-App (PWA) für iPhone: Katalog an Kraftübungen mit schematischen Figuren,
Trainingspläne mit Timer und Ton, Verlauf mit Fortschrittsdiagramm. Kein Build-Schritt.

- Daten liegen nur lokal im Browser (`localStorage`, Schlüssel `kraftkatalog.v1`). Export/Import unter *Verlauf*.
- Auf dem iPhone über Safari → Teilen → **Zum Home-Bildschirm** installieren (dann kein Löschen der Daten nach 7 Tagen Inaktivität, Vollbild, offline).

## Struktur
- `js/exercises.js` – Übungskatalog + Gerätedefinition. Neue Übung = neuer Eintrag.
- `js/figure.js` – Strichfiguren: Posen aus Gelenkwinkeln (0° = oben, 90° = vorn) oder IK-Zielen für Hände `w` / Füße `a`.
- `js/app.js` – Ansichten, Router (`#/…`), Training, Verlauf, Diagramm.
- `js/timer.js` – zeitstempelbasierter Timer, WebAudio-Töne.
- `sw.js` – Offline-Cache (stale-while-revalidate). Bei neuen Dateien in `SHELL` eintragen.

## Lokal starten
    python3 -m http.server 8000   # → http://localhost:8000
