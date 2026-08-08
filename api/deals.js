// api/deals.js
//
// Sucht einmal taeglich aktuelle Unterkuenfte und liefert sie an die Website.
//
// Warum das guenstig bleibt:
// Die Antwort wird von Vercel im CDN zwischengespeichert (s-maxage=86400).
// Egal ob 10 oder 10.000 Besucher kommen - die KI-Suche laeuft nur einmal
// pro Tag und Typ. Kosten dadurch etwa 30 Cent im Monat.

const STAEDTE_DEALS = [
  "Barcelona", "Lissabon", "Wien", "Prag", "Amsterdam", "Kopenhagen",
  "Mallorca", "Rom", "Budapest", "Porto", "Athen", "Krakau"
];

const STAEDTE_NOMAD = [
  "Lissabon", "Barcelona", "Berlin", "Bali Canggu", "Medellin",
  "Chiang Mai", "Tiflis", "Budapest", "Mexiko-Stadt", "Kapstadt"
];

// Waehlt abhaengig vom Tag drei Staedte aus. So aendert sich das
// Angebot taeglich, ohne dass wir irgendwo einen Zaehler speichern muessen.
function staedteFuerHeute(liste, anzahl) {
  const tag = Math.floor(Date.now() / 86400000);
  const raus = [];
  for (let i = 0; i < anzahl; i++) {
    raus.push(liste[(tag * anzahl + i) % liste.length]);
  }
  return raus;
}

function leseJson(text) {
  if (!text) return null;
  const s = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a === -1 || b === -1 || b < a) return null;
  try { return JSON.parse(s.slice(a, b + 1)); } catch (e) { return null; }
}

const BOOKING_HOTEL = /^https?:\/\/(www\.)?booking\.com\/hotel\/[a-z]{2}\//i;

export default async function handler(req, res) {
  const typ = (req.query.typ === "nomad") ? "nomad" : "deals";

  // CDN-Cache: 24 Stunden frisch, danach wird im Hintergrund erneuert,
  // waehrend Besucher weiterhin sofort die alte Version bekommen.
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=172800");

  try {
    const staedte = typ === "nomad"
      ? staedteFuerHeute(STAEDTE_NOMAD, 3)
      : staedteFuerHeute(STAEDTE_DEALS, 3);

    const auftrag = typ === "nomad"
      ? "Finde je eine Unterkunft in " + staedte.join(", ") +
        ", die sich fuer Remote-Arbeit eignet: schnelles WLAN, Schreibtisch oder Coworking-Bereich."
      : "Finde je eine derzeit preislich attraktive Unterkunft in " + staedte.join(", ") + ".";

    const system =
      "Du bist Hotel-Rechercheur. Deine einzige Aufgabe: echte Booking.com-Seiten finden.\n\n" +
      "ABLAUF:\n" +
      "1. Nutze web_search mit dem Muster: site:booking.com \"Stadt\" Hotel\n" +
      "2. Nimm nur URLs der Form https://www.booking.com/hotel/XX/name.html\n" +
      "3. Erfinde NIEMALS eine URL und NIEMALS einen Preis.\n\n" +
      "Antworte NUR mit diesem JSON, ohne weiteren Text:\n" +
      '{"hotels":[{"name":"Hotelname","stadt":"Stadt","land":"Land",' +
      '"beschreibung":"ein kurzer Satz auf Deutsch",' +
      '"url":"https://www.booking.com/hotel/xx/name.html"}]}\n\n' +
      "Genau ein Haus pro Stadt. Keine Preisangaben in der Beschreibung.";

    const antwort = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        system: system,
        messages: [{ role: "user", content: auftrag }],
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 4 }]
      })
    });

    if (!antwort.ok) throw new Error("API " + antwort.status);

    const daten = await antwort.json();
    const bloecke = daten.content || [];

    const texte = bloecke
      .filter(function (b) { return b.type === "text" || (!b.type && b.text); })
      .map(function (b) { return (b.text || "").trim(); })
      .filter(function (t) { return t.length > 0; });

    const erg = leseJson(texte[texte.length - 1]) || leseJson(texte.join("\n")) || {};
    const roh = Array.isArray(erg.hotels) ? erg.hotels : [];

    const gesehen = {};
    const hotels = [];
    roh.forEach(function (h) {
      if (!h || typeof h.url !== "string") return;
      const url = h.url.split("?")[0];
      if (!BOOKING_HOTEL.test(url)) return;
      if (gesehen[url]) return;
      gesehen[url] = 1;
      hotels.push({
        name: String(h.name || "").trim().slice(0, 80),
        stadt: String(h.stadt || "").trim().slice(0, 40),
        land: String(h.land || "").trim().slice(0, 40),
        beschreibung: String(h.beschreibung || "").trim().slice(0, 200),
        url: url
      });
    });

    return res.status(200).json({
      typ: typ,
      stand: new Date().toISOString().slice(0, 10),
      hotels: hotels.slice(0, 3)
    });

  } catch (e) {
    // Bei einem Fehler nur kurz zwischenspeichern, damit der naechste
    // Aufruf es erneut versucht statt einen Tag lang leer zu bleiben.
    res.setHeader("Cache-Control", "public, s-maxage=300");
    return res.status(200).json({ typ: typ, hotels: [], fehler: true });
  }
}
