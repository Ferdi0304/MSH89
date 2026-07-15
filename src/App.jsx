import { useState, useRef, useEffect } from "react";

const HOTELS = [
  { id: 1, name: "Mont Cervin Palace", city: "Zermatt", country: "Schweiz", price: 320, originalPrice: 480, rating: 4.8, reviews: 1243, img: "https://images.unsplash.com/photo-1531088009183-5ff5b7c95f91?w=800&q=80", tags: ["Wellness", "Berge", "Luxus"], lastMinute: true, nomad: false, cat: "wellness", url: "https://www.booking.com/hotel/ch/mont-cervin-palace.de.html" },
  { id: 2, name: "25hours Hotel Bikini Berlin", city: "Berlin", country: "Deutschland", price: 119, originalPrice: 119, rating: 4.6, reviews: 3892, img: "https://images.unsplash.com/photo-1551016231-30c4a62b4b53?w=800&q=80", tags: ["Nomad", "Design", "Zentral"], lastMinute: false, nomad: true, cat: "nomad", url: "https://www.booking.com/hotel/de/25hours-bikini-berlin.de.html" },
  { id: 3, name: "Hotel Negresco", city: "Nizza", country: "Frankreich", price: 280, originalPrice: 420, rating: 4.7, reviews: 2156, img: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80", tags: ["Meer", "Luxus", "Historisch"], lastMinute: true, nomad: false, cat: "luxury", url: "https://www.booking.com/hotel/fr/negresco.de.html" },
  { id: 4, name: "25hours Hotel MuseumsQuartier", city: "Wien", country: "Oesterreich", price: 89, originalPrice: 89, rating: 4.5, reviews: 2445, img: "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?w=800&q=80", tags: ["Nomad", "Design", "Zentral"], lastMinute: false, nomad: true, cat: "nomad", url: "https://www.booking.com/hotel/at/25hours-beim-museumsquartier.de.html" },
  { id: 5, name: "Gritti Palace Venice", city: "Venedig", country: "Italien", price: 650, originalPrice: 950, rating: 4.9, reviews: 1876, img: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80", tags: ["Luxus", "Romantik", "Historisch"], lastMinute: true, nomad: false, cat: "luxury", url: "https://www.booking.com/hotel/it/the-gritti-palace.de.html" },
  { id: 6, name: "Dollenberg Relais & Chateaux", city: "Bad Peterstal", country: "Deutschland", price: 195, originalPrice: 260, rating: 4.8, reviews: 1334, img: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80", tags: ["Wellness", "Spa", "Natur"], lastMinute: true, nomad: false, cat: "wellness", url: "https://www.booking.com/hotel/de/dollenberg.de.html" },
  { id: 7, name: "Casa Camper Barcelona", city: "Barcelona", country: "Spanien", price: 145, originalPrice: 145, rating: 4.7, reviews: 2891, img: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80", tags: ["Design", "Nomad", "Zentral"], lastMinute: false, nomad: true, cat: "nomad", url: "https://www.booking.com/hotel/es/casa-camper-barcelona.de.html" },
  { id: 8, name: "Interalpen-Hotel Tyrol", city: "Telfs", country: "Oesterreich", price: 280, originalPrice: 380, rating: 4.9, reviews: 2134, img: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=800&q=80", tags: ["Wellness", "Spa", "Berge"], lastMinute: true, nomad: false, cat: "wellness", url: "https://www.booking.com/hotel/at/interalpen-hotel-tyrol.de.html" },
];

const ACCENT = "#C9960C";
const ACCENT_LIGHT = "#FDF6E3";
const TEXT = "#1a1a2e";
const GRAY = "#6b7280";
const BORDER = "#e5e7eb";

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: #fff; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
  input::placeholder { color: #9ca3af !important; }
  @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .card { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); cursor: pointer; }
  .card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.12) !important; }
  .btn-gold { background: #C9960C; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-family: Inter, sans-serif; transition: all 0.2s; letter-spacing: 0.3px; }
  .btn-gold:hover { background: #b8860b; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(201,150,12,0.4); }
  .btn-gold:active { transform: translateY(0); }
  .btn-gold:disabled { background: #d1d5db; cursor: not-allowed; transform: none; box-shadow: none; }
  .tab-btn { transition: all 0.2s; }
  .tab-btn:hover { background: #f9fafb !important; }
  .filter-btn { transition: all 0.2s; }
  .filter-btn:hover { opacity: 0.85; }
  a { text-decoration: none; }
  @media (max-width: 768px) {
    .hero-title { font-size: 38px !important; }
    .hero-stats { flex-wrap: wrap; gap: 0 !important; }
    .hero-stats > div { width: 50%; border-left: none !important; border-top: 1px solid #e5e7eb; }
    .nav-inner { padding: 0 16px !important; }
    .nav-logo { font-size: 18px !important; }
    .tab-btn { padding: 6px 10px !important; font-size: 12px !important; }
    .hotel-grid { grid-template-columns: 1fr !important; }
    .nomad-features { grid-template-columns: 1fr !important; }
    .page-padding { padding: 24px 16px !important; }
    .hero-buttons { flex-direction: column; align-items: center; }
    .hero-buttons button { width: 100%; max-width: 300px; }
    .search-bar { margin: 0 16px 24px !important; }
    .filter-row { padding: 0 8px; }
    .footer-inner { padding: 24px 16px !important; }
  }
`;

function HotelCard({ hotel, highlight }) {
  const disc = Math.round((1 - hotel.price / hotel.originalPrice) * 100);
  const url = hotel.url + "?aid=DEINE_AFFILIATE_ID";
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
  var initialMsgs = [{ role: "assistant", text: "Hallo! Ich bin dein persoenlicher Hotel-Berater von MySpecialHotel.\n\nBeschreib mir deinen Traumurlaub - Budget, Stimmung, Reiseziel - und ich empfehle das perfekte Hotel fuer dich!" }];
  var [msgs, setMsgs] = useState(initialMsgs);
  var [input, setInput] = useState("");
  var [loading, setLoading] = useState(false);
  var [suggested, setSuggested] = useState([]);
  var bottomRef = useRef(null);

  useEffect(function() {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading, suggested]);

  var send = async function() {
    if (!input.trim() || loading) return;
    var q = input.trim();
    setInput("");
    setMsgs(function(p) { return [...p, { role: "user", text: q }]; });
    setLoading(true);
    setSuggested([]);

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
          max_tokens: 600,
          system: "Du bist ein freundlicher Hotel-Berater auf MySpecialHotel.com. Antworte immer auf Deutsch. Sei warm, kurz und hilfreich.\n\nVerfuegbare Hotels:\n" + hotelContext + "\n\nWenn du Hotels empfiehlst, schreibe ihre IDs am Ende in diesem Format: [HOTELS:1,3,5]\nEmpfehle maximal 3 Hotels. Erklaere kurz warum sie passen.",
          messages: [{ role: "user", content: q }]
        })
      });

      if (!res.ok) throw new Error("HTTP " + res.status);

      var data = await res.json();
      var fullText = (data.content || []).map(function(b) { return b.text || ""; }).join("");
      if (!fullText) throw new Error("Leere Antwort");

      var match = fullText.match(/\[HOTELS:([\d,]+)\]/);
      if (match) {
        var ids = match[1].split(",").map(Number);
        setSuggested(HOTELS.filter(function(h) { return ids.indexOf(h.id) !== -1; }));
      }

      var cleanText = fullText.replace(/\[HOTELS:[\d,]+\]/g, "").trim();
      setMsgs(function(p) { return [...p, { role: "assistant", text: cleanText }]; });

    } catch(err) {
      console.error("AI Error:", err);
      setMsgs(function(p) { return [...p, { role: "assistant", text: "Entschuldigung, ich habe gerade Verbindungsprobleme. Schau dir in der Zwischenzeit unsere Hotels an!" }]; });
    }
    setLoading(false);
  };

  var hints = ["Wellness Hotel Alpen 150 EUR", "Nomad Barcelona", "Last Minute Meer", "Romantik Italien Luxus"];

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
            <div style={{ display: "flex", gap: 5, padding: "11px 15px", background: "#f9fafb", border: "1px solid " + BORDER, borderRadius: "18px 18px 18px 4px" }}>
              {[0,1,2].map(function(i) { return <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: ACCENT, animation: "bounce 1.2s " + (i * 0.2) + "s infinite" }} />; })}
            </div>
          </div>
        )}
        {suggested.length > 0 && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
            <div style={{ fontSize: 12, color: ACCENT, fontWeight: 600, fontFamily: "Inter, sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>Passende Hotels fuer dich</div>
            {suggested.map(function(h) { return <HotelCard key={h.id} hotel={h} highlight={true} />; })}
          </div>
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

      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid " + BORDER, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }} className="nav-inner">
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: TEXT }}>
          My<span style={{ color: ACCENT }}>Special</span>Hotel
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {TABS.map(function(item) {
            var id = item[0]; var label = item[1];
            return <button key={id} onClick={function() { setTab(id); }} className="tab-btn" style={{ background: tab === id ? ACCENT_LIGHT : "transparent", border: tab === id ? "1px solid #e9d06a" : "1px solid transparent", borderRadius: 8, padding: "7px 14px", color: tab === id ? ACCENT : GRAY, cursor: "pointer", fontSize: 13, fontFamily: "Inter, sans-serif", fontWeight: tab === id ? 600 : 400 }}>{label}</button>;
          })}
        </div>
      </nav>

      {tab === "home" && (
        <div>
          <div style={{ position: "relative", minHeight: "85vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px 80px", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.12 }} />
            <div style={{ position: "relative", zIndex: 1, animation: "fadeUp 0.7s ease forwards" }}>
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
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid " + BORDER, display: "flex", justifyContent: "center", background: "#fff" }} className="hero-stats">
              {[["8+","Hotels"],["4.7","Bewertung"],["Bis -45%","Ersparnis"],["100%","Kostenlos"]].map(function(item, i) {
                return <div key={item[1]} style={{ textAlign: "center", padding: "18px 40px", borderLeft: i > 0 ? "1px solid " + BORDER : "none" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: ACCENT }}>{item[0]}</div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>{item[1]}</div>
                </div>;
              })}
            </div>
          </div>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }} className="page-padding">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: TEXT, marginBottom: 24, textAlign: "center" }}>Alle Hotels entdecken</h2>
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
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: TEXT }}>Last Minute Deals</h2>
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
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: TEXT }}>Nomad Hotels</h2>
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
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, color: TEXT }}>KI Hotel-Berater</h2>
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
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: TEXT, marginBottom: 32 }}>Impressum</h1>
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
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: TEXT, marginBottom: 32 }}>Datenschutzerklärung</h1>
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
