# MySpecialHotel.com

Hotel-Affiliate-Website fuer den DACH-Markt.
Betreiber: Einzelunternehmer (Kleinunternehmer) in Berlin.

## Stack
- React 18 + Vite
- Gesamte App in `src/App.jsx` (bewusst eindateiig)
- Kein Router: Navigation ueber lokalen `tab`-State in App.jsx
  (home, nomad, ai, impressum, datenschutz - die letzten beiden nur ueber
  den Footer erreichbar, nicht in der Hauptnavigation)
- Serverless-Funktionen unter `api/` (Vercel): `chat.js` (Anthropic-Proxy),
  `deals.js` (Hotel-Cache fuer den Nomad-Tab, siehe Offene Punkte)
- Deployment: Vercel (Projekt `msh-89`), automatisch bei Push auf main
- Repo: github.com/Ferdi0304/MSH89

## KI-Berater
Ein einzelner Aufruf an die Anthropic API (Modell `claude-sonnet-5`) ueber
`api/chat.js`, das den Request nur mit dem serverseitigen API-Key durchreicht.
Kein mehrstufiger Websuche-Ablauf - das wurde bewusst verworfen (Kosten, Latenz).

Hotel-Links entstehen NICHT (mehr) ueber unsichtbare Marker. Sonnet formatiert
jede Empfehlung im sichtbaren Antworttext als "Name (Ort) - Begruendung"; der
Client erkennt dieses Muster per Regex und baut daraus getrackte Booking-
Suchlinks - gesucht wird nur nach dem Hotelnamen, nicht nach Name+Ort, weil
Sonnet Haeuser oft falsch verortet. Nur der Sammel-Link fuer die gesamte
Zielregion nutzt noch einen unsichtbaren Marker (`[SUCHE: Ort]`) am Ende der
Antwort, der vor der Anzeige entfernt wird.
API-Key: ANTHROPIC_API_KEY, lokal in .env, produktiv in Vercel.

## Affiliate
CJ Affiliate, Booking.com DACH-Programm.
Website-ID 101831910, Link-ID 15734849.

## Regeln
- KEINE erfundenen Preise, Sternebewertungen oder Dringlichkeits-Hinweise
  ("nur noch 2 Zimmer!"). Verstoss gegen Paragraph 5 UWG, Abmahnrisiko.
- Nur Angaben, die tatsaechlich aus der Quelle stammen.
- Deutschsprachige Oberflaeche, Du-Ansprache.

## Offene Punkte
- `api/deals.js` + die Komponente `TaeglicheListe` sind weiterhin tot:
  der Client rief `/api/deals?typ=nomad` auf, der Server liest aber nur
  `req.query.stadt`, und niemand schreibt je per POST in den Cache. Die
  Komponente wird seit dem Umbau auf "Mein Hotel" nicht mehr gerendert
  (sie zeigte Besuchern dauerhaft "gerade nicht verfuegbar"), der Code
  steht aber noch da. Waere die Grundlage fuer einen Ziel-Cache, mit dem
  die KI-Suchkosten unter 1 Cent faellen - braucht dann aber einen echten
  Speicher (z.B. Vercel KV), weil der In-Memory-Cache auf Serverless
  nicht zuverlaessig ueberlebt.
- `api/chat.js` hat einen CORS-Origin-Check (Allowlist: myspecialhotel.com,
  www.myspecialhotel.com, msh-89.vercel.app, localhost:5173) - fremde
  Browser-Origins bekommen 403. Das stoppt Missbrauch aus fremden
  Web-Frontends, aber NICHT Skripte/curl mit gefaelschtem Origin-Header,
  da CORS rein Browser-seitig durchgesetzt wird. Fuer vollstaendigen Schutz
  vor direktem API-Missbrauch fehlt noch Rate-Limiting oder ein Secret
  zwischen Frontend und `/api/chat`.
- URL-Encoding-Bug bei Hotelnamen mit Apostroph: im aktuellen Code nutzen
  alle Link-Builder (`searchUrl`, `track`, `hotelSuchbegriff`) durchgehend
  `encodeURIComponent`. Im Review war der Bug damit nicht reproduzierbar -
  bitte pruefen, ob er noch auftritt, oder ob er bereits behoben wurde.
- Bilder: 172 der 174 Haeuser zeigen thematische Unsplash-Fotos, nicht das
  echte Haus (nur Sacher Wien und Gstaad Palace haben ein echtes Foto von
  Wikimedia). Das ist der groesste offene Konversionshebel - sauber loesbar
  nur ueber Bookings Content-API fuer Partner, die separat beantragt werden
  muss. Booking-Bilder einfach zu hotlinken verstoesst gegen deren
  Nutzungsbedingungen.
- Linkpflege: Booking-Slugs veralten, wenn Haeuser umbenannt werden oder den
  Betreiber wechseln. Beim Rundumcheck im September 2026 waren 4 von 174
  betroffen (Boutiquehotel Stadthalle -> Cocoon, numa Berlin Nook, Kempinski
  Adriatic -> Minor Hotels, Palais Hansen Kempinski -> Anantara). Pruefweg
  siehe unten - einmal pro Quartal sinnvoll.
- CJ-`sid`: jeder Buchungslink traegt eine Herkunftsmarke (`luxury-19`,
  `ki-hotel`, `weltsuche` ...). Ob CJ den Parameter im Bericht wirklich
  ausweist, ist noch nicht am Livesystem bestaetigt.

## Linkpruefung (bewaehrter Weg)
Booking.com blockt automatisierte Abrufe: echte und erfundene Hotel-URLs
liefern identische 202-Antworten, ein direkter Check ist also wertlos.
DuckDuckGo sperrt nach wenigen Abfragen und liefert dann stillschweigend
leere Ergebnisse - das sieht wie "Hotel existiert nicht" aus und fuehrt in
die Irre. Funktioniert hat **Startpage** (`startpage.com/sp/search?query=`):
Slug per Regex aus dem HTML ziehen, ~5s Pause, Sperre an Statuscode und
Antwortlaenge (<120k) erkennen und davon getrennt behandeln, Zwischenstand
nach jedem Hotel speichern. Vorsicht bei der automatischen Zuordnung: das
Land im Slug muss zum Hotel passen, und ein Treffer nur auf den Staedtenamen
ist kein Treffer.

## Arbeitsweise
Ehrliche Einschaetzung vor Zustimmung. Bei fragwuerdigen Ansaetzen
widersprechen statt mitgehen.
