import { useState, useRef, useEffect } from "react";

const HOTELS = [
  { id: 1, name: "Hotel Alpina Deluxe", city: "Zermatt", country: "Schweiz", price: 189, originalPrice: 280, rating: 4.8, reviews: 1243, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", tags: ["Wellness", "Berge", "Spa"], lastMinute: true, nomad: false, cat: "wellness" },
  { id: 2, name: "The Urban Nomad Hub", city: "Berlin", country: "Deutschland", price: 79, originalPrice: 79, rating: 4.6, reviews: 892, img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", tags: ["Nomad", "Design", "Coworking"], lastMinute: false, nomad: true, cat: "nomad" },
  { id: 3, name: "Boutique Riviera", city: "Nizza", country: "Frankreich", price: 134, originalPrice: 210, rating: 4.9, reviews: 567, img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80", tags: ["Meer", "Design", "Luxus"], lastMinute: true, nomad: false, cat: "design" },
  { id: 4, name: "Nomad Base Vienna", city: "Wien", country: "Oesterreich", price: 65, originalPrice: 65, rating: 4.5, reviews: 445, img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80", tags: ["Nomad", "Zentral", "Budget"], lastMinute: false, nomad: true, cat: "nomad" },
  { id: 5, name: "Palazzo Venezia", city: "Venedig", country: "Italien", price: 245, originalPrice: 390, rating: 4.9, reviews: 2100, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80", tags: ["Luxus", "Romantik", "Spa"], lastMinute: true, nomad: false, cat: "luxury" },
  { id: 6, name: "Schwarzwald Retreat", city: "Freiburg", country: "Deutschland", price: 112, originalPrice: 155, rating: 4.7, reviews: 334, img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80", tags: ["Wellness", "Natur", "Ruhe"], lastMinute: true, nomad: false, cat: "wellness" },
  { id: 7, name: "Rooftop Loft Barcelona", city: "Barcelona", country: "Spanien", price: 98, originalPrice: 98, rating: 4.7, reviews: 1567, img: "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800&q=80", tags: ["Design", "Nomad", "Rooftop"], lastMinute: false, nomad: true, cat: "design" },
  { id: 8, name: "Alpine Spa Resort", city: "Innsbruck", country: "Oesterreich", price: 167, originalPrice: 220, rating: 4.8, reviews: 789, img: "https://images.unsplash.com/photo-1540541338537-1220059af4dc?w=800&q=80", tags: ["Wellness", "Spa", "Berge"], lastMinute: true, nomad: false, cat: "wellness" },
];

const ACCENT = "#C9960C";
const ACCENT_LIGHT = "#FDF6E3";
const TEXT = "#1a1a2e";
const GRAY = "#6b7280";
const BORDER = "#e5e7eb";

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #fff; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }
  input::placeholder { color: #9ca3af !important; }
  @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .card { transition: all 0.25s; }
  .card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.1) !important; }
  .btn-gold { background: #C9960C; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-family: Inter, sans-serif; transition: background 0.2s; }
  .btn-gold:hover { background: #b8860b; }
  .btn-gold:disabled { background: #d1d5db; cursor: not-allowed; }
  .tab-btn { transition: all 0.15s; }
  .tab-btn:hover { background: #f3f4f6 !important; }
  a { text-decoration: none; }
`;

function HotelCard({ hotel, highlight }) {
  const disc = Math.round((1 - hotel.price / hotel.originalPrice) * 100);
  const url = "https://www.booking.com/searchresults.html?ss=" + encodeURIComponent(hotel.city) + "&aid=DEINE_AFFILIATE_ID";
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
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn-gold" style={{ padding: "9px 18px", fontSize: 12 }}>Buchen</a>
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
  var [cat, setCat] = useState("all");

  var filtered = HOTELS.filter(function(h) { return cat === "all" || h.cat === cat; });
  var deals = HOTELS.filter(function(h) { return h.lastMinute; }).sort(function(a, b) { return (b.originalPrice - b.price) - (a.originalPrice - a.price); });
  var nomads = HOTELS.filter(function(h) { return h.nomad; });

  var TABS = [["home","Start"],["deals","Deals"],["nomad","Nomad"],["ai","KI-Berater"]];
  var CATS = [["all","Alle"],["wellness","Wellness"],["design","Design"],["luxury","Luxus"],["nomad","Nomad"]];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: TEXT, fontFamily: "Inter, sans-serif" }}>
      <style>{css}</style>

      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid " + BORDER, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
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
          <div style={{ position: "relative", height: "85vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.12 }} />
            <div style={{ position: "relative", zIndex: 1, animation: "fadeUp 0.7s ease forwards" }}>
              <div style={{ display: "inline-block", background: ACCENT_LIGHT, border: "1px solid #e9d06a", borderRadius: 20, padding: "5px 16px", fontSize: 12, color: ACCENT, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24 }}>Dein smarter Hotel-Begleiter</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px,7vw,80px)", fontWeight: 900, lineHeight: 1.08, color: TEXT, marginBottom: 20 }}>
                Dein perfektes<br /><span style={{ color: ACCENT }}>Hotel</span>, jederzeit.
              </h1>
              <p style={{ fontSize: 18, color: GRAY, maxWidth: 500, margin: "0 auto 36px", lineHeight: 1.7 }}>KI-Beratung - Last Minute Deals - Nomad-Hotels.<br />Alles an einem Ort, kostenlos und ehrlich.</p>
              <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={function() { setTab("ai"); }} className="btn-gold" style={{ fontSize: 15, padding: "14px 28px", borderRadius: 12, boxShadow: "0 4px 20px rgba(201,150,12,0.3)" }}>KI-Berater starten</button>
                <button onClick={function() { setTab("deals"); }} style={{ background: "#fff", border: "1.5px solid " + BORDER, borderRadius: 12, padding: "14px 28px", color: TEXT, fontWeight: 600, fontSize: 15, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>Last Minute Deals</button>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderTop: "1px solid " + BORDER, display: "flex", justifyContent: "center", background: "#fff" }}>
              {[["8+","Hotels"],["4.7","Bewertung"],["Bis -45%","Ersparnis"],["100%","Kostenlos"]].map(function(item, i) {
                return <div key={item[1]} style={{ textAlign: "center", padding: "18px 40px", borderLeft: i > 0 ? "1px solid " + BORDER : "none" }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: ACCENT }}>{item[0]}</div>
                  <div style={{ fontSize: 12, color: GRAY, marginTop: 2 }}>{item[1]}</div>
                </div>;
              })}
            </div>
          </div>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: TEXT, marginBottom: 24, textAlign: "center" }}>Alle Hotels entdecken</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 36 }}>
              {CATS.map(function(item) {
                var c = item[0]; var l = item[1];
                return <button key={c} onClick={function() { setCat(c); }} style={{ background: cat===c ? ACCENT : "#fff", border: "1.5px solid " + (cat===c ? ACCENT : BORDER), borderRadius: 24, padding: "7px 18px", color: cat===c ? "#fff" : GRAY, cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: cat===c ? 600 : 400, fontSize: 13, transition: "all 0.15s" }}>{l}</button>;
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 20 }}>
              {filtered.map(function(h) { return <HotelCard key={h.id} hotel={h} />; })}
            </div>
          </div>
        </div>
      )}

      {tab === "deals" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 20, padding: "5px 16px", fontSize: 12, color: "#ef4444", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Nur begrenzt verfuegbar</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: TEXT }}>Last Minute Deals</h2>
            <p style={{ color: GRAY, marginTop: 10, fontSize: 16 }}>Die besten Angebote, spontan buchen und sparen</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 20 }}>
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
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "5px 16px", fontSize: 12, color: "#10b981", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Remote Work Freundlich</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: TEXT }}>Nomad Hotels</h2>
            <p style={{ color: GRAY, marginTop: 10, fontSize: 16 }}>Gigabit WLAN - Coworking - Dedizierte Arbeitsbereiche</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, marginBottom: 40, background: "#f9fafb", borderRadius: 16, padding: 28, border: "1px solid " + BORDER }}>
            {[["WLAN","Gigabit WLAN","Schnelles Internet ueberall"],["Desk","Coworking","Professionelle Arbeitsbereiche"],["Globe","Top-Staedte","Hotels in Europa und weltweit"]].map(function(item) {
              return <div key={item[1]} style={{ textAlign: "center", padding: 16 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{item[0]}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: TEXT, marginBottom: 5 }}>{item[1]}</div>
                <div style={{ fontSize: 13, color: GRAY }}>{item[2]}</div>
              </div>;
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))", gap: 20 }}>
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

      <footer style={{ marginTop: 80, padding: "32px 24px", borderTop: "1px solid " + BORDER, textAlign: "center", color: GRAY, fontSize: 12, background: "#f9fafb" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: TEXT, marginBottom: 10 }}>My<span style={{ color: ACCENT }}>Special</span>Hotel.com</div>
        <p>Affiliate-Links: Bei Buchung ueber unsere Links erhalten wir eine Provision, fuer dich entstehen keine Mehrkosten.</p>
        <p style={{ marginTop: 6 }}>2025 MySpecialHotel.com - Impressum - Datenschutz</p>
      </footer>
    </div>
  );
}
