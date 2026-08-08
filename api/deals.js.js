// api/deals.js
//
// Sucht einmal taeglich Unterkuenfte und liefert sie an die Website.
//
// Kosten: Die Antwort wird von Vercel im CDN zwischengespeichert
// (s-maxage=86400). Ob 10 oder 10.000 Besucher kommen - die Suche
// laeuft nur einmal pro Tag und Typ.
//
// Optional: UNSPLASH_KEY in den Vercel-Umgebungsvariablen setzen,
// dann bekommt jede Karte ein passendes Stadtfoto. Ohne Schluessel
// laeuft alles weiter, die Karten zeigen dann einen Farbverlauf.

const STAEDTE_DEALS = [
  "Barcelona", "Lissabon", "Wien", "Prag", "Amsterdam", "Kopenhagen",
  "Mallorca", "Rom", "Budapest", "Porto", "Athen", "Krakau",
  "Valencia", "Neapel", "Sevilla", "Warschau", "Dublin", "Nizza",
  "Bukarest", "Sofia", "Riga", "Tallinn"
];

const STAEDTE_NOMAD = [
  "Lissabon", "Barcelona", "Berlin", "Bali Canggu", "Medellin",
  "Chiang Mai", "Tiflis", "Budapest", "Mexiko-Stadt", "Kapstadt",
  "Split", "Las Palmas", "Buenos Aires", "Taipeh"
];

const ANZAHL = 6;

// Waehlt abhaengig vom Tag mehrere Staedte. So aendert sich das Angebot
// taeglich, ohne dass irgendwo ein Zaehler gespeichert werden muss.
function staedteFuerHeute(liste, anzahl) {
  const tag = Math.floor(Date.now() / 86400000);
  const raus = [];
  for (let i = 0; i < anzahl; i++) {
    raus.push(liste[(tag * anzahl + i) % liste.length]);
  }
  return raus;
}

// Zeitraum in naher Zukunft. Dadurch zeigt Booking beim Klick echte
// Last-Minute-Verfuegbarkeit statt allgemeiner Listenpreise.
function zeitraum() {
  const tag = 86400000;
  const an = new Date(Date.now() + 7 * tag);
  const ab = new Date(Date.now() + 10 * tag);
  return {
    checkin: an.toISOString().slice(0, 10),
    checkout: ab.toISOString().slice(0, 10)
  };
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

// Holt ein Stadtfoto von Unsplash. Faellt still aus, wenn kein
// Schluessel hinterlegt ist oder die Anfrage fehlschlaegt.
async function stadtfoto(stadt) {
  const key = process.env.UNSPLASH_KEY;
  if (!key || !stadt) return "";
  try {
    const suche = stadt.replace(/\s+/g, " ").trim();
    const u = "https://api.unsplash.com/search/photos"
      + "?per_page=1&orientation=landscape&content_filter=high"
      + "&query=" + encodeURIComponent(suche + " cityscape");
    const r = await fetch(u, {
      headers: { Authorization: "Client-ID " + key }
    });
    if (!r.ok) return "";
    const d = await r.json();
    const treffer = (d.results || [])[0];
    if (!treffer || !treffer.urls) return "";
    const roh = treffer.urls.raw;
    // Eigene Groesse anfordern: schnell genug fuers Handy, scharf genug am Rechner
    if (roh) return roh + "&w=600&q=75&fit=crop&auto=format";
    return treffer.urls.small || "";
  } catch (e) {
    return "";
  }
}

export default async function handler(req, res) {
  const typ = (req.query.typ === "nomad") ? "nomad" : "deals";

  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=172800");

  try {
    const staedte = typ === "nomad"
      ? staedteFuerHeute(STAEDTE_NOMAD, ANZAHL)
      : staedteFuerHeute(STAEDTE_DEALS, ANZAHL);

    const auftrag = typ === "nomad"
      ? "Finde je eine Unterkunft in diesen Staedten: " + staedte.join(", ")
        + ". Sie sollen sich fuer Remote-Arbeit eignen: schnelles WLAN, "
        + "Schreibtisch oder Coworking-Bereich, und preislich fair sein."
      : "Finde je eine guenstige, gut bewertete Unterkunft in diesen Staedten: "
        + staedte.join(", ")
        + ". Bevorzuge die Budget-Kategorie: Hostels mit Privatzimmern, "
        + "einfache Stadthotels, Gaestehaeuser und Aparthotels. "
        + "KEINE Luxus- oder Fuenf-Sterne-Haeuser.";

    const system =
      "Du bist Hotel-Rechercheur. Deine einzige Aufgabe: echte Booking.com-Seiten finden.\n\n"
      + "ABLAUF:\n"
      + "1. Nutze web_search mit dem Muster: site:booking.com \"Stadt\" guenstiges Hotel\n"
      + "2. Nimm nur URLs der Form https://www.booking.com/hotel/XX/name.html\n"
      + "3. Erfinde NIEMALS eine URL, NIEMALS einen Preis und NIEMALS einen Rabatt.\n\n"
      + "Antworte NUR mit diesem JSON, ohne weiteren Text:\n"
      + '{"hotels":[{"name":"Hotelname","stadt":"Stadt","land":"Land",'
      + '"beschreibung":"ein kurzer Satz auf Deutsch",'
      + '"url":"https://www.booking.com/hotel/xx/name.html"}]}\n\n'
      + "Ein Haus pro Stadt, moeglichst fuer alle genannten Staedte. "
      + "In der Beschreibung KEINE Preise und KEINE Rabattversprechen nennen - "
      + "nur Lage und Ausstattung.";

    const antwort = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2500,
        system: system,
        messages: [{ role: "user", content: auftrag }],
        tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 8 }]
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
        url: url,
        bild: ""
      });
    });

    const liste = hotels.slice(0, ANZAHL);

    if (process.env.UNSPLASH_KEY && liste.length) {
      const bilder = await Promise.all(
        liste.map(function (h) { return stadtfoto(h.stadt); })
      );
      liste.forEach(function (h, i) { h.bild = bilder[i] || ""; });
    }

    return res.status(200).json({
      typ: typ,
      stand: new Date().toISOString().slice(0, 10),
      zeitraum: zeitraum(),
      hotels: liste
    });

  } catch (e) {
    // Bei einem Fehler nur kurz zwischenspeichern, damit der naechste
    // Aufruf es erneut versucht statt einen Tag lang leer zu bleiben.
    res.setHeader("Cache-Control", "public, s-maxage=300");
    return res.status(200).json({ typ: typ, hotels: [], fehler: true });
  }
}
