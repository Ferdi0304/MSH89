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
- `api/deals.js` + die Komponente `TaeglicheListe` (Nomad-Tab) sind
  verdrahtet, aber tot: der Client ruft `/api/deals?typ=nomad` auf, der
  Server liest jedoch nur `req.query.stadt` - der Cache liefert deshalb
  immer eine leere Liste. Zudem gibt es im Repo keinen Aufrufer, der per
  POST je Hotels in den Cache schreiben wuerde; der Schreibpfad wird nie
  benutzt. Der Nomad-Tab zeigt aktuell dauerhaft den Leer-Hinweis
  ("aktuelle Auswahl ist gerade nicht verfuegbar").
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
- Inventar von ca. 8 auf 30-50 kuratierte Hotels erweitern (`HOTELS`-Array
  in App.jsx). Die Statistik "8 Kuratierte Hotels" im Hero-Bereich ist
  hart codiert und muesste mitwachsen.

## Arbeitsweise
Ehrliche Einschaetzung vor Zustimmung. Bei fragwuerdigen Ansaetzen
widersprechen statt mitgehen.
