import { useState, useRef, useEffect } from "react";

const HOTELS = [
  { id: 1, name: "Mont Cervin Palace", city: "Zermatt", country: "Schweiz", price: 320, originalPrice: 480, rating: 4.8, reviews: 1243, img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80", tags: ["Wellness", "Berge", "Luxus"], lastMinute: true, nomad: false, cat: "wellness", url: "https://www.booking.com/hotel/ch/mont-cervin-palace.de.html" },
  { id: 2, name: "25hours Hotel Bikini Berlin", city: "Berlin", country: "Deutschland", price: 119, originalPrice: 119, rating: 4.6, reviews: 3892, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", tags: ["Nomad", "Design", "Zentral"], lastMinute: false, nomad: true, cat: "nomad", url: "https://www.booking.com/hotel/de/25hours-bikini-berlin.de.html" },
  { id: 3, name: "Hotel Negresco", city: "Nizza", country: "Frankreich", price: 280, originalPrice: 420, rating: 4.7, reviews: 2156, img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80", tags: ["Meer", "Luxus", "Historisch"], lastMinute: true, nomad: false, cat: "luxury", url: "https://www.booking.com/hotel/fr/negresco.de.html" },
  { id: 4, name: "25hours Hotel MuseumsQuartier", city: "Wien", country: "Oesterreich", price: 89, originalPrice: 89, rating: 4.5, reviews: 2445, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", tags: ["Nomad", "Design", "Zentral"], lastMinute: false, nomad: true, cat: "nomad", url: "https://www.booking.com/hotel/at/25hours-beim-museumsquartier.de.html" },
  { id: 5, name: "Gritti Palace Venice", city: "Venedig", country: "Italien", price: 650, originalPrice: 950, rating: 4.9, reviews: 1876, img: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80", tags: ["Luxus", "Romantik", "Historisch"], lastMinute: true, nomad: false, cat: "luxury", url: "https://www.booking.com/hotel/it/the-gritti-palace.de.html" },
  { id: 6, name: "Dollenberg Relais & Chateaux", city: "Bad Peterstal", country: "Deutschland", price: 195, originalPrice: 260, rating: 4.8, reviews: 1334, img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80", tags: ["Wellness", "Spa", "Natur"], lastMinute: true, nomad: false, cat: "wellness", url: "https://www.booking.com/hotel/de/dollenberg.de.html" },
  { id: 7, name: "Casa Camper Barcelona", city: "Barcelona", country: "Spanien", price: 145, originalPrice: 145, rating: 4.7, reviews: 2891, img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", tags: ["Design", "Nomad", "Zentral"], lastMinute: false, nomad: true, cat: "nomad", url: "https://www.booking.com/hotel/es/casa-camper-barcelona.de.html" },
  { id: 8, name: "Interalpen-Hotel Tyrol", city: "Telfs", country: "Oesterreich", price: 280, originalPrice: 380, rating: 4.9, reviews: 2134, img: "https://images.unsplash.com/photo-1540541338537-1220059af4dc?w=800&q=80", tags: ["Wellness", "Spa", "Berge"], lastMinute: true, nomad: false, cat: "wellness", url: "https://www.booking.com/hotel/at/interalpen-hotel-tyrol.de.html" },
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

// Entfernt Marker, Markdown und entschuldigende Saetze.
// Der Prompt allein verhindert Formulierungen wie "leider haben wir kein..."
// nicht zuverlaessig - deshalb hier deterministisch nachraeumen.
// Vertroestungen entfernen. Saetze wie "Lass mich suchen" sind wertlos,
// weil die Suche in derselben Antwort bereits passiert sein muss.
var VERTROESTUNG = [
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

// Begrenzt Rueckfragen auf eine pro Antwort.
// Mehrere Fragen auf einmal erzeugen Tipparbeit und Absprung -
// eine Rueckfrage nach einer Empfehlung ist dagegen wertvoll,
// weil sie zur naechsten Runde und damit zur Buchung fuehrt.
function limitFragen(text) {
  var saetze = text.split(/(?<=[.!?])\s+/);
  var gesehen = false;
  var out = saetze.filter(function(s) {
    if (s.indexOf("?") === -1) return true;
    if (gesehen) return false;
    gesehen = true;
    return true;
  });
  var r = out.join(" ").trim();
  return r.length > 0 ? r : text;
}

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

// Liest ein Preislimit aus dem Gespraech.
// Explizite Zahlen haben Vorrang, sonst greifen Signalwoerter.
function budgetAus(texte) {
  var alles = texte.join(" ").toLowerCase();
  var m = alles.match(/(?:bis|unter|max(?:imal)?|hoechstens|höchstens)\s*(\d{2,4})/);
  if (m) return parseInt(m[1], 10);
  m = alles.match(/(\d{2,4})\s*(?:eur|euro|€)/);
  if (m) return parseInt(m[1], 10);
  if (/m[oö]glichst billig|sehr billig|ganz billig|super billig|spottbillig/.test(alles)) return 60;
  if (/\bbillig|g[uü]nstig|preiswert|low ?budget|wenig geld|schmales budget/.test(alles)) return 90;
  return null;
}

// Baut aus einer Booking-URL einen lesbaren Hotelnamen,
// falls das Modell nur den Link ohne Namen geliefert hat.
function nameAusUrl(u) {
  try {
    var teil = u.split("/hotel/")[1].split("/")[1] || "";
    teil = teil.split("?")[0].replace(/\.(de|en|[a-z]{2})?\.?html?$/i, "");
    var w = teil.split("-").filter(Boolean).map(function(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    });
    return w.join(" ") || "Unterkunft ansehen";
  } catch (e) { return "Unterkunft ansehen"; }
}

function cleanQuery(name) {
  // Nur der reine Hotelname. Haengt man die Stadt an,
  // interpretiert Booking das als Stadtsuche und zeigt fremde Hotels.
  var n = (name || "").split(/ - |, | \(| \| /)[0].trim();
  n = n.split(" ").slice(0, 6).join(" ");
  n = n.replace(/\s+(and|und|&|the|by|at|in)$/i, "").trim();
  return n;
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
  if (params.maxPreis) u += "&nflt=price%3DEUR-min-" + params.maxPreis + "-1";
  u += "&selected_currency=EUR&lang=de";
  return track(u);
}

function HotelCard({ hotel, highlight }) {
  const disc = Math.round((1 - hotel.price / hotel.originalPrice) * 100);
  const url = track(hotel.url);
  return (
    <div className="card" style={{ background: "#fff", border: "1px solid " + (highlight ? ACCENT : BORDER), borderRadius: 16, overflow: "hidden", boxShadow: highlight ? "0 0 0 2px " + ACCENT + "22" : "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ position: "relative", height: 190 }}>
        <img src={hotel.img} alt={hotel.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" }} />
        {hotel.lastMinute && <span style={{ position: "absolute", top: 12, left: 12, background: "#ef4444", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Blitz LAST MINUTE</span>}
        {hotel.nomad && <span style={{ position: "absolute", top: 12, left: 12, background: "#10b981", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>Laptop NOMAD</span>}
        {disc > 0 && <span style={{ position: "absolute", top: 12, right: 12, background: "#ef4444", color: "#fff", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 800 }}>-{disc}%</span>}
        <span style={{ position: "absolute", bottom: 10, left: 12, color: "#fff", fontSize: 12, fontFamily: "Inter, sans-serif" }}>{hotel.city}, {hotel.country}</span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8 }}>{hotel.name}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {hotel.tags.map(function(t) { return <span key={t} style={{ background: ACCENT_LIGHT, color: ACCENT, padding: "2px 8px", borderRadius: 8, fontSize: 11, fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{t}</span>; })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{ color: ACCENT, fontSize: 13, fontFamily: "Inter, sans-serif", marginBottom: 2 }}>
              Stern {hotel.rating} <span style={{ color: GRAY, fontSize: 11 }}>({hotel.reviews} Bewertungen)</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: TEXT }}>EUR{hotel.price}</span>
              {disc > 0 && <span style={{ fontSize: 12, color: "#9ca3af", textDecoration: "line-through", fontFamily: "Inter, sans-serif" }}>EUR{hotel.originalPrice}</span>}
              <span style={{ fontSize: 11, color: GRAY, fontFamily: "Inter, sans-serif" }}>/Nacht</span>
            </div>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ padding: "9px 18px", fontSize: 12 }}>Buchen →</a>
        </div>
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

  var send = async function() {
    if (!input.trim() || loading) return;
    var q = input.trim();
    setInput("");
    setMsgs(function(p) { return [...p, { role: "user", text: q }]; });
    setLoading(true);
    setSuggested([]);
    setSearchLink(null);
    setExternal([]);

    var history = msgs
      .filter(function(m, i) { return !(i === 0 && m.role === "assistant"); })
      .filter(function(m) { return m.text && m.text.trim().length > 0; })
      .map(function(m) {
        return { role: m.role === "user" ? "user" : "assistant", content: m.text.trim() };
      })
      .slice(-12);
    while (history.length > 0 && history[0].role !== "user") history.shift();
    history.push({ role: "user", content: q });

    // Absicherung fuer kleinere Modelle: Was der Gast bisher gesagt hat,
    // nochmal gebuendelt in den Prompt - nicht nur im Verlauf vergraben.
    var gesagt = msgs
      .filter(function(m) { return m.role === "user" && m.text && m.text.trim(); })
      .map(function(m) { return m.text.trim(); })
      .slice(-6);
    gesagt.push(q);
    var profil = gesagt.length > 1
      ? "\n\nDER GAST HAT BISHER GESAGT (alles davon ist bekannt, nicht erneut fragen):\n- " + gesagt.join("\n- ") + "\n"
      : "";

    // Bereits bekannte Hotels mitgeben - dann muss die KI dafuer nicht suchen
    var limit = budgetAus(gesagt);
    var budgetHinweis = limit
      ? "\n\nPREISLIMIT DES GASTES: maximal ca. " + limit + " EUR pro Nacht. Empfiehl NICHTS Teureres - lieber ein einfacheres Haus als ein zu teures.\n"
      : "";

    var bekannt = Object.keys(KNOWN_HOTELS).slice(0, 60).map(function(k) {
      var h = KNOWN_HOTELS[k];
      return h.name + " | " + (h.stadt || "") + " | " + h.url;
    });
    var bekanntBlock = bekannt.length > 0
      ? "\n\nBEREITS BEKANNTE HOTELS (URL schon vorhanden - hier NICHT suchen, URL direkt uebernehmen):\n" + bekannt.join("\n") + "\n"
      : "";

    var hotelContext = HOTELS.map(function(h) {
      return "ID:" + h.id + " | " + h.name + " | " + h.city + ", " + h.country + " | EUR" + h.price + "/Nacht | Tags: " + h.tags.join(", ") + " | LastMinute:" + h.lastMinute + " | Nomad:" + h.nomad + " | Kategorie:" + h.cat;
    }).join("\n");

    try {
      var res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 900,
          system: "Du bist Hotel-Concierge auf MySpecialHotel.com. Deutsch, max 4 Saetze, kein Markdown.\n\nOBERSTE REGEL - JEDE ANTWORT LIEFERT LINKS:\nJede einzelne Antwort MUSS mindestens einen Hotel-Marker enthalten ([HOTELS:...] oder [HOTEL:...]). Eine Antwort ohne Marker ist wertlos.\nEs ist VERBOTEN, einen Hotelnamen im Text zu nennen, ohne ihn zugleich als Marker auszugeben. Nennen ohne Link hilft niemandem.\nVertroeste nie auf spaeter. Schreibe NIE Saetze wie 'Lass mich suchen', 'Ich suche dir gleich' oder 'Sag Bescheid, dann schicke ich Links'. Suche sofort und liefere in derselben Antwort.\n\nAUCH BEI VAGEN ANFRAGEN SOFORT LIEFERN:\nIst das Ziel unklar, waehle selbst das naheliegendste und liefere direkt 2-3 Hotels mit Links. Erst danach eine kurze Rueckfrage.\nBeispiel fuer 'Partyurlaub mit Freunden': Lloret de Mar waehlen, zwei guenstige Haeuser dort suchen, ausgeben, dann fragen ob ein anderes Ziel gewuenscht ist.\nFehlende Angaben wie Budget, Datum oder Personenzahl nimmst du an (2 Personen, mittleres Budget) statt zu fragen.\nHoechstens EINE Rueckfrage pro Antwort, immer NACH den Empfehlungen.\nWas im Verlauf steht, ist bekannt und wird nie erneut gefragt.\n\nRELEVANZ:\nUnsere eigenen Hotels (Liste unten) haben KEINEN Vorzug, pruefe sie genauso streng. Es zaehlt nur, ob Region, Art und Preis passen. Passt keines, erwaehne sie nicht.\n\nLINKS:\nFuer externe Hotels: web_search nutzen, Muster site:booking.com \\\"Hotelname\\\" Stadt\nDu brauchst die URL im Format https://www.booking.com/hotel/LAENDERCODE/name.html\nURLs gehoeren AUSSCHLIESSLICH in die Marker, NIEMALS in den Antworttext.\nErfinde keine URL. Kein Fund = anderes Hotel suchen.\nMaximal 2 Suchen. Bekannte Hotels (Liste unten) nicht erneut suchen.\n\nKEINE META-KOMMENTARE:\nSprich nie darueber, woher eine Empfehlung stammt oder was in unserer Auswahl ist." + profil + budgetHinweis + bekanntBlock + "\nUnsere Hotels:\n" + hotelContext + "\n\nAM ENDE JEDER ANTWORT (ohne Kommentar):\n[HOTELS:1,3] - wenn unsere Hotels passen\n[HOTEL:Hotelname|Stadt|https://www.booking.com/hotel/es/beispiel.html]\n[SUCHE:ort=Stadt;maxPreis=90;erwachsene=6]\n\nDie SUCHE-Zeile ist IMMER Pflicht, auch wenn Hotels gefunden wurden.",
          messages: history,
          tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 2 }]
        })
      });

      if (!res.ok) throw new Error("HTTP " + res.status);

      var data = await res.json();
      var fullText = (data.content || []).map(function(b) { return b.text || ""; }).join("");
      if (!fullText) throw new Error("Leere Antwort");

      var match = fullText.match(/\[HOTELS:([\d,]+)\]/);
      if (match) {
        var ids = match[1].split(",").map(Number);
        // Preislimit hart durchsetzen. Das Modell haelt sich nicht
        // zuverlaessig daran, ein zu teurer Vorschlag kostet Vertrauen.
        setSuggested(HOTELS.filter(function(h) {
          if (ids.indexOf(h.id) === -1) return false;
          if (limit && h.price > limit * 1.15) return false;
          return true;
        }));
      }

      // Rettungsnetz: Schreibt das Modell URLs direkt in den Text
      // statt ins [HOTEL:...]-Format, gaebe es keinen Button und kein
      // Tracking. Also hier einsammeln und nachtraeglich umwandeln.
      var rohLinks = [];
      var rohRe = /https?:\/\/(?:www\.)?booking\.com\/hotel\/[a-z]{2}\/[^\s<>")\]]+/gi;
      var rohTreffer = fullText.match(rohRe) || [];

      var hotelMatches = fullText.match(/\[HOTEL:[^\]]+\]/g);
      var inMarkern = (hotelMatches || []).join(" ");
      rohTreffer.forEach(function(u) {
        var url = u.replace(/[.,;:]+$/, "");
        if (inMarkern.indexOf(url) !== -1) return;
        if (rohLinks.indexOf(url) !== -1) return;
        rohLinks.push(url);
      });

      var fallbackOrt = "";
      if (hotelMatches) {
        var list = hotelMatches.map(function(m) {
          var parts = m.slice(7, -1).split("|");
          return {
            name: (parts[0] || "").trim(),
            stadt: (parts[1] || "").trim(),
            link: (parts[2] || "").trim()
          };
        }).filter(function(h) {
          // Nur echte Booking-Hotelseiten durchlassen.
          // Erfundene oder unvollstaendige URLs werden verworfen -
          // lieber kein Button als einer, der falsch landet.
          return h.name.length > 2
            && /^https?:\/\/(www\.)?booking\.com\/hotel\/[a-z]{2}\//i.test(h.link);
        });

        if (list.length > 0) fallbackOrt = list[0].stadt;

        list.forEach(function(h) { rememberHotel(h.name, h.stadt, h.link); });

        setExternal(list.map(function(h) {
          return { name: h.name, ort: h.stadt, url: track(h.link) };
        }));
      }

      if (rohLinks.length > 0) {
        var ausRoh = rohLinks.map(function(u) {
          return { name: nameAusUrl(u), ort: "", url: track(u) };
        });
        setExternal(function(prev) {
          var vorhanden = (prev || []).map(function(x) { return x.url; });
          return (prev || []).concat(ausRoh.filter(function(x) {
            return vorhanden.indexOf(x.url) === -1;
          }));
        });
      }

      var sMatch = fullText.match(/\[SUCHE:([^\]]+)\]/);
      var sParams = null;
      if (sMatch) {
        sParams = {};
        sMatch[1].split(";").forEach(function(pair) {
          var kv = pair.split("=");
          if (kv.length === 2) sParams[kv[0].trim()] = kv[1].trim();
        });
      }
      // Garantierter Rueckfallpfad: findet Booking ein Hotel nicht,
      // gibt es immer noch die funktionierende Stadtsuche
      if (sParams && sParams.ort) {
        setSearchLink({ url: searchUrl(sParams), ort: sParams.ort });
      } else if (fallbackOrt) {
        setSearchLink({ url: searchUrl({ ort: fallbackOrt, maxPreis: limit || undefined }), ort: fallbackOrt });
      }

      var cleanText = limitFragen(stripMarkers(fullText));
      setMsgs(function(p) { return [...p, { role: "assistant", text: cleanText }]; });

    } catch(err) {
      console.error("AI Error:", err);
      setMsgs(function(p) { return [...p, { role: "assistant", text: "Entschuldigung, ich habe gerade Verbindungsprobleme. Schau dir in der Zwischenzeit unsere Hotels an!" }]; });
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
  var deals = HOTELS.filter(function(h) { return h.lastMinute; }).sort(function(a, b) { return (b.originalPrice - b.price) - (a.originalPrice - a.price); });
  var nomads = HOTELS.filter(function(h) { return h.nomad; });

  var TABS = [["home","Start"],["deals","Deals"],["nomad","Nomad"],["ai","KI-Berater"]];
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
              <p style={{ fontSize: 18, color: GRAY, maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.7 }}>KI-Beratung - Last Minute Deals - Nomad-Hotels.<br />Alles an einem Ort, kostenlos und ehrlich.</p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }} className="hero-buttons">
                <button onClick={function() { setTab("ai"); }} className="btn-gold" style={{ fontSize: 15, padding: "14px 28px", borderRadius: 12, boxShadow: "0 4px 20px rgba(201,150,12,0.3)" }}>KI-Berater starten</button>
                <button onClick={function() { setTab("deals"); }} style={{ background: "#fff", border: "1.5px solid " + BORDER, borderRadius: 12, padding: "14px 28px", color: TEXT, fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Last Minute Deals</button>
              </div>
            </div>
          </div>
          <div className="stats">
            {[["8+","Hotels"],["4.7","Bewertung"],["Bis -45%","Ersparnis"],["100%","Kostenlos"]].map(function(item) {
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

      {tab === "deals" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }} className="page-padding">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 20, padding: "5px 16px", fontSize: 12, color: "#ef4444", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Nur begrenzt verfuegbar</div>
            <h2 className="section-h" style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: TEXT }}>Last Minute Deals</h2>
            <p style={{ color: GRAY, marginTop: 10, fontSize: 16 }}>Die besten Angebote, spontan buchen und sparen</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 20 }} className="hotel-grid">
            {deals.map(function(h) { return <HotelCard key={h.id} hotel={h} />; })}
          </div>
          <div style={{ marginTop: 48, padding: 32, borderRadius: 20, background: ACCENT_LIGHT, border: "1px solid #e9d06a", textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: TEXT, marginBottom: 8 }}>Nichts Passendes dabei?</div>
            <p style={{ color: GRAY, marginBottom: 20 }}>Unser KI-Berater findet das perfekte Hotel fuer dich!</p>
            <button onClick={function() { setTab("ai"); }} className="btn-gold" style={{ borderRadius: 10, padding: "12px 28px" }}>KI-Berater fragen</button>
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
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>5. Cookies</h2>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15 }}>Wir setzen ausschließlich technisch notwendige Cookies ein (Speicherung deiner Cookie-Einwilligung via localStorage). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Affiliate-Links zu Booking.com können nach dem Klick zu Drittanbieter-Cookies führen, auf die wir keinen Einfluss haben.</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>6. Deine Rechte (Art. 15–22 DSGVO)</h2>
          <ul style={{ color: GRAY, lineHeight: 2.2, fontSize: 15, paddingLeft: 24 }}>
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
          </ul>
          <p style={{ color: GRAY, lineHeight: 2, fontSize: 15, marginTop: 12 }}>Anfragen an: info@myspecialhotel.com. Beschwerderecht bei der Berliner Beauftragten für Datenschutz und Informationsfreiheit.</p>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 8, marginTop: 28 }}>7. Änderungen</h2>
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
