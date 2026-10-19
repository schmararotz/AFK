# AFK — Amt für kontrollierten Kontrollverlust

`index.html` im Browser öffnen, oder mit `npm.cmd start` einen lokalen Server starten und http://localhost:3000 öffnen. Keine Installation nötig, für den Server wird Node.js benötigt.

## Musik

Song unter `music/track.mp3` ablegen oder im Player auswählen. „ESKALATION BEANTRAGEN“ aktiviert die andere Farbwelt, löst den ersten Antrag aus und startet die Musik. Kein Autoplay beim Öffnen.

Oben in `app.js` steht `const SONG_RESTART_AT_SECONDS = 50;`. Die Musik beginnt nach ungefähr 50 Sekunden wieder bei 0. Für einen kompletten Durchlauf den Wert auf `null` setzen.

## Bedienung

- Maus: Der Beamtenvogel verfolgt dich mit den Augen; die Figur reagiert auf deine Position.
- Vogel: bürokratische Weisheiten und Papierregen.
- Kaffee: die Koffeinversorgung der Verwaltung.
- Formular: Begründung und Intensität auswählen.
- Abstempeln / Leertaste: Antrag stellen, Wartemarke erhöhen und Stempelregen auslösen.
- Dienstreise / G: Schwerelosigkeit umschalten.
- Ruhemodus / Escape: Animationen stoppen. Reduzierte Bewegung des Betriebssystems wird berücksichtigt.
- Alle Schaltflächen sind auch per Touch und Tastatur bedienbar.

Stempel werden einmal als Bilder vorgezeichnet. Maximal 140 Partikel laufen gleichzeitig; die Maussteuerung arbeitet unabhängig davon im Bildschirmtakt. Optionale Google Fonts haben lokale Ersatzschriften. Audiodateien im Dateiwähler bleiben lokal.
