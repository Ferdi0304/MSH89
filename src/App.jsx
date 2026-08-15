import { useState, useRef, useEffect } from "react";

const HOTELS = [
  { id: 1, name: "Mont Cervin Palace", preisIntern: 320, city: "Zermatt", country: "Schweiz", img: "https://images.unsplash.com/photo-1640535092591-b9c35f4b138f?w=800&q=80&auto=format&fit=crop", tags: ["Wellness", "Berge", "Luxus"], nomad: false, cat: "wellness", url: "https://www.booking.com/hotel/ch/mont-cervin-palace.de.html" },
  { id: 2, name: "25hours Hotel Bikini Berlin", preisIntern: 119, city: "Berlin", country: "Deutschland", img: "https://images.unsplash.com/photo-1585405327087-ccddc9329fa5?w=800&q=80&auto=format&fit=crop", tags: ["Nomad", "Design", "Zentral"], nomad: true, cat: "nomad", url: "https://www.booking.com/hotel/de/25hours-bikini-berlin.de.html" },
  { id: 3, name: "Hotel Negresco", preisIntern: 280, city: "Nizza", country: "Frankreich", img: "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=800&q=80&auto=format&fit=crop", tags: ["Meer", "Luxus", "Historisch"], nomad: false, cat: "luxury", url: "https://www.booking.com/hotel/fr/negresco.de.html" },
  { id: 4, name: "25hours Hotel MuseumsQuartier", preisIntern: 89, city: "Wien", country: "Oesterreich", img: "https://images.unsplash.com/photo-1646491311728-f4a676e5f17d?w=800&q=80&auto=format&fit=crop", tags: ["Nomad", "Design", "Zentral"], nomad: true, cat: "nomad", url: "https://www.booking.com/hotel/at/25hours-wien.de.html" },
  { id: 5, name: "Gritti Palace Venice", preisIntern: 650, city: "Venedig", country: "Italien", img: "https://images.unsplash.com/photo-1558271736-cd043ef2e855?w=800&q=80&auto=format&fit=crop", tags: ["Luxus", "Romantik", "Historisch"], nomad: false, cat: "luxury", url: "https://www.booking.com/hotel/it/gritti-palace.de.html" },
  { id: 6, name: "Dollenberg Relais & Chateaux", preisIntern: 195, city: "Bad Peterstal", country: "Deutschland", img: "https://images.unsplash.com/photo-1720951901235-8d865c940454?w=800&q=80&auto=format&fit=crop", tags: ["Wellness", "Spa", "Natur"], nomad: false, cat: "wellness", url: "https://www.booking.com/hotel/de/dollenberg.de.html" },
  { id: 7, name: "Casa Camper Barcelona", preisIntern: 145, city: "Barcelona", country: "Spanien", img: "https://images.unsplash.com/photo-1578095172812-dcc191c5aed8?w=800&q=80&auto=format&fit=crop", tags: ["Design", "Nomad", "Zentral"], nomad: true, cat: "nomad", url: "https://www.booking.com/hotel/es/casa-camper.de.html" },
  { id: 8, name: "Interalpen-Hotel Tyrol", preisIntern: 280, city: "Telfs", country: "Oesterreich", img: "https://images.unsplash.com/photo-1607453813894-21f7b5cf201a?w=800&q=80&auto=format&fit=crop", tags: ["Wellness", "Spa", "Berge"], nomad: false, cat: "wellness", url: "https://www.booking.com/hotel/at/interalpen-tyrol.de.html" },
];

