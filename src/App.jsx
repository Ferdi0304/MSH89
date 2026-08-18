import { useState, useRef, useEffect } from "react";

const HOTELS = [
  { id: 1, name: "Mont Cervin Palace", preisIntern: 320, city: "Zermatt", country: "Schweiz", img: "https://images.unsplash.com/photo-1640535092591-b9c35f4b138f?w=800&q=80&auto=format&fit=crop", tags: ["Wellness", "Berge", "Luxus"], lastMinute: true, nomad: false, cat: "wellness", url: "https://www.booking.com/hotel/ch/mont-cervin-palace.de.html" },
  { id: 2, name: "25hours Hotel Bikini Berlin", preisIntern: 119, city: "Berlin", country: "Deutschland", img: "https://images.unsplash.com/photo-1585405327087-ccddc9329fa5?w=800&q=80&auto=format&fit=crop", tags: ["Nomad", "Design", "Zentral"], lastMinute: false, nomad: true, cat: "nomad", url: "https://www.booking.com/hotel/de/25hours-bikini-berlin.de.html" },
  { id: 3, name: "Hotel Negresco", preisIntern: 280, city: "Nizza", country: "Frankreich", img: "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=800&q=80&auto=format&fit=crop", tags: ["Meer", "Luxus", "Historisch"], lastMinute: true, nomad: false, cat: "luxury", url: "https://www.booking.com/hotel/fr/negresco.de.html" },
  { id: 4, name: "25hours Hotel MuseumsQuartier", preisIntern: 89, city: "Wien", country: "Oesterreich", img: "https://images.unsplash.com/photo-1646491311728-f4a676e5f17d?w=800&q=80&auto=format&fit=crop", tags: ["Nomad", "Design", "Zentral"], lastMinute: false, nomad: true, cat: "nomad", url: "https://www.booking.com/hotel/at/25hours-wien.de.html" },
  { id: 5, name: "Gritti Palace Venice", preisIntern: 650, city: "Venedig", country: "Italien", img: "https://images.unsplash.com/photo-1558271736-cd043ef2e855?w=800&q=80&auto=format&fit=crop", tags: ["Luxus", "Romantik", "Historisch"], lastMinute: true, nomad: false, cat: "luxury", url: "https://www.booking.com/hotel/it/gritti-palace.de.html" },
  { id: 6, name: "Dollenberg Relais & Chateaux", preisIntern: 195, city: "Bad Peterstal", country: "Deutschland", img: "https://images.unsplash.com/photo-1720951901235-8d865c940454?w=800&q=80&auto=format&fit=crop", tags: ["Wellness", "Spa", "Natur"], lastMinute: true, nomad: false, cat: "wellness", url: "https://www.booking.com/hotel/de/dollenberg.de.html" },
  { id: 7, name: "Casa Camper Barcelona", preisIntern: 145, city: "Barcelona", country: "Spanien", img: "https://images.unsplash.com/photo-1578095172812-dcc191c5aed8?w=800&q=80&auto=format&fit=crop", tags: ["Design", "Nomad", "Zentral"], lastMinute: false, nomad: true, cat: "nomad", url: "https://www.booking.com/hotel/es/casa-camper.de.html" },
  { id: 8, name: "Interalpen-Hotel Tyrol", preisIntern: 280, city: "Telfs", country: "Oesterreich", img: "https://images.unsplash.com/photo-1607453813894-21f7b5cf201a?w=800&q=80&auto=format&fit=crop", tags: ["Wellness", "Spa", "Berge"], lastMinute: true, nomad: false, cat: "wellness", url: "https://www.booking.com/hotel/at/interalpen-tyrol.de.html" },
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

// === CJ AFFILIATE TRACKING ===
// Website-ID: 101831910 | Link-ID: 15734849
const CJ_BASE = "https://www.kqzyfj.com/click-101831910-15734849";

function track(bookingUrl) {
  return CJ_BASE + "?url=" + encodeURIComponent(bookingUrl);
}

// Entfernt NUR die technischen Marker und Markdown-Reste.
// WICHTIG: Hier wird bewusst NICHT mehr am Inhalt gefiltert. Frueher standen
// hier Regexe gegen entschuldigende und vertroestende Saetze - die waren gegen
// Haikus Schwaechen gebaut. Bei Sonnet haben sie ganze Antworten zerschnitten
// oder komplett geloescht. Sonnet formuliert selbst sauber; der Prompt regelt
// den Rest.
function stripMarkers(t) {
  return (t || "")
    .replace(/\[HOTEL:[^\]]*\]/gi, "")
    .replace(/\[SUCHE:[^\]]*\]/gi, "")
    .replace(/\[HOTELS:[^\]]*\]/gi, "")
    .replace(/\*\*/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/https?:\/\/(?:www\.)?booking\.com\/[^\s<>")\]]+/gi, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Baut eine Booking-Suche fuer eine Stadt. Nur der Ort als Suchbegriff -
// kein Hotelname, kein Zusatz nach einem Komma, sonst zeigt Booking fremde
// Hotels. Kein harter Preisfilter, der die Liste leeren wuerde; bei Budget
// stattdessen guenstigste zuerst sortieren. Diese Links funktionieren immer.
// Baut den Suchbegriff fuer ein einzelnes Haus.
//
// WICHTIG - warum hier NUR der Name steht und nicht der Ort:
// Bookings ss-Parameter ist ein Ziel-Parser. Bekommt er "Name, Stadt" und das
// Haus liegt gar nicht in dieser Stadt, findet er nichts und liefert eine LEERE
// Seite. Genau das ist der haeufigste Fall: Sonnet kennt die Haeuser, verortet
// sie aber oft falsch (echtes Beispiel: "Apartamentos Buenavista" steht bei
// Booking in Puerto Rico de Gran Canaria, Sonnet schrieb Las Palmas - 60 km weg).
//
// Der Name ist die zuverlaessige Information, der Ort die unzuverlaessige.
// Deshalb sucht der Link nur nach dem Namen. Ein eigenstaendiger Hotelname
// loest bei Booking in aller Regel sauber auf und kann sich nicht selbst
// widersprechen. Der Ort kommt separat ueber den Regions-Link darunter.
//
// Ausnahme: Besteht der Name nach dem Kuerzen nur aus einem Wort, ist er zu
// mehrdeutig - dann hilft der Ort mehr als er schadet.
function hotelSuchbegriff(name, ort) {
  var n = (name || "")
    .split(",")[0]
    .split(" \u2013 ")[0]
    .split(" \u2014 ")[0]
    .split(" - ")[0]
    .replace(/\s*&\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  var teile = n.split(" ");
  if (teile.length > 6) {
    n = teile.slice(0, 6).join(" ");
    teile = n.split(" ");
  }
  if (!n) return ort || "";
  if (teile.length < 2 && ort) return n + ", " + ort;
  return n;
}

function searchUrl(params) {
  var q = params.ort || "";
  var u = "https://www.booking.com/searchresults.de.html?ss=" + encodeURIComponent(q);
  if (params.checkin) u += "&checkin=" + params.checkin;
  if (params.checkout) u += "&checkout=" + params.checkout;
  if (params.erwachsene) u += "&group_adults=" + params.erwachsene;
  u += "&no_rooms=1";
  if (params.maxPreis) u += "&order=price";
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

// === KI-BERATER ===
// Ein einziger Aufruf an Sonnet 5 - so gut wie eine normale KI-Antwort, aber
// gezielt als Reiseberater. Guenstig (~1 Cent, keine Websuche, keine Pipeline).
// Die kuratierten Hotels haben KEINEN Vorrang - Sonnet empfiehlt frei aus
// seinem Wissen. Jedes genannte Hotel wird im Code zu einer GETRACKTEN
// Booking-Suche nach genau diesem Haus (ss=Hotelname Stadt). Das landet meist
// direkt auf dem Hotel, immer aber auf einer echten, relevanten Trefferseite -
// nie leer, nie das falsche Ziel. Eine 100%-Garantie auf die exakte Hotelseite
// gaebe nur ein echter Hotel-Feed; darum hier bewusst die Suche.
function AIChat() {
  var initialMsgs = [{ role: "assistant", text: "Hallo! Ich bin dein Reiseberater von MySpecialHotel.\n\nSag mir, wohin es gehen soll und worauf du Wert legst - Stil, Gegend, Anlass - und ich empfehle dir konkrete Hotels, die wirklich passen." }];
  var [msgs, setMsgs] = useState(initialMsgs);
  var [input, setInput] = useState("");
  var [loading, setLoading] = useState(false);
  var [empfehlungen, setEmpfehlungen] = useState([]);
  var [searchLink, setSearchLink] = useState(null);
  var bottomRef = useRef(null);

  useEffect(function() {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading, empfehlungen, searchLink]);

  var send = async function() {
    if (!input.trim() || loading) return;
    var q = input.trim();
    setInput("");
    var neueMsgs = msgs.concat([{ role: "user", text: q }]);
    setMsgs(neueMsgs);
    setLoading(true);
    setEmpfehlungen([]);
    setSearchLink(null);

    var verlauf = neueMsgs
      .filter(function(m, i) { return !(i === 0 && m.role === "assistant"); })
      .filter(function(m) { return !m.ersatz; })
      .filter(function(m) { return m.text && m.text.trim(); })
      .map(function(m) { return { role: m.role === "user" ? "user" : "assistant", content: m.text.trim() }; })
      .slice(-12);
    while (verlauf.length && verlauf[0].role !== "user") verlauf.shift();

    var system =
      "Du bist ein exzellenter, unabhaengiger Reiseberater fuer MySpecialHotel - so " +
      "kompetent und konkret wie ein persoenlicher Concierge. Antworte auf Deutsch.\n\n" +
      "DEINE WICHTIGSTE REGEL: Empfiehl, statt zu fragen. Sobald irgendein Ziel " +
      "erkennbar ist - Land, Insel, Region oder Stadt - gibst du SOFORT 3 bis 4 konkrete " +
      "Unterkuenfte. Frage dann nicht mehr nach Details. Fehlt dir etwas, triff eine " +
      "sinnvolle Annahme und sage sie in einem Halbsatz dazu.\n\n" +
      "Nur wenn ueberhaupt kein Ziel und keine Richtung erkennbar ist, stelle EINE kurze " +
      "Rueckfrage mit 2-3 konkreten Vorschlaegen. Hoechstens einmal im ganzen Gespraech - " +
      "hast du schon einmal gefragt, wird jetzt empfohlen.\n\n" +
      "Empfiehl echte, existierende Haeuser. Erfinde keine Namen. Passe die Art der " +
      "Unterkunft dem Wunsch an - wer ein Apartment sucht, bekommt Apartments und " +
      "Aparthotels, kein Grandhotel.\n\n" +
      "FORMAT DER EMPFEHLUNGEN - das ist wichtig:\n" +
      "Schreibe jede Unterkunft als eigenen Absatz, immer genau so:\n" +
      "Name der Unterkunft (Ort) - ein Satz, warum sie passt\n\n" +
      "Also: Name ganz vorne, dann der Ort in runden Klammern, dann ein Gedankenstrich, " +
      "dann die Begruendung. Die Seite liest daraus die Buchungslinks - ohne dieses Format " +
      "bekommt der Nutzer zu deinen Empfehlungen keine Links.\n" +
      "Benutze die Klammer-Schreibweise NUR fuer Unterkuenfte, niemals in normalen Saetzen.\n" +
      "Der Ort in der Klammer muss der Ort sein, an dem das Haus wirklich steht. Bist du " +
      "dir beim genauen Ort nicht sicher, schreibe lieber die groessere Region oder Insel " +
      "hinein. Eine falsche Stadt ist schlimmer als eine ungenaue Region.\n\n" +
      "Schreibe ganz am Schluss, in einer eigenen letzten Zeile, die Zielregion als Marker:\n" +
      "[SUCHE: Stadt oder Insel]\n\n" +
      "REGELN:\n" +
      "- Erfinde niemals Preise, Sterne oder Bewertungszahlen und nenne keine konkreten Preise.\n" +
      "- Schreibe im sichtbaren Text niemals selbst Links oder booking.com-Adressen.\n" +
      "- Vertroeste nicht ('ich suche gleich...') - deine Empfehlung steht sofort hier.\n" +
      "- Halte den Text knapp: kurze Einleitung, dann die Haeuser mit je einem Satz.";

    try {
      var res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-5",
          max_tokens: 800,
          system: system,
          messages: verlauf
        })
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      var data = await res.json();

      var roh = (data.content || [])
        .filter(function(b) { return b.type === "text" || (!b.type && b.text); })
        .map(function(b) { return b.text || ""; })
        .join("\n")
        .trim();

      // Zuerst den sichtbaren Text herstellen - genau das, was der Nutzer liest.
      // Daraus werden dann die Hotelnamen gelesen.
      var text = stripMarkers(roh);

      // Hotels aus dem sichtbaren Text lesen. Sonnet schreibt jede Empfehlung
      // als "Name (Ort) - Begruendung". Dieses Muster ist Teil der Antwort
      // selbst und kann deshalb nicht vergessen werden - anders als die
      // frueheren versteckten [HOTEL:]-Marker, die Sonnet oft weggelassen hat.
      //
      // Der Gedankenstrich direkt hinter der Klammer ist die entscheidende
      // Bedingung. Ein normaler Satz wie
      //   "Falls dir eine andere Insel (z. B. Santorin, Kos) lieber ist, ..."
      // hat zwar eine Klammer, danach folgt aber kein Strich - also kein Treffer.
      var HOTELZEILE = /^\s*(?:[-*\u2022]|\d+[.)])?\s*([^()\n]{3,80}?)\s*\(([^)\n]{2,40})\)\s*[-\u2013\u2014]\s+\S/;
      var seen = {};
      var liste = [];
      text.split("\n").forEach(function(zeile) {
        var m = zeile.match(HOTELZEILE);
        if (!m) return;
        var name = m[1].trim();
        var stadt = m[2].trim();
        // Ein Hotelname ist kein ganzer Satz und faengt gross an.
        if (name.indexOf(". ") !== -1) return;
        if (!/^[A-Z0-9ÄÖÜ]/.test(name)) return;
        var key = (name + "|" + stadt).toLowerCase();
        if (seen[key]) return;
        seen[key] = 1;
        var suchbegriff = hotelSuchbegriff(name, stadt);
        liste.push({ name: name, stadt: stadt, url: searchUrl({ ort: suchbegriff }) });
      });
      setEmpfehlungen(liste.slice(0, 5));

      // Sammel-Link ueber die ganze Zielregion. Fehlt der Marker, wird der Ort
      // des ersten gefundenen Hauses genommen - so gibt es immer einen Link,
      // der funktioniert.
      var mSuche = roh.match(/\[SUCHE:\s*([^\]]+)\]/i);
      var ort = mSuche ? mSuche[1].replace(/,.*$/, "").trim() : "";
      if (!ort && liste.length) ort = liste[0].stadt;
      if (ort) setSearchLink({ url: searchUrl({ ort: ort }), ort: ort });

      // Nur wenn wirklich nichts uebrig bleibt, gibt es einen Ersatztext -
      // und der wird NICHT in den Verlauf uebernommen (Flag ersatz), sonst
      // haelt Sonnet ihn beim naechsten Mal fuer seine eigene Frage und
      // stellt endlos Rueckfragen.
      var istErsatz = false;
      if (!text) {
        text = liste.length
          ? "Hier sind meine Empfehlungen:"
          : "Sag mir einfach ein Land oder eine Stadt, dann lege ich los.";
        istErsatz = true;
      }
      setMsgs(function(p) { return p.concat([{ role: "assistant", text: text, ersatz: istErsatz }]); });

    } catch (e) {
      setMsgs(function(p) { return p.concat([{
        role: "assistant",
        text: "Da ist gerade etwas schiefgelaufen. Versuch es bitte nochmal.",
        ersatz: true
      }]); });
    }
    setLoading(false);
  };

  var hints = ["Spa-Hotel Tirol", "Boutique Hotel Lissabon", "Strandurlaub Griechenland", "Staedtetrip Kopenhagen"];

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
            <div style={{ display: "flex", gap: 5, padding: "13px 16px", background: "#f9fafb", border: "1px solid " + BORDER, borderRadius: "18px 18px 18px 4px" }}>
              {[0,1,2].map(function(i) { return <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT, animation: "bounce 1.2s " + (i * 0.2) + "s infinite" }} />; })}
            </div>
          </div>
        )}
        {empfehlungen.length > 0 && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            <div style={{ fontSize: 11, color: ACCENT, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Empfohlene Hotels</div>
            {empfehlungen.map(function(h, i) {
              return (
                <a key={i} href={h.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "#fff", border: "1.5px solid " + BORDER, borderRadius: 14, padding: "14px 16px", textDecoration: "none", transition: "all 0.2s" }} onMouseEnter={function(e){e.currentTarget.style.borderColor=ACCENT;}} onMouseLeave={function(e){e.currentTarget.style.borderColor=BORDER;}}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 2 }}>{h.name}</div>
                    <div style={{ fontSize: 12, color: GRAY }}>{h.stadt}</div>
                  </div>
                  <span className="btn-gold" style={{ padding: "9px 17px", fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>Auf Booking →</span>
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
          <input value={input} onChange={function(e) { setInput(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") send(); }} placeholder="z.B. Wellness Hotel in den Alpen fuer 2 Naechte" style={{ flex: 1, background: "#f9fafb", border: "1px solid " + BORDER, borderRadius: 10, padding: "11px 14px", color: TEXT, fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif" }} />
          <button onClick={send} disabled={loading || !input.trim()} className="btn-gold" style={{ fontSize: 18, padding: "11px 18px" }}>Senden</button>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {hints.map(function(s) { return <button key={s} onClick={function() { setInput(s); }} style={{ background: ACCENT_LIGHT, border: "1px solid #e9d06a", borderRadius: 16, padding: "4px 12px", color: ACCENT, fontSize: 12, cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>{s}</button>; })}
        </div>
      </div>
    </div>
  );
}

// Zeigt die taeglich per Websuche gefundenen Unterkuenfte fuer den Nomad-Bereich.
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
              <p style={{ fontSize: 18, color: GRAY, maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.7 }} className="hero-p">Persönliche KI-Beratung und handverlesene Hotels.<br />Ehrlich, unabhängig und kostenlos.</p>
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
