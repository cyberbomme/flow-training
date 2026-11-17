# Design-Übergabe: App „flow.training“

> **An die Claude-Code-Instanz:** Dieses Dokument beschreibt das visuelle System und den Ton der App.
> Es ist aus dem bestehenden Canva-/Instagram-Auftritt von **Jazzmin Flow Training** (Jasmin Koppitz, Karlsruhe) abgeleitet.
> Bitte lege es im Repo als `docs/DESIGN.md` ab und verweise in `CLAUDE.md` darauf.
> Die Funktionslogik (Übungsauswahl, Trainingsplanung usw.) bleibt so, wie sie schon gebaut wird. Dieses Dokument betrifft **Aussehen, Komponenten und Texte**.
> Es ist stack-neutral formuliert. Die Tokens bitte in der Form umsetzen, die im Projekt schon genutzt wird (CSS-Variablen, Tailwind-Theme, Theme-Objekt …).

---

## 1. Markenkern

- **App-Name:** `flow.training`, immer klein geschrieben, mit Punkt. Er leitet sich vom Instagram-Handle `jazzmin.flow.training` ab.
- **Worum es geht:** zyklusbasiertes Training für Frauen. Dazu gehören Krafttraining, Frauengesundheit und Hormone (Östrogen, Progesteron, Cortisol), Bewegung im Alltag, Regeneration und Klettern/Outdoor.
- **Zielgruppe:** sportlich aktive Frauen („starke Frauen“).
- **Haltung:** ruhig, natürlich, bestärkend. Kein greller Fitness-Look, keine Neonfarben, kein aggressives Gamification-Design.
- **Signatur-Sätze**, die als Leer-, Erfolgs- oder Onboarding-Texte dienen können:
  - „Dein Zyklus. Deine Stärke.“
  - „Trainiere mit deinem Körper, nicht gegen ihn.“
  - „Anpassung – nicht Verzicht.“
  - „Kraft ist mehr als Optik.“
  - „Regeneration ist kein Trainingsausfall. Sie ist Teil des Trainings.“

## 2. Farb-Tokens

Die Werte sind aus den Canva-Vorschauen geschätzt. Exakte Brand-Kit-Werte gibt es noch nicht, deshalb zentral als Tokens anlegen, damit sie sich später an einer Stelle austauschen lassen.

| Token | Hex | Verwendung |
|---|---|---|
| `--color-bg` | `#F3F0EB` | App-Hintergrund (Creme/Off-White) |
| `--color-surface` | `#FFFFFF` | Karten, Sheets, Modals (alternativ `#FAF8F5`) |
| `--color-sage` | `#9DAA96` | Primärfarbe: Flächen, Pills, aktive Zustände, Linien |
| `--color-sage-light` | `#C9D3C2` | Info-Boxen, Icon-Kreise, ausgewählte Chips |
| `--color-rose` | `#D4A19C` | Akzentflächen, Deko, zweite Icon-Kreis-Variante |
| `--color-rose-dark` | `#C48A85` | Akzentwort in **großen** Headlines |
| `--color-peach` | `#F1DCD4` | CTA- und Hervorhebungsflächen |
| `--color-forest` | `#3F6B5C` | Logo, Icons, **Primär-Buttons, Links, interaktiver Text** |
| `--color-text` | `#1F1F1F` | Fließtext, Headlines |
| `--color-text-muted` | `#5A5450` | Sekundärtext (Taupe) |
| `--color-overlay` | `rgba(90,84,80,0.5)` | Overlay auf Fotos (40–60 %) |

### ⚠️ Kontrast (wichtig)
Salbei und Rosé sind auf Creme **zu hell für normalen Text**. Grob gerechnet liegt das Kontrastverhältnis bei etwa 2:1 bis 2,5:1, gefordert sind ≥ 4,5:1.
- Text in `sage` oder `rose-dark` nur für **große Display-Headlines** (≥ 24 px fett) oder rein dekorativ einsetzen.
- **Primär-Buttons:** Hintergrund `forest` mit weißer Schrift (ca. 5:1).
- **Salbei- und Rosé-Flächen** (Pills, Boxen) bekommen dunkle Schrift (`text` oder `forest`), keine weiße.
- Fokus-Ring: `forest`, 2 px.
- Bitte alle Kombinationen mit einem Kontrast-Check absichern (WCAG AA).

### Zyklusphasen-Farben
Diese Zuordnung kommt aus den Hormonkurven-Grafiken im Bestand:
- Follikelphase / Östrogen → `sage` / `forest` (Grün)
- Lutealphase / Progesteron → `rose` (Rosé)
- Menstruation und Ovulation, falls sie gebraucht werden: Abstufungen davon (z. B. `rose-dark`, `sage-light`). Bitte **keine** neuen Farbfamilien einführen.

## 3. Typografie

Die Schriften wurden optisch bestimmt. Es sind frei verfügbare Google Fonts, die dem Bestand am nächsten kommen.