const ACCENT = "#C9960C";
const ACCENT_LIGHT = "#FDF6E3";
const TEXT = "#1a1a2e";
const GRAY = "#6b7280";
const BORDER = "#e5e7eb";

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
  body { background: #fff; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; height: 0; }
  ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
  input::placeholder { color: #9ca3af !important; }
  a { text-decoration: none; }
  button { font-family: Inter, sans-serif; }
  :focus-visible { outline: 2px solid #C9960C; outline-offset: 2px; }

  @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* ---------- NAV ---------- */
  .nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.96); backdrop-filter: blur(12px);
    border-bottom: 1px solid #e5e7eb;
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; padding: 0 24px; height: 62px;
  }
  .nav-logo {
    font-family: 'Playfair Display', serif; font-size: 21px; font-weight: 900;
    color: #1a1a2e; background: none; border: none; cursor: pointer;
    white-space: nowrap; letter-spacing: -0.3px; flex-shrink: 0; padding: 0;
  }
  .nav-tabs {
    display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none;
    -webkit-overflow-scrolling: touch; min-width: 0;
  }
  .nav-tabs::-webkit-scrollbar { display: none; }
  .tab-btn {
    background: transparent; border: 1px solid transparent; border-radius: 8px;
    padding: 8px 13px; color: #6b7280; cursor: pointer; font-size: 13.5px;
    font-weight: 500; white-space: nowrap; transition: all 0.18s;
  }
  .tab-btn:hover { background: #f9fafb; color: #1a1a2e; }
  .tab-btn.tab-on { background: #FDF6E3; border-color: #e9d06a; color: #C9960C; font-weight: 650; }

  /* ---------- HERO ---------- */
  .hero {
    position: relative; overflow: hidden;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 80px 24px 72px; min-height: 78vh;
  }

  /* ---------- STATS ---------- */
  .stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb;
    background: #fff; max-width: 900px; margin: 0 auto;
  }
  .stat { text-align: center; padding: 20px 8px; }
  .stat + .stat { border-left: 1px solid #e5e7eb; }
  .stat-n { font-family: 'Playfair Display', serif; font-size: 21px; font-weight: 700; color: #C9960C; }
  .stat-l { font-size: 12px; color: #6b7280; margin-top: 3px; }

  /* ---------- CARDS & BUTTONS ---------- */
  .card { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s; }
  .card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.12) !important; }
  .btn-gold {
    background: #C9960C; color: #fff; border: none; border-radius: 10px;
    font-weight: 700; cursor: pointer; transition: all 0.2s; letter-spacing: 0.2px;
  }
  .btn-gold:hover { background: #b8860b; box-shadow: 0 4px 14px rgba(201,150,12,0.35); }
  .btn-gold:active { transform: translateY(1px); }
  .btn-gold:disabled { background: #d1d5db; cursor: not-allowed; box-shadow: none; }
  .filter-btn { transition: all 0.2s; }

  /* ---------- MOBILE ---------- */
  @media (max-width: 820px) {
    .nav { padding: 0 14px; height: 58px; gap: 8px; }
    .nav-logo { font-size: 17px; }
    .tab-btn { padding: 7px 10px; font-size: 12.5px; }

    .hero { padding: 48px 20px 44px; min-height: auto; }
    .hero-title { font-size: 34px !important; line-height: 1.12 !important; margin-bottom: 16px !important; }
    .hero p { font-size: 15.5px !important; margin-bottom: 26px !important; }
    .hero-buttons { flex-direction: column; align-items: stretch; gap: 10px !important; }
    .hero-buttons button { width: 100%; }

    .stats { grid-template-columns: repeat(2, 1fr); }
    .stat:nth-child(odd) { border-left: none; }
    .stat:nth-child(n+3) { border-top: 1px solid #e5e7eb; }
    .stat { padding: 16px 8px; }
    .stat-n { font-size: 19px; }

    .hotel-grid { grid-template-columns: 1fr !important; }
    .nomad-features { grid-template-columns: 1fr !important; }
    .page-padding { padding-left: 18px !important; padding-right: 18px !important; }
    .search-bar { margin-bottom: 22px !important; }
    .world-search { padding: 22px 18px !important; }
    .section-h { font-size: 25px !important; }
    .filter-row { gap: 7px !important; margin-bottom: 26px !important; }
    .footer-inner { padding: 26px 18px !important; }
  }
`;

// === HOTEL-VERZEICHNIS ===
// Jede per Websuche gefundene URL wird hier gespeichert.
// Beim naechsten Mal wird sie direkt genutzt - ohne kostenpflichtige Suche.
// Bekannte Haeuser koennen auch fest eingetragen werden (Key: Name kleingeschrieben).
var KNOWN_HOTELS = {};

function hotelKey(name) {
  return (name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function loadCache() {
  try {
    var raw = localStorage.getItem("msh_hotels");
    if (raw) {
      var saved = JSON.parse(raw);
      Object.keys(saved).forEach(function(k) {
        if (!KNOWN_HOTELS[k]) KNOWN_HOTELS[k] = saved[k];
      });
    }
  } catch (e) { /* localStorage nicht verfuegbar - kein Problem */ }
}

function rememberHotel(name, stadt, url) {
  var k = hotelKey(name);
  if (!k || !url) return;
  KNOWN_HOTELS[k] = { name: name, stadt: stadt, url: url };
  try {
    localStorage.setItem("msh_hotels", JSON.stringify(KNOWN_HOTELS));
  } catch (e) { /* ignorieren */ }
}

// === CJ AFFILIATE TRACKING ===
// Website-ID: 101831910 | Link-ID: 15734849
const CJ_BASE = "https://www.kqzyfj.com/click-101831910-15734849";

function track(bookingUrl) {
  return CJ_BASE + "?url=" + encodeURIComponent(bookingUrl);
}

// Liest JSON aus einer Modellantwort. Modelle verpacken JSON gern
// in Codebloecke oder schreiben Text davor - beides hier abfangen.
function leseJson(text) {
  if (!text) return null;
  var s = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  var a = s.indexOf("{");
  var b = s.lastIndexOf("}");
  if (a === -1 || b === -1 || b < a) return null;
  try { return JSON.parse(s.slice(a, b + 1)); } catch (e) { return null; }
}

function normal(s) {
  return (s || "").toLowerCase()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]/g, "");
}

// Waehlt kuratierte Hotels rein rechnerisch aus - keine Modellentscheidung.
// Stadt oder Land muss uebereinstimmen, der Preis muss ins Budget passen.
function kuratierteTreffer(wunsch) {
  var ort = normal(wunsch.ort);
  var land = normal(wunsch.land);
  if (!ort && !land) return [];

  return HOTELS.filter(function(h) {
    var hOrt = normal(h.city);
    var hLand = normal(h.country);

    if (ort) {
      // Stadt genannt: nur exakte Stadt zaehlt. Sonst kaeme auf "Rom"
      // ein Hotel in Venedig, nur weil beide in Italien liegen.
      if (hOrt.indexOf(ort) === -1 && ort.indexOf(hOrt) === -1) return false;
    } else {
      if (hLand.indexOf(land) === -1 && land.indexOf(hLand) === -1) return false;
    }

    if (wunsch.maxPreis && h.preisIntern > wunsch.maxPreis * 1.1) return false;
    return true;
  }).slice(0, 3);
}

// Entfernt Marker, Markdown und entschuldigende Saetze.
// Der Prompt allein verhindert Formulierungen wie "leider haben wir kein..."
// nicht zuverlaessig - deshalb hier deterministisch nachraeumen.
// Vertroestungen entfernen. Saetze wie "Lass mich suchen" sind wertlos,
// weil die Suche in derselben Antwort bereits passiert sein muss.
var VERTROESTUNG = [
  /[^.!?\n]*\b(leider|bedauerlicherweise)\b[^.!?\n]*\b(gefunden|suchergebnis|verfuegbar|finden)\b[^.!?\n]*[.!?]/gi,
  /[^.!?\n]*\bin den suchergebnissen\b[^.!?\n]*[.!?]/gi,
  /[^.!?\n]*\bkonnten? kein[e]?[nsmr]?\b[^.!?\n]*\b(gefunden|finden)\b[^.!?\n]*[.!?]/gi,
  /[^.!?\n]*\b(lass mich|ich (werde|kann|wuerde|würde))\b[^.!?\n]*\b(such|raussuch|finden|heraussuch|zusammenstell|schau)[^.!?\n]*[.!?]/gi,
  /[^.!?\n]*\b(sag|schreib|gib)\b[^.!?\n]*\bbescheid\b[^.!?\n]*\b(link|schick|such)[^.!?\n]*[.!?]/gi,
  /[^.!?\n]*\bdann (schicke|sende|suche|finde) ich\b[^.!?\n]*[.!?]/gi,
  /[^.!?\n]*\bgleich\b[^.!?\n]*\b(die besten|passende)\b[^.!?\n]*(deals|optionen|links)[^.!?\n]*[.!?]/gi
];

var APOLOGY = [
  /[^.!?\n]*\b(leider|bedauerlicherweise)\b[^.!?\n]*(auswahl|angebot|portfolio|kurat|sortiment|haben wir|liste)[^.!?\n]*[.!?]/gi,
  /[^.!?\n]*\b(nicht|kein[e]?[nsmr]?)\b[^.!?\n]*\b(unserer|unserem|unseren|in unser)\b[^.!?\n]*(auswahl|angebot|portfolio|sortiment|liste|hotels)[^.!?\n]*[.!?]/gi,
  /[^.!?\n]*\b(in|aus)\s+unserer\s+(kuratierten\s+)?auswahl\b[^.!?\n]*\b(nicht|kein)[^.!?\n]*[.!?]/gi,
  /[^.!?\n]*\bunsere[rn]?\s+(kuratierte[rn]?\s+)?(auswahl|angebot)\b[^.!?\n]*\b(umfasst|enthaelt|enthält|bietet)\s+(leider\s+)?(kein|nicht)[^.!?\n]*[.!?]/gi
];

function stripMarkers(t) {
  var s = (t || "")
    .replace(/\[HOTELS:[\d,]+\]/g, "")
    .replace(/\[SUCHE:[^\]]+\]/g, "")
    .replace(/\[HOTEL:[^\]]+\]/g, "")
    .replace(/\*\*/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/https?:\/\/(?:www\.)?booking\.com\/hotel\/[a-z]{2}\/[^\s<>")\]]+/gi, "");
  APOLOGY.forEach(function(re) { s = s.replace(re, ""); });
  VERTROESTUNG.forEach(function(re) { s = s.replace(re, ""); });
  return s
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s*[\n]+/, "")
    .trim();
}

// Baut aus einer Booking-URL einen lesbaren Hotelnamen.
// Wird gebraucht, wenn die Suche zwar eine URL liefert, aber
// keinen brauchbaren Namen dazu.
function nameAusUrl(u) {
  try {
    var teil = u.split("/hotel/")[1].split("/")[1] || "";
    teil = teil.split("?")[0].replace(/\.(de|en|[a-z]{2})?\.?html?$/i, "");
    var w = teil.split("-").filter(Boolean).map(function(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    });
    return w.join(" ") || "Unterkunft ansehen";
  } catch (e) {
    return "Unterkunft ansehen";
  }
}

function searchUrl(params) {
  var q = params.ort || "";
  var u = "https://www.booking.com/searchresults.de.html?ss=" + encodeURIComponent(q);
  // ssne signalisiert Booking eine bewusst gewaehlte Destination -
  // erhoeht die Trefferquote bei Hotelnamen spuerbar
  u += "&ssne=" + encodeURIComponent(q) + "&ssne_untouched=" + encodeURIComponent(q);
  if (params.checkin) u += "&checkin=" + params.checkin;
  if (params.checkout) u += "&checkout=" + params.checkout;
  if (params.erwachsene) u += "&group_adults=" + params.erwachsene;
  // Preisfilter: Bookings Format ist price=EUR-<von>-<bis>-1.
  // Frueher stand hier "min-<preis>", das filterte auf Hotels
  // AB diesem Preis - also genau falsch herum.
  if (params.maxPreis) u += "&nflt=" + encodeURIComponent("price=EUR-0-" + params.maxPreis + "-1");
  u += "&selected_currency=EUR&lang=de";
  return track(u);
}

function HotelCard({ hotel, highlight }) {
  const url = track(hotel.url);
  // Keine Sterne, keine Bewertungszahlen, keine Preisangabe:
  // Diese Werte kennen wir nicht. Erfundene Angaben waeren nach
  // UWG irrefuehrend. Der echte Stand steht bei Booking.
  return (
    <div className="card" style={{ background: "#fff", border: "1px solid " + (highlight ? ACCENT : BORDER), borderRadius: 16, overflow: "hidden", boxShadow: highlight ? "0 0 0 2px " + ACCENT + "22" : "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ position: "relative", height: 190 }}>
        <img src={hotel.img} alt={hotel.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)" }} />
        {hotel.nomad && <span style={{ position: "absolute", top: 12, left: 12, background: "#10b981", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Laptop NOMAD</span>}
        <span style={{ position: "absolute", bottom: 10, left: 12, color: "#fff", fontSize: 12, fontFamily: "Inter, sans-serif", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{hotel.city}, {hotel.country}</span>
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 10, lineHeight: 1.3 }}>{hotel.name}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {hotel.tags.map(function(t) { return <span key={t} style={{ background: ACCENT_LIGHT, color: ACCENT, padding: "3px 9px", borderRadius: 8, fontSize: 11, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{t}</span>; })}
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ display: "block", textAlign: "center", padding: "11px 18px", fontSize: 13 }}>Preis &amp; Verfuegbarkeit →</a>
      </div>
    </div>
  );
}

function AIChat() {
  var initialMsgs = [{ role: "assistant", text: "Hallo! Ich bin dein persoenlicher Hotel-Concierge von MySpecialHotel.\n\nBeschreib mir deinen Traumurlaub - Reiseziel, Budget, Stimmung - und ich finde das passende Haus fuer dich. Egal ob aus unserer kuratierten Auswahl oder aus dem weltweiten Angebot." }];
  var [msgs, setMsgs] = useState(initialMsgs);
  var [input, setInput] = useState("");
  var [loading, setLoading] = useState(false);
  var [suggested, setSuggested] = useState([]);
  var [searchLink, setSearchLink] = useState(null);
  var [external, setExternal] = useState([]);
  var bottomRef = useRef(null);

  useEffect(function() { loadCache(); }, []);

  useEffect(function() {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading, suggested, searchLink, external]);

  // Ein API-Aufruf mit klar begrenzter Aufgabe.
  var frage = async function(system, messages, mitSuche, modell) {
    var body = {
      model: modell || "claude-haiku-4-5-20251001",
      max_tokens: mitSuche ? 1200 : 600,
      system: system,
      messages: messages
    };
    if (mitSuche) body.tools = [{ type: "web_search_20250305", name: "web_search", max_uses: 3 }];

    var res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = await res.json();

    var bloecke = data.content || [];
    var texte = bloecke
      .filter(function(b) { return b.type === "text" || (!b.type && b.text); })
      .map(function(b) { return (b.text || "").trim(); })
      .filter(function(t) { return t.length > 0; });

    // Bei Suchen liefert die API mehrere Bloecke - der letzte ist die Antwort.
    var urls = [];
    (function sammle(x) {
      if (!x) return;
      if (Array.isArray(x)) { x.forEach(sammle); return; }
      if (typeof x === "object") {
        if (typeof x.url === "string" && /booking\.com\/hotel\/[a-z]{2}\//i.test(x.url)) {
          urls.push({ url: x.url.split("?")[0], titel: x.title || "" });
        }
        Object.keys(x).forEach(function(k) { sammle(x[k]); });
      }
    })(bloecke);

    return {
      text: texte.length ? texte[texte.length - 1] : "",
      alle: texte.join("\n"),
      urls: urls
    };
  };

  var send = async function() {
    if (!input.trim() || loading) return;
    var q = input.trim();
    setInput("");
    var neueMsgs = msgs.concat([{ role: "user", text: q }]);
    setMsgs(neueMsgs);
    setLoading(true);
    setSuggested([]);
    setSearchLink(null);
    setExternal([]);

    var verlauf = neueMsgs
      .filter(function(m, i) { return !(i === 0 && m.role === "assistant"); })
      .filter(function(m) { return m.text && m.text.trim(); })
      .map(function(m) {
        return { role: m.role === "user" ? "user" : "assistant", content: m.text.trim() };
      })
      .slice(-12);
    while (verlauf.length && verlauf[0].role !== "user") verlauf.shift();

    try {
      // ===== SCHRITT 1: Wunsch verstehen =====
      // Einzige Aufgabe. Keine Hotels im Kontext, also keine Versuchung,
      // vorhandene Haeuser statt passender zu nennen.
      var verstehen = await frage(
        "Du liest ein Gespraech ueber eine Hotelsuche und gibst NUR JSON zurueck, keinen anderen Text.\n\n" +
        "Format:\n" +
        '{"ort":"Stadt oder null","orte":["Stadt1","Stadt2","Stadt3"],' +
        '"land":"Land oder null","maxPreis":Zahl oder null,' +
        '"personen":Zahl,"naechte":Zahl oder null,"art":"Hotel|Hostel|Apartment|Resort",' +
        '"stichworte":["..."],"frage":"eine kurze Rueckfrage oder null","vorschlaege":["Ort1","Ort2"]}\n\n' +
        "REGELN:\n" +
        "1. Beruecksichtige das GANZE Gespraech. Einmal genannte Angaben bleiben gueltig. " +
        "Eine Folgefrage aendert nur das, was sie ausdruecklich nennt - alles andere bleibt.\n" +
        "2. Ist kein Ort genannt, aber eine Richtung erkennbar, waehle selbst einen konkreten " +
        "passenden Ort und setze ihn in 'ort'. Das gilt auch fuer indirekte Hinweise:\n" +
        "2a. REGIONEN AUFTEILEN: Nennt der Gast eine Region, ein Land, ein Meer oder eine " +
        "Kueste statt einer Stadt, waehle DREI verschiedene passende Orte darin und schreibe " +
        "sie in 'orte'. In 'ort' kommt der erste davon.\n" +
        "   'Mittelmeer' -> orte: Barcelona, Nizza, Valencia\n" +
        "   'Griechenland' -> orte: Kreta, Rhodos, Korfu\n" +
        "   'Alpen' -> orte: Zermatt, Innsbruck, Garmisch\n" +
        "   'ans Meer' -> orte: drei Kuestenorte\n" +
        "   Bei einer konkreten Stadt bleibt 'orte' leer.\n" +
        "   - Reisezeit: 'im Oktober noch baden' -> Kanaren, Zypern, Malta\n" +
        "   - Anlass: 'Hochzeitstag romantisch Italien' -> Verona, Amalfikueste, Florenz\n" +
        "   - Stimmung: 'was Cooles', 'mal wieder weg' -> waehle eine beliebte Stadt\n" +
        "3. Ausschluesse beachten: Bei 'ausserhalb von X', 'woanders', 'nicht X' waehle einen " +
        "ANDEREN Ort in derselben Region. Beispiel: nach Mykonos gefragt, dann 'ausserhalb' -> " +
        "Kreta, Rhodos, Korfu oder Naxos. Den zuvor genannten Ort NIEMALS erneut einsetzen.\n" +
        "4. Nur wenn wirklich gar nichts erkennbar ist: ort=null, dazu eine kurze 'frage' " +
        "und 2-3 konkrete 'vorschlaege'. Das soll die Ausnahme sein.\n" +
        "5. PREIS - maxPreis ist immer PRO NACHT:\n" +
        "   - 'bis 90 Euro' -> maxPreis 90\n" +
        "   - Gesamtbudget umrechnen: '400 Euro fuer 3 Tage' -> naechte 3, maxPreis 133\n" +
        "   - '600 Euro Woche' -> naechte 7, maxPreis 85\n" +
        "   - Preiswoerter: 'moeglichst billig'=60, 'guenstig'=90, 'gehoben'=250\n" +
        "   - Konkrete Zahlen haben immer Vorrang vor Preiswoertern.\n" +
        "6. personen: Standard 2. 'meine Eltern'=2, 'Familie'=4, 'mit Freundin'=2.\n" +
        "7. stichworte: Alle Anforderungen aufnehmen, die keine Stadt und kein Preis sind. " +
        "Zum Beispiel barrierefrei, ruhig, Pool, Strandnaehe, Fruehstueck, Parkplatz, " +
        "Haustiere, Familienzimmer, Klimaanlage, WLAN, zentral. " +
        "'keine Treppen' -> 'barrierefrei, Aufzug'. 'naeher am Strand' -> 'direkt am Strand'.\n" +
        "8. art: 'Hostel' bei Backpacker- oder Gruppenanfragen, 'Apartment' bei Selbstversorgung " +
        "oder langem Aufenthalt, 'Resort' bei All-Inclusive, sonst 'Hotel'.\n" +
        "9. Antworte ausschliesslich mit dem JSON-Objekt.",
        verlauf,
        false
      );

      var w = leseJson(verstehen.text) || {};
      var wunsch = {
        ort: w.ort || "",
        orte: Array.isArray(w.orte) ? w.orte.filter(function(o) {
          return typeof o === "string" && o.trim().length > 1;
        }).slice(0, 3) : [],
        land: w.land || "",
        maxPreis: typeof w.maxPreis === "number" ? w.maxPreis : null,
        personen: typeof w.personen === "number" ? w.personen : 2,
        naechte: typeof w.naechte === "number" ? w.naechte : null,
        art: w.art || "Hotel",
        stichworte: Array.isArray(w.stichworte) ? w.stichworte : []
      };

      // Kein Ziel erkennbar: eine Frage, dazu klickbare Vorschlaege.
      if (!wunsch.ort) {
        var vs = Array.isArray(w.vorschlaege) ? w.vorschlaege.slice(0, 3) : [];
        var text = w.frage || "Wohin soll es denn gehen?";
        if (vs.length) text += " Beliebt sind gerade " + vs.join(", ") + ".";
        setMsgs(function(p) { return p.concat([{ role: "assistant", text: text }]); });
        setLoading(false);
        return;
      }

      // ===== SCHRITT 2: Kuratierte Hotels rein rechnerisch pruefen =====
      var eigene = kuratierteTreffer(wunsch);
      setSuggested(eigene);

      // Hat der Gast eine Dauer genannt, gleich einen Zeitraum vorbelegen -
      // dann zeigt Booking passende Preise statt einer offenen Suche.
      var zr = {};
      if (wunsch.naechte && wunsch.naechte > 0 && wunsch.naechte < 30) {
        var tag = 86400000;
        var an = new Date(Date.now() + 14 * tag);
        var ab = new Date(Date.now() + (14 + wunsch.naechte) * tag);
        zr.checkin = an.toISOString().slice(0, 10);
        zr.checkout = ab.toISOString().slice(0, 10);
      }

      setSearchLink({
        url: searchUrl({
          ort: wunsch.ort,
          maxPreis: wunsch.maxPreis || undefined,
          erwachsene: wunsch.personen,
          checkin: zr.checkin,
          checkout: zr.checkout
        }),
        ort: wunsch.ort
      });

      // ===== SCHRITT 3: Suchen, nur wenn noetig =====
      var brauchtSuche = eigene.length < 2;
      if (!brauchtSuche) {
        // Auch hier ueber Schritt 4 formulieren, damit die Antwort
        // gleich klingt, egal woher die Haeuser kommen.
        var eigenText = "";
        try {
          var f0 = await frage(
            "Du bist Hotel-Concierge auf MySpecialHotel.com. Nur Fliesstext, kein Markdown.\n" +
            "Empfiehl dem Gast die unten genannten Haeuser und erklaere je in einem Satz, " +
            "warum sie zu seinem Wunsch passen. Nicht aufzaehlen, sondern empfehlen.\n" +
            "Erfinde nichts dazu, keine Preise, keine Bewertungen.\n" +
            "Zwei bis drei Saetze, warm und konkret. Hoechstens EINE kurze Rueckfrage.\n" +
            "Die Buttons erscheinen automatisch - erwaehne sie nicht.\n\n" +
            "HAEUSER:\n" + eigene.map(function(h) {
              return "- " + h.name + " (" + h.city + ", " + h.country + "): " + h.tags.join(", ");
            }).join("\n"),
            verlauf.concat([{ role: "user", content: "Schreibe jetzt die Antwort auf meine letzte Nachricht." }]),
            false,
            "claude-sonnet-4-6"
          );
          eigenText = stripMarkers((f0.text || "").trim());
        } catch (e) { eigenText = ""; }

        setMsgs(function(p) { return p.concat([{
          role: "assistant",
          text: eigenText || (eigene.length + " Haeuser in " + wunsch.ort + " passen zu deinem Wunsch.")
        }]); });
        setLoading(false);
        return;
      }

      var bekannteZeilen = Object.keys(KNOWN_HOTELS).map(function(k) {
        var h = KNOWN_HOTELS[k];
        return h.name + " | " + h.url;
      }).slice(0, 40);

      // Bei einer Region je ein Haus pro Ort statt drei in derselben Stadt.
      var mehrereOrte = wunsch.orte.length > 1;
      var auftrag =
        (mehrereOrte
          ? "Finde je eine Unterkunft in diesen Orten: " + wunsch.orte.join(", ") +
            ". Pro Ort genau ein Haus, nicht mehrere in derselben Stadt."
          : "Finde " + (3 - eigene.length) + " Unterkuenfte in " + wunsch.ort +
            (wunsch.land ? " (" + wunsch.land + ")" : "")) +
        " fuer " + wunsch.personen + " Personen, Art: " + wunsch.art +
        (wunsch.maxPreis ? ", hoechstens " + wunsch.maxPreis + " EUR pro Nacht" : "") + ".\n" +
        (wunsch.stichworte.length
          ? "PFLICHT-ANFORDERUNGEN: " + wunsch.stichworte.join(", ") +
            ". Nimm diese Begriffe mit in die Suchanfrage auf. " +
            "Ein Haus, das sie nicht erfuellt, gehoert nicht in die Antwort.\n"
          : "");

      var suchen = await frage(
        "Du bist Hotel-Rechercheur. Deine einzige Aufgabe: echte Booking.com-Seiten finden.\n\n" +
        "ABLAUF:\n" +
        "1. Nutze web_search. Muster: site:booking.com \"Stadt\" <Anforderung> Hotel\n" +
        "   Bei Anforderungen diese in die Suche aufnehmen, z.B. " +
        "site:booking.com \"Kreta\" Hotel direkt am Strand\n" +
        "2. Bringt die erste Suche nichts Passendes, suche ERNEUT mit anderen Begriffen: " +
        "englische statt deutsche Woerter, Stadtteil statt Stadt, oder ohne die engste " +
        "Anforderung. Gib nicht nach einer Suche auf.\n" +
        "3. Nimm aus den Treffern nur URLs der Form https://www.booking.com/hotel/XX/name.html\n" +
        "4. Erfinde NIEMALS eine URL. Nur was in den Suchergebnissen stand.\n\n" +
        (bekannteZeilen.length ? "Bereits bekannt (URL direkt nutzbar, nicht erneut suchen):\n" + bekannteZeilen.join("\n") + "\n\n" : "") +
        "Antworte NUR mit diesem JSON, ohne weiteren Text:\n" +
        '{"hotels":[{"name":"Hotelname","stadt":"Ort des Hauses",' +
        '"url":"https://www.booking.com/hotel/xx/name.html",' +
        '"fakten":"Was in den Suchergebnissen ueber dieses Haus stand: Lage, Ausstattung, ' +
        'Besonderheiten. Stichpunkte reichen. NUR was du wirklich gelesen hast."}]}\n\n' +
        "Schreibe KEINEN Fliesstext und KEINE Empfehlung - nur die Fakten je Haus. " +
        "Erfinde keine Preise und keine Bewertungen.",
        [{ role: "user", content: auftrag }],
        true
      );

      var erg = leseJson(suchen.text) || leseJson(suchen.alle) || {};
      var gefunden = Array.isArray(erg.hotels) ? erg.hotels : [];

      // Nur echte Booking-Hotelseiten. Der Text kann nichts kaputt machen,
      // weil die Buttons ausschliesslich aus dieser Liste entstehen.
      var gueltig = gefunden.filter(function(h) {
        return h && typeof h.url === "string" &&
          /^https?:\/\/(www\.)?booking\.com\/hotel\/[a-z]{2}\//i.test(h.url);
      });

      // Notfalls aus den Suchtreffern ergaenzen, falls das JSON leer blieb.
      if (gueltig.length === 0) {
        gueltig = suchen.urls.slice(0, 2).map(function(u) {
          var n = (u.titel || "").split(/[,|–-]/)[0].trim();
          return { name: n && n.length > 2 ? n : nameAusUrl(u.url), url: u.url };
        });
      }

      var seen = {};
      var liste = [];
      gueltig.forEach(function(h) {
        var u = h.url.split("?")[0];
        if (seen[u]) return;
        seen[u] = 1;
        var name = (h.name || "").trim() || nameAusUrl(u);
        var stadt = (h.stadt || "").trim() || wunsch.ort;
        rememberHotel(name, stadt, u);
        liste.push({ name: name, ort: stadt, url: track(u), fakten: (h.fakten || "").trim() });
      });
      liste = liste.slice(0, mehrereOrte ? 3 : 3 - eigene.length);

      setExternal(liste);

      // ===== SCHRITT 4: Antwort formulieren =====
      // Eigener Aufruf, weil ein Modell, das gerade recherchiert hat,
      // Aufzaehlungen statt Empfehlungen schreibt. Hier zaehlt nur Sprache,
      // deshalb das staerkere Modell.
      var haeuser = eigene.map(function(h) {
        return "- " + h.name + " (" + h.city + "): " + h.tags.join(", ");
      }).concat(liste.map(function(h) {
        return "- " + h.name + (h.ort ? " (" + h.ort + ")" : "") + (h.fakten ? ": " + h.fakten : "");
      }));

      var antwort = "";
      if (haeuser.length) {
        try {
          var formulieren = await frage(
            "Du bist Hotel-Concierge auf MySpecialHotel.com und schreibst die Antwort " +
            "an einen Gast. Nur Fliesstext, kein Markdown, keine Aufzaehlung mit Strichen.\n\n" +
            "SO SCHREIBST DU:\n" +
            "Beziehe dich auf das, was der Gast wollte, und erklaere zu jedem Haus in " +
            "einem Satz, warum es dazu passt. Nicht aufzaehlen, sondern empfehlen - " +
            "ein Gefaehrte, der etwas vorschlaegt, kein Suchergebnis.\n" +
            "Nutze nur die unten genannten Fakten. Erfinde nichts dazu, " +
            "besonders keine Preise und keine Bewertungen.\n" +
            "Zwei bis vier Saetze, warm und konkret. Am Ende hoechstens EINE kurze " +
            "Rueckfrage, die weiterhilft - oder gar keine.\n" +
            "Erwaehne nicht, dass du gesucht hast, und sprich nie ueber die Suche selbst.\n" +
            "Die Buttons zum Buchen erscheinen automatisch unter deinem Text - " +
            "erwaehne sie nicht und schreibe keine Links.\n\n" +
            "GEFUNDENE HAEUSER:\n" + haeuser.join("\n"),
            verlauf.concat([{
              role: "user",
              content: "Schreibe jetzt die Antwort auf meine letzte Nachricht."
            }]),
            false,
            "claude-sonnet-4-6"
          );
          antwort = stripMarkers((formulieren.text || "").trim());
        } catch (e) {
          antwort = "";
        }
      }

      if (!antwort) {
        antwort = haeuser.length
          ? "Hier sind passende Unterkuenfte in " + wunsch.ort + "."
          : "In " + wunsch.ort + " findest du die aktuelle Auswahl direkt bei Booking.";
      }

      setMsgs(function(p) { return p.concat([{ role: "assistant", text: antwort }]); });

    } catch (e) {
      setMsgs(function(p) { return p.concat([{
        role: "assistant",
        text: "Da ist gerade etwas schiefgelaufen. Versuch es bitte nochmal."
      }]); });
    }
    setLoading(false);
  };

  var hints = ["Spa-Hotel Tirol bis 200 EUR", "Boutique Hotel Lissabon", "Strandurlaub Griechenland", "Staedtetrip Kopenhagen"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map(function(m, i) {
          return (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
              {m.role === "assistant" && (
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: ACCENT_LIGHT, border: "1px solid #e9d06a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>AI</div>
              )}
              <div style={{ maxWidth: "78%", padding: "11px 15px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? ACCENT : "#f9fafb", color: m.role === "user" ? "#fff" : TEXT, fontSize: 14, lineHeight: 1.65, whiteSpace: "pre-wrap", border: m.role === "assistant" ? "1px solid " + BORDER : "none", fontFamily: "Inter, sans-serif" }}>{m.text}</div>
            </div>
          );
        })}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: ACCENT_LIGHT, border: "1px solid #e9d06a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>AI</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, padding: "11px 15px", background: "#f9fafb", border: "1px solid " + BORDER, borderRadius: "18px 18px 18px 4px" }}>
              <div style={{ display: "flex", gap: 5 }}>
              {[0,1,2].map(function(i) { return <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT, animation: "bounce 1.2s " + (i * 0.2) + "s infinite" }} />; })}
              </div>
              <div style={{ fontSize: 11, color: GRAY }}>Suche passende Hotels...</div>
            </div>
          </div>
        )}
        {suggested.length > 0 && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
            <div style={{ fontSize: 12, color: ACCENT, fontWeight: 600, fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>Passende Hotels fuer dich</div>
            {suggested.map(function(h) { return <HotelCard key={h.id} hotel={h} highlight={true} />; })}
          </div>
        )}
        {external.length > 0 && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 6 }}>
            <div style={{ fontSize: 11, color: ACCENT, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Weitere Empfehlungen</div>
            {external.map(function(h, i) {
              return (
                <a key={i} href={h.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "#fff", border: "1.5px solid " + BORDER, borderRadius: 14, padding: "14px 16px", textDecoration: "none", transition: "all 0.2s" }} onMouseEnter={function(e){e.currentTarget.style.borderColor=ACCENT;}} onMouseLeave={function(e){e.currentTarget.style.borderColor=BORDER;}}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 2 }}>{h.name}</div>
                    <div style={{ fontSize: 12, color: GRAY }}>{h.ort}</div>
                  </div>
                  <span className="btn-gold" style={{ padding: "9px 17px", fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>Suchen →</span>
                </a>
              );
            })}
          </div>
        )}
        {searchLink && !loading && (
          <a href={searchLink.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 6, background: ACCENT_LIGHT, border: "1px solid #e9d06a", borderRadius: 14, padding: 16, textDecoration: "none" }}>
            <div style={{ fontSize: 11, color: ACCENT, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Mehr Auswahl</div>
            <div style={{ fontSize: 15, color: TEXT, fontWeight: 600, marginBottom: 4 }}>Alle Unterkuenfte in {searchLink.ort}</div>
            <div style={{ fontSize: 12, color: GRAY }}>Live-Preise und Verfuegbarkeit ansehen →</div>
          </a>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "14px 20px", borderTop: "1px solid " + BORDER, background: "#fff" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={input} onChange={function(e) { setInput(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") send(); }} placeholder="z.B. Wellness Hotel Alpen, Budget 150 EUR" style={{ flex: 1, background: "#f9fafb", border: "1px solid " + BORDER, borderRadius: 10, padding: "11px 14px", color: TEXT, fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif" }} />
          <button onClick={send} disabled={loading || !input.trim()} className="btn-gold" style={{ fontSize: 18, padding: "11px 18px" }}>Senden</button>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {hints.map(function(s) { return <button key={s} onClick={function() { setInput(s); }} style={{ background: ACCENT_LIGHT, border: "1px solid #e9d06a", borderRadius: 16, padding: "4px 12px", color: ACCENT, fontSize: 12, cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{s}</button>; })}
        </div>
      </div>
    </div>
  );
}

// Zeigt die taeglich per Websuche gefundenen Unterkuenfte.
// Die Daten kommen aus /api/deals und liegen dort 24 Stunden im
// Zwischenspeicher - der Aufruf hier kostet also nichts extra.
function TaeglicheListe({ typ }) {
  var [daten, setDaten] = useState(null);

  useEffect(function() {
    var abgebrochen = false;
    fetch("/api/deals?typ=" + typ)
      .then(function(r) { return r.json(); })
      .then(function(d) { if (!abgebrochen) setDaten(d); })
      .catch(function() { if (!abgebrochen) setDaten({ hotels: [] }); });
    return function() { abgebrochen = true; };
  }, [typ]);

  if (daten === null) {
    return (
      <div style={{ textAlign: "center", padding: "44px 0", color: GRAY, fontSize: 14 }}>
        <div style={{ display: "inline-flex", gap: 5, marginBottom: 12 }}>
          {[0,1,2].map(function(i) {
            return <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT, animation: "bounce 1.2s " + (i * 0.2) + "s infinite" }} />;
          })}
        </div>
        <div>Aktuelle Auswahl wird geladen...</div>
      </div>
    );
  }

  var hotels = Array.isArray(daten.hotels) ? daten.hotels : [];

  if (hotels.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "36px 24px", background: "#f9fafb", border: "1px solid " + BORDER, borderRadius: 16, color: GRAY, fontSize: 14 }}>
        Die aktuelle Auswahl ist gerade nicht verfuegbar. Schau spaeter nochmal vorbei oder nutze den KI-Berater.
      </div>
    );
  }

  // Zeitraum an den Link haengen: so zeigt Booking echte Preise
  // fuer die kommenden Tage statt allgemeiner Listenpreise.
  var z = daten.zeitraum || {};
  var mitDatum = function(url) {
    var u = url;
    if (z.checkin && z.checkout) {
      u += (u.indexOf("?") === -1 ? "?" : "&")
        + "checkin=" + z.checkin + "&checkout=" + z.checkout
        + "&selected_currency=EUR&lang=de";
    }
    return track(u);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }} className="hotel-grid">
        {hotels.map(function(h, i) {
          return (
            <a key={i} href={mitDatum(h.url)} target="_blank" rel="noopener noreferrer"
               className="card"
               style={{ display: "block", background: "#fff", border: "1px solid " + BORDER, borderRadius: 16, overflow: "hidden", textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ position: "relative", height: 150, overflow: "hidden", background: "linear-gradient(135deg,#e8dcc0,#c9a961)" }}>
                {h.bild && <img src={h.bild} alt={h.stadt} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 10, left: 12, color: "#fff", fontSize: 13, fontWeight: 600, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                  {h.stadt}{h.land ? ", " + h.land : ""}
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: TEXT, marginBottom: 6, lineHeight: 1.3 }}>{h.name}</div>
                {h.beschreibung && <div style={{ fontSize: 13, color: GRAY, lineHeight: 1.55, marginBottom: 14 }}>{h.beschreibung}</div>}
                <span className="btn-gold" style={{ display: "inline-block", padding: "9px 18px", fontSize: 12 }}>Preis ansehen →</span>
              </div>
            </a>
          );
        })}
      </div>

      {z.checkin && (
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: GRAY, lineHeight: 1.6 }}>
          Preise werden fuer {z.checkin.split("-").reverse().join(".")} bis {z.checkout.split("-").reverse().join(".")} angezeigt.<br />
          Aktuelle Verfuegbarkeit und Preis siehst du bei Booking.com.
        </div>
      )}
    </div>
  );
}

function WorldSearch() {
  var [ort, setOrt] = useState("");
  var [checkin, setCheckin] = useState("");
  var [checkout, setCheckout] = useState("");
  var [gaeste, setGaeste] = useState(2);

  var go = function() {
    if (!ort.trim()) return;
    window.open(searchUrl({ ort: ort, checkin: checkin, checkout: checkout, erwachsene: gaeste }), "_blank");
  };

  var inp = { background: "#f9fafb", border: "1px solid " + BORDER, borderRadius: 10, padding: "12px 14px", fontSize: 14, fontFamily: "Inter, sans-serif", color: TEXT, outline: "none", width: "100%" };

  return (
    <div className="world-search" style={{ background: "#fff", border: "1px solid " + BORDER, borderRadius: 20, padding: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 800, color: TEXT, marginBottom: 8 }}>Wohin soll es gehen?</div>
        <div style={{ fontSize: 14, color: GRAY }}>Über 2 Millionen Unterkünfte weltweit durchsuchen</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12, maxWidth: 800, margin: "0 auto" }}>
        <input value={ort} onChange={function(e){setOrt(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")go();}} placeholder="Wohin? z.B. Lissabon" style={inp} />
        <input type="date" value={checkin} onChange={function(e){setCheckin(e.target.value);}} style={inp} />
        <input type="date" value={checkout} onChange={function(e){setCheckout(e.target.value);}} style={inp} />
        <select value={gaeste} onChange={function(e){setGaeste(e.target.value);}} style={inp}>
          <option value="1">1 Gast</option>
          <option value="2">2 Gäste</option>
          <option value="3">3 Gäste</option>
          <option value="4">4 Gäste</option>
          <option value="6">6 Gäste</option>
        </select>
      </div>
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button onClick={go} disabled={!ort.trim()} className="btn-gold" style={{ padding: "13px 40px", fontSize: 15 }}>Unterkünfte suchen</button>
      </div>
    </div>
  );
}

export default function App() {
  var [tab, setTab] = useState("home");
  var [cookieAccepted, setCookieAccepted] = useState(
    typeof window !== "undefined" && localStorage.getItem("msh_cookies") === "true"
  );
  var [cat, setCat] = useState("all");
  var [search, setSearch] = useState("");

  var filtered = HOTELS.filter(function(h) {
    var matchCat = cat === "all" || h.cat === cat;
    var q = search.toLowerCase();
    var matchSearch = q === "" || h.name.toLowerCase().includes(q) || h.city.toLowerCase().includes(q) || h.country.toLowerCase().includes(q) || h.tags.some(function(t) { return t.toLowerCase().includes(q); });
    return matchCat && matchSearch;
  });
  var nomads = HOTELS.filter(function(h) { return h.nomad; });

  var TABS = [["home","Start"],["nomad","Nomad"],["ai","KI-Berater"]];
  var CATS = [["all","Alle"],["wellness","Wellness"],["design","Design"],["luxury","Luxus"],["nomad","Nomad"]];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: TEXT, fontFamily: "Inter, sans-serif" }}>
      <style>{css}</style>

      <nav className="nav">
        <button onClick={function() { setTab("home"); }} className="nav-logo">
          My<span style={{ color: ACCENT }}>Special</span>Hotel
        </button>
        <div className="nav-tabs">
          {TABS.map(function(item) {
            var id = item[0]; var label = item[1];
            return <button key={id} onClick={function() { setTab(id); }} className={"tab-btn" + (tab === id ? " tab-on" : "")}>{label}</button>;
          })}
        </div>
      </nav>

      {tab === "home" && (
        <div>
          <div className="hero">
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.12 }} />
            <div style={{ position: "relative", zIndex: 1, animation: "fadeUp 0.7s ease forwards", width: "100%" }}>
              <div style={{ display: "inline-block", background: ACCENT_LIGHT, border: "1px solid #e9d06a", borderRadius: 20, padding: "5px 16px", fontSize: 12, color: ACCENT, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24 }}>Dein smarter Hotel-Begleiter</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px,7vw,80px)", fontWeight: 900, lineHeight: 1.08, color: TEXT, marginBottom: 20 }} className="hero-title">
                Dein perfektes<br /><span style={{ color: ACCENT }}>Hotel</span>, jederzeit.
              </h1>
              <p style={{ fontSize: 18, color: GRAY, maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.7 }}>KI-Beratung - kuratierte Hotels - Nomad-Unterkuenfte.<br />Alles an einem Ort, kostenlos und ehrlich.</p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }} className="hero-buttons">
                <button onClick={function() { setTab("ai"); }} className="btn-gold" style={{ fontSize: 15, padding: "14px 28px", borderRadius: 12, boxShadow: "0 4px 20px rgba(201,150,12,0.3)" }}>KI-Berater starten</button>
                <button onClick={function() { setTab("nomad"); }} style={{ background: "#fff", border: "1.5px solid " + BORDER, borderRadius: 12, padding: "14px 28px", color: TEXT, fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Nomad Hotels</button>
              </div>
            </div>
          </div>
          <div className="stats">
            {[["8","Kuratierte Hotels"],["2 Mio+","Unterkuenfte"],["Taeglich","Neue Auswahl"],["100%","Kostenlos"]].map(function(item) {
              return <div key={item[1]} className="stat">
                <div className="stat-n">{item[0]}</div>
                <div className="stat-l">{item[1]}</div>
              </div>;
            })}
          </div>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 24px 0" }} className="page-padding">
            <WorldSearch />
          </div>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }} className="page-padding">
            <h2 className="section-h" style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: TEXT, marginBottom: 24, textAlign: "center", scrollMarginTop: 80 }}>Unsere kuratierte Auswahl</h2>
            <div style={{ maxWidth: 500, margin: "0 auto 28px", position: "relative" }} className="search-bar">
              <input
                value={search}
                onChange={function(e) { setSearch(e.target.value); }}
                placeholder="Hotel, Stadt oder Land suchen..."
                style={{ width: "100%", padding: "13px 20px 13px 46px", border: "1.5px solid " + BORDER, borderRadius: 50, fontSize: 15, fontFamily: "Inter, sans-serif", color: TEXT, outline: "none", background: "#f9fafb", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              />
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 18, color: GRAY }}>&#128269;</span>
              {search && (
                <button onClick={function() { setSearch(""); }} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: GRAY }}>&#x2715;</button>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }} className="filter-row">
              {CATS.map(function(item) {
                var c = item[0]; var l = item[1];
                return <button key={c} onClick={function() { setCat(c); }} style={{ background: cat===c ? ACCENT : "#fff", border: "1.5px solid " + (cat===c ? ACCENT : BORDER), borderRadius: 24, padding: "7px 18px", color: cat===c ? "#fff" : GRAY, cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: cat===c ? 600 : 400, fontSize: 13, transition: "all 0.15s" }}>{l}</button>;
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }} className="hotel-grid">
              {filtered.map(function(h) { return <HotelCard key={h.id} hotel={h} />; })}
            </div>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: GRAY }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>&#128269;</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: TEXT, marginBottom: 8 }}>Kein Hotel gefunden</div>
                <div style={{ fontSize: 14 }}>Versuche einen anderen Suchbegriff oder</div>
                <button onClick={function() { setSearch(""); setCat("all"); }} style={{ marginTop: 12, background: ACCENT, color: "#fff", border: "none", borderRadius: 20, padding: "8px 20px", cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>Suche zurücksetzen</button>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "nomad" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }} className="page-padding">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "5px 16px", fontSize: 12, color: "#10b981", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Remote Work Freundlich</div>
            <h2 className="section-h" style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: TEXT }}>Nomad Hotels</h2>
            <p style={{ color: GRAY, marginTop: 10, fontSize: 16 }}>Gigabit WLAN - Coworking - Dedizierte Arbeitsbereiche</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 20, marginBottom: 40, background: "#f9fafb", borderRadius: 16, padding: 28, border: "1px solid " + BORDER }} className="nomad-features">
            {[["WLAN","Gigabit WLAN","Schnelles Internet ueberall"],["Desk","Coworking","Professionelle Arbeitsbereiche"],["Globe","Top-Staedte","Hotels in Europa und weltweit"]].map(function(item) {
              return <div key={item[1]} style={{ textAlign: "center", padding: 16 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{item[0]}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 5 }}>{item[1]}</div>
                <div style={{ fontSize: 13, color: GRAY }}>{item[2]}</div>
              </div>;
            })}
          </div>
          <TaeglicheListe typ="nomad" />

          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: TEXT, margin: "48px 0 20px", textAlign: "center" }}>Unsere Empfehlungen</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 20 }} className="hotel-grid">
            {nomads.map(function(h) { return <HotelCard key={h.id} hotel={h} />; })}
          </div>
        </div>
      )}

      {tab === "ai" && (
        <div style={{ maxWidth: 780, margin: "0 auto", padding: 24, height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h2 className="section-h" style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: TEXT }}>KI Hotel-Berater</h2>
            <p style={{ color: GRAY, fontSize: 14, marginTop: 6 }}>Beschreib deinen Traumurlaub, ich empfehle das perfekte Hotel</p>
          </div>
          <div style={{ flex: 1, background: "#fff", border: "1.5px solid " + BORDER, borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            <AIChat />
          </div>
        </div>
      )}

      {tab === "impressum" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
          <button onClick={function() { setTab("home"); }} style={{ marginBottom: 24, background: "none", border: "1px solid " + BORDER, borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: GRAY, fontFamily: "Inter, sans-serif", fontSize: 13 }}>← Zurück</button>
          <h1 className="section-h" style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: TEXT, marginBottom: 32 }}>Impressum</h1>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8 }}>Angaben gemäß § 5 TMG</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Fernando Arias Texeira<br />Alsbacher Weg 3<br />14163 Berlin<br />Deutschland</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>Kontakt</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Telefon: +49 163 5946140<br />E-Mail: info@myspecialhotel.com</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>Steuerliche Angaben</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Steuernummer: 25/211/01529<br />Zuständiges Finanzamt: Finanzamt Berlin</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>Tätigkeitsbeschreibung</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Betrieb einer Internetplattform für Hotelempfehlungen und Affiliate-Marketing</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>Hinweis zu Affiliate-Links</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Diese Website enthält Affiliate-Links. Bei einer Buchung über unsere Links erhalten wir eine Provision von unseren Partnern (z.B. Booking.com). Für dich entstehen dabei keine Mehrkosten.</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>Haftungsausschluss</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>MySpecialHotel.com vermittelt ausschließlich Hotelempfehlungen. Vertragspartner bei einer Buchung ist das jeweilige Hotel bzw. die Buchungsplattform (z.B. Booking.com), nicht MySpecialHotel.com. Wir übernehmen keine Haftung für die Richtigkeit der Hotelinformationen oder den Ablauf der Buchung.</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>EU-Streitschlichtung</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit: https://ec.europa.eu/consumers/odr. Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          <p style={{ color: GRAY, fontSize: 13, marginTop: 32, fontStyle: "italic" }}>Stand: Juli 2026</p>
        </div>
      )}

      {tab === "datenschutz" && (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px" }}>
          <button onClick={function() { setTab("home"); }} style={{ marginBottom: 24, background: "none", border: "1px solid " + BORDER, borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: GRAY, fontFamily: "Inter, sans-serif", fontSize: 13 }}>← Zurück</button>
          <h1 className="section-h" style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: TEXT, marginBottom: 32 }}>Datenschutzerklärung</h1>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8 }}>1. Verantwortlicher</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Fernando Arias Texeira<br />Alsbacher Weg 3, 14163 Berlin<br />E-Mail: info@myspecialhotel.com<br />Telefon: +49 163 5946140</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>2. Hosting (Vercel)</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Diese Website wird gehostet von Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA. Beim Besuch werden automatisch Server-Log-Dateien erfasst (IP-Adresse, Browsertyp, Betriebssystem, Datum/Uhrzeit). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Mit Vercel wurde ein AVV gemäß Art. 28 DSGVO geschlossen.</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>3. Affiliate-Links (Booking.com)</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Diese Website enthält Affiliate-Links zu Booking.com (Booking.com B.V., Herengracht 597, 1017 CE Amsterdam, Niederlande). Bei Buchung über einen solchen Link erhalten wir eine Provision. Für dich entstehen keine Mehrkosten. Booking.com kann beim Klick Cookies setzen und dein Verhalten tracken. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Weitere Infos: www.booking.com/content/privacy.html</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>4. KI-Chat (Anthropic Claude API)</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Unser KI-Hotel-Berater nutzt die Claude API von Anthropic, PBC (548 Market St, San Francisco, CA 94104, USA). Deine Texteingaben werden zur Verarbeitung an Anthropic übertragen. Chatverläufe werden nicht dauerhaft auf unseren Servern gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO. Weitere Infos: https://www.anthropic.com/privacy</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>5. Affiliate-Netzwerk (CJ Affiliate)</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Die Vermittlung unserer Buchungslinks erfolgt über das Affiliate-Netzwerk CJ Affiliate (Commission Junction LLC, 530 East Montecito Street, Santa Barbara, CA 93103, USA). Beim Klick auf einen Buchungslink wirst du kurzzeitig über einen Server von CJ Affiliate (z.&nbsp;B. kqzyfj.com, anrdoezrs.net) weitergeleitet. Dabei werden deine IP-Adresse, Datum und Uhrzeit sowie die aufgerufene Seite verarbeitet und ein Cookie gesetzt, damit eine spätere Buchung uns zugeordnet werden kann. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Provisionsabrechnung). Die Übermittlung in die USA erfolgt auf Grundlage von Standardvertragsklauseln. Weitere Infos: https://www.cj.com/legal/privacy-policy-april-2020</p>

          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>6. Bilder (Unsplash)</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Die auf dieser Website gezeigten Fotos werden von Servern der Unsplash Inc. (2-30 Duncan Street, Toronto, ON M5V 2C3, Kanada) geladen. Beim Aufruf einer Seite mit Bildern wird deine IP-Adresse an Unsplash übertragen. Für Kanada besteht ein Angemessenheitsbeschluss der EU-Kommission. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer ansprechenden Darstellung). Weitere Infos: https://unsplash.com/privacy</p>

          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>7. Hinweis zu Preisen und Bewertungen</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Wir zeigen auf dieser Website keine eigenen Preisangaben und keine eigenen Bewertungen an. Aktuelle Preise, Verfügbarkeiten und Gästebewertungen werden ausschließlich von Booking.com bereitgestellt und sind erst nach dem Klick auf einen Buchungslink dort einsehbar. Unsere Hotelauswahl stellt eine redaktionelle Empfehlung dar.</p>

          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>8. Cookies</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Wir setzen ausschließlich technisch notwendige Cookies ein (Speicherung deiner Cookie-Einwilligung via localStorage). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Affiliate-Links zu Booking.com können nach dem Klick zu Drittanbieter-Cookies führen, auf die wir keinen Einfluss haben.</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>9. Deine Rechte (Art. 15–22 DSGVO)</h2>
          <ul style={{ color: GRAY, lineHeight: 2.2, fontSize: 15, paddingLeft: 24 }}>
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
          </ul>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15, marginTop: 12 }}>Anfragen an: info@myspecialhotel.com. Beschwerderecht bei der Berliner Beauftragten für Datenschutz und Informationsfreiheit.</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>10. Änderungen</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren.</p>
          <p style={{ color: GRAY, fontSize: 13, marginTop: 32, fontStyle: "italic" }}>Stand: Juli 2026</p>
        </div>
      )}

      <footer style={{ marginTop: 80, padding: "32px 24px", borderTop: "1px solid " + BORDER, textAlign: "center", color: GRAY, fontSize: 12, background: "#f9fafb" }} className="footer-inner">
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 10 }}>My<span style={{ color: ACCENT }}>Special</span>Hotel.com</div>
        <p>* Affiliate-Links: Bei Buchung über unsere Links erhalten wir eine Provision – für dich entstehen keine Mehrkosten.</p>
        <p style={{ marginTop: 8 }}>
          © 2026 MySpecialHotel.com &nbsp;·&nbsp;
          <span onClick={function() { setTab("impressum"); }} style={{ cursor: "pointer", textDecoration: "underline", color: ACCENT }}>Impressum</span>
          &nbsp;·&nbsp;
          <span onClick={function() { setTab("datenschutz"); }} style={{ cursor: "pointer", textDecoration: "underline", color: ACCENT }}>Datenschutz</span>
        </p>
      </footer>

      {!cookieAccepted && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999, background: "#fff", borderTop: "2px solid " + BORDER, padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, boxShadow: "0 -4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div style={{ fontWeight: 700, color: TEXT, fontSize: 15, marginBottom: 4 }}>🍪 Diese Website verwendet Cookies</div>
            <p style={{ color: GRAY, fontSize: 13, lineHeight: 1.6 }}>
              Wir nutzen technisch notwendige Cookies. Affiliate-Links zu Booking.com können Tracking-Cookies setzen.
              Mehr dazu in unserer{" "}
              <span onClick={function() { setTab("datenschutz"); }} style={{ color: ACCENT, cursor: "pointer", textDecoration: "underline" }}>Datenschutzerklärung</span>.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={function() { setCookieAccepted(true); localStorage.setItem("msh_cookies", "true"); }} style={{ background: ACCENT, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14 }}>
              Alle akzeptieren
            </button>
            <button onClick={function() { setCookieAccepted(true); localStorage.setItem("msh_cookies", "true"); }} style={{ background: "#fff", color: GRAY, border: "1px solid " + BORDER, borderRadius: 8, padding: "10px 24px", fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14 }}>
              Nur notwendige
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
