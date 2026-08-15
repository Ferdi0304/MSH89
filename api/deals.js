// api/deals.js
//
// Gemeinsamer Hotel-Cache fuer den KI-Berater.
//
// Ohne diesen Cache sucht jeder Besucher dieselbe Stadt neu - und jede
// Websuche kostet Geld. Hier wird das Ergebnis pro Stadt einmal
// gespeichert und danach von allen Besuchern genutzt.
//
// Der Speicher liegt im CDN von Vercel, nicht in einer Datenbank.
// Das ist einfach und kostenlos, hat aber eine Grenze: Vercel kann
// alte Eintraege verwerfen. Dann wird eben neu gesucht - kein Fehler,
// nur eine Suche mehr.

const BOOKING_HOTEL = /^https?:\/\/(www\.)?booking\.com\/hotel\/[a-z]{2}\//i;

// In-Memory-Speicher der laufenden Funktion. Ueberlebt einzelne Aufrufe,
// solange Vercel dieselbe Instanz wiederverwendet.
const SPEICHER = new Map();
const HALTBAR = 14 * 24 * 60 * 60 * 1000; // 14 Tage

function schluessel(stadt) {
  return (stadt || "").toLowerCase()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]/g, "");
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  // ---- Lesen: GET /api/deals?stadt=Barcelona ----
  if (req.method === "GET") {
    const k = schluessel(req.query.stadt);
    if (!k) return res.status(200).json({ hotels: [] });

    const eintrag = SPEICHER.get(k);
    if (!eintrag || Date.now() - eintrag.zeit > HALTBAR) {
      return res.status(200).json({ hotels: [] });
    }
    return res.status(200).json({ stadt: eintrag.stadt, hotels: eintrag.hotels });
  }

  // ---- Schreiben: POST mit { stadt, hotels } ----
  if (req.method === "POST") {
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
      const k = schluessel(body.stadt);
      if (!k) return res.status(200).json({ ok: false });

      const roh = Array.isArray(body.hotels) ? body.hotels : [];
      const gesehen = {};
      const sauber = [];

      roh.forEach(function (h) {
        if (!h || typeof h.url !== "string") return;
        const url = h.url.split("?")[0];
        if (!BOOKING_HOTEL.test(url)) return;   // nur echte Booking-Hotelseiten
        if (gesehen[url]) return;
        gesehen[url] = 1;
        sauber.push({
          name: String(h.name || "").trim().slice(0, 80),
          stadt: String(h.stadt || body.stadt || "").trim().slice(0, 40),
          url: url,
          fakten: String(h.fakten || "").trim().slice(0, 120)
        });
      });

      if (sauber.length === 0) return res.status(200).json({ ok: false });

      // Bestehende Eintraege ergaenzen statt ersetzen
      const alt = SPEICHER.get(k);
      const zusammen = alt ? alt.hotels.slice() : [];
      sauber.forEach(function (n) {
        if (!zusammen.some(function (a) { return a.url === n.url; })) zusammen.push(n);
      });

      SPEICHER.set(k, {
        stadt: String(body.stadt || "").trim().slice(0, 40),
        hotels: zusammen.slice(0, 12),
        zeit: Date.now()
      });

      // Speicher begrenzen: aelteste Staedte verwerfen
      if (SPEICHER.size > 300) {
        const aelteste = [...SPEICHER.entries()].sort(function (a, b) {
          return a[1].zeit - b[1].zeit;
        })[0];
        if (aelteste) SPEICHER.delete(aelteste[0]);
      }

      return res.status(200).json({ ok: true, anzahl: zusammen.length });
    } catch (e) {
      return res.status(200).json({ ok: false });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