| Rolle | Font | Einsatz |
|---|---|---|
| **Display Grotesk** | Oswald (Alternative: Bebas Neue), 500–700, VERSALIEN, leicht gesperrt | Screen-Titel, Übungsnamen in Headern, große Zahlen (Sätze/Wdh.) |
| **Display Serif** | Gilda Display (Alternative: Playfair Display) | Emotionale Headlines: Onboarding, Fazit/Erfolg, Phasen-Titel („Lutealphase“), Zitate |
| **Body** | Montserrat, 400/500/600 | Fließtext, Labels, Buttons, Listen |
| **Script (sparsam)** | Caveat o. ä. | Höchstens 1× pro Screen als persönliche Note (z. B. „Guten Morgen“, Signatur „Deine Jasmin“). Nie für Informationen. |

- Mindestgröße für Body-Text: 16 px. Zeilenhöhe 1,5.
- Ein Muster aus dem Bestand: Die Headline steht schwarz, ein **Schlüsselwort** darin rosé in einer eigenen Zeile (z. B. „STRESS ALS“ / **„ZYKLUSKILLER?“**).
- Overlines bzw. Dachzeilen: kleine, weit gesperrte Versalien in `sage`. Das ist dekorativ, deshalb ≥ 14 px und fett, oder in `forest` setzen.

## 4. Form & Raum

- **Radien:** Karten 20 px, Info-Boxen 24 px (stark abgerundet), Pills und Buttons voll rund (`999px`), Icon-Kreise rund.
- **Schatten:** kaum oder gar keine. Flächen grenzen sich über Farbe ab (Creme gegen Weiß gegen Salbei-hell). Wenn ein Schatten nötig ist, dann sehr weich: `0 2px 12px rgba(31,31,31,0.06)`.
- **Linien:** feine 1-px-Trennlinien in `sage` oder `text` mit 15 % Deckkraft. Typisches Muster ist eine dünne Linie über die ganze Breite unter dem Header.
- **Abstände:** großzügig, auf einem 8-px-Raster. Lieber mehr Weißraum als mehr Inhalt pro Screen.
- **Icons:** feine **Line-Icons** mit 1,5 px Strich (z. B. Lucide oder Phosphor „light“) in `forest`, meist **in einem gefüllten Kreis** in `sage-light` oder `rose`.
- **Deko:** florale Line-Art-Blätter in Rosé, sparsam auf Leer-, Onboarding- und Erfolgs-Screens. In Arbeitsansichten wie Listen oder Editoren keine Deko.

## 5. Komponenten (aus dem Canva-Layout übersetzt)

| Komponente | Vorbild im Bestand | Beschreibung |
|---|---|---|
| **AppHeader** | Innenseiten-Kopf | Creme, Titel links oder zentriert, Logo/Signet klein **rechts oben**, darunter eine dünne Linie über die volle Breite |
| **IconListItem** | Icon-Liste (Ref. I05/I06) | Icon im Kreis (40–48 px, `sage-light` oder `rose`) links, rechts Titel (Montserrat 600) und eine Zeile Beschreibung. Ideal für Übungslisten und Ausrüstung |
| **IconGrid** | Icon-Raster 3+2 (I01) | Kategorien und Muskelgruppen als Kachelraster mit Icon im Kreis und Label darunter |
| **PillLabel** | „IN DIESER PHASE SETZE ICH AUF:“ (I11) | Salbei-Pill, Versalien, dunkle Schrift. Als Abschnitts-Label, Filter-Chip oder Phasen-Badge |
| **InfoBox** | Merke/Tipp-Box | `sage-light`, Radius 24, Icon „!“ (Hinweis) oder Glühbirne (Tipp), kurzer Text. Für Ausführungshinweise und Phasen-Tipps |
| **CheckList** | Checkliste (I10/I12) | Häkchen-Icons in `sage`, für Trainingsziele und das Abhaken erledigter Sätze |
| **CompareTable** | Vergleich 2 Spalten (I13) | Für Gegenüberstellungen (Phase A/B, vorher/nachher) |
| **PhaseCycle** | Kreislauf-Grafik (I09) | Zykluskreis mit Follikel- (grün) und Lutealphase (rosé) und Markierung des aktuellen Tags |
| **HormoneCurve** | Hormonkurven-Cover (C04) | Dünne Linien in Grün (Östrogen) und Rosé (Progesteron), dezent als Hintergrund-Deko oder Mini-Chart |
| **PhotoHero** | Cover (C01) | Randloses Foto mit weichem Taupe-Verlauf von links oder unten, weiße Display-Headline, Serif-Unterzeile, „mehr ›››“ |
| **PhotoFade** | Foto läuft in Creme aus (I06, A01) | Bild unten oder seitlich mit Verlauf nach `bg`, z. B. für die Übungsdetail-Ansicht |
| **CTAPill** | „Teile diesen Beitrag …“ | Runder Button mit Icon. Primär: `forest` mit weißer Schrift. Sekundär: `peach` oder `sage-light` mit dunkler Schrift |
| **QuoteCard** | Merksatz-Slide (F02) | Serif-Merksatz zentriert, z. B. auf dem Abschluss-Screen eines Trainings |

Das Zeichen „›››“ (drei Chevrons) ist ein Wiedererkennungsmerkmal. Es eignet sich für „mehr“-Links und Weiter-Hinweise.

## 6. Screen-Ideen (Mapping auf die Instagram-Dramaturgie)

Die Karussells folgen dem Bogen **Cover → Einordnung → Praxis → Merksatz → Fazit/CTA**. Übertragen auf die App:

- **Home / Heute:** PhotoHero oder ruhige Karte mit der aktuellen Zyklusphase (PhaseCycle klein), PillLabel „HEUTE SETZE ICH AUF:“, dazu 1–3 empfohlene Einheiten als Karten.
- **Übungsbibliothek / Auswahl:** IconGrid für Kategorien (z. B. Kraft, Mobilität, Klettern/Fingerkraft, Core, Regeneration), darunter IconListItem-Listen. Filter als Pills, die Phasen-Eignung als kleines Badge.
- **Übungsdetail:** PhotoFade mit Foto oder Video oben, Display-Titel, InfoBox mit Ausführungshinweis, CheckList „Worauf ich achte“.
- **Trainings-Editor:** ruhige weiße Karten auf Creme, Drag-Handles dezent, große Zahlen für Sätze/Wiederholungen in Oswald.
- **Trainings-Abschluss:** QuoteCard mit Merksatz, kurze Zusammenfassung, CTAPill („Speichern“, „Teilen“).
- **Leere Zustände:** Line-Art-Blatt in Rosé plus Signatur-Satz plus ein klarer CTA.

## 7. Tonalität & Microcopy (Deutsch)

- **Du-Ansprache**, warm, bestärkend, auf Augenhöhe. Bei Empfehlungen gern in der Ich-Perspektive von Jasmin („So trainiere ich in dieser Phase …“).
- **Vorsichtig formuliert** bei Gesundheitsthemen: „kann“, „oft“, „hör auf deinen Körper“, „individuell verschieden“. Keine Heilversprechen und keine medizinischen Aussagen als Fakten.
- Kurze Sätze. Headlines als Schlagworte in Versalien.
- Emojis sparsam und warm: 🤎 💪🏼 💚. In UI-Elementen am besten gar nicht, höchstens in Erfolgsmeldungen.
- Beispiele:
  - Leer: „Noch kein Training geplant. Starte mit deinem Körper, nicht gegen ihn.“
  - Erfolg: „Stark gemacht! 💚 Regeneration ist Teil des Trainings.“
  - Phasen-Hinweis: „In der Lutealphase kann sich dieselbe Last schwerer anfühlen. Das ist normal. Anpassung – nicht Verzicht.“

## 8. Bildsprache

- Eigene, authentische Fotos: Klettern, Bouldern, Gym, Laufen, Natur. Natürliches Licht, warme und erdige Töne, leicht entsättigt.
- **Keine** generischen Stock-Fitnessmodels und keine Hochglanz-Studio-Optik.
- Bis echte Fotos da sind: neutrale Platzhalter in `sage-light` oder `rose` mit Line-Icon, kein Stock.
- Bilder bekommen bei Text-Überlagerung immer ein Overlay oder einen Verlauf in `color-overlay`.

## 9. Logo

- Fein gezeichnetes **Line-Art-Signet**: eine meditierende Figur über einer geschwungenen, fließenden Form. Als Datei liegt es hier **noch nicht vor**.
- Bis dahin einen Platzhalter-Slot (`<Logo />`) vorsehen, der Farbvarianten unterstützt: `rose`, `forest`, `white`.
- Platzierung wie im Bestand: im Header oben rechts. Auf Hero- und Splash-Screens unten rechts.
- Den Wortmarken-Schriftzug „flow.training“ vorerst in Gilda Display oder Montserrat Light, klein geschrieben.

## 10. Do / Don't

**Do**
- Creme als Grundton, viel Weißraum, feine Linien
- Icons immer im Kreis und im selben Strichstil
- Pro Screen eine klare Hauptaktion
- Serif für Emotion, Grotesk für Struktur und Zahlen, Sans für Inhalt

**Don't**
- Keine reinweißen Vollflächen als App-Hintergrund und kein reines Schwarz (`#000`)
- Keine kräftigen Primärfarben (Blau, Rot, Neon), auch nicht für Fehler. Fehler lieber in `rose-dark` mit Icon und Text darstellen und auf ausreichenden Kontrast prüfen
- Keine harten Schatten und keine eckigen Karten
- Weiße Schrift nicht auf Salbei- oder Rosé-Flächen setzen (Kontrast)
- Script-Schrift nicht für Informationen verwenden

## 11. Offene Punkte (bitte nicht raten, sondern als TODO markieren)

- Exakte Brand-Farben aus dem Canva Brand Kit stehen noch aus, die Werte oben sind Schätzungen
- Logo als SVG fehlt noch
- Echte Fotos und Übungsmedien fehlen noch
- Lizenz bzw. Auswahl der finalen Schriften: Die Google Fonts oben sind Näherungen
