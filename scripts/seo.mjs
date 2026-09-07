// Laeuft nach "vite build" und erzeugt:
//   - eine echte HTML-Datei je Route (mit Titel, Beschreibung, Canonical,
//     JSON-LD und der Hotelliste als lesbarem Text im Quelltext)
//   - sitemap.xml
//
// Warum: Die React-App baut ihren Inhalt erst im Browser auf. Ein Crawler
// ohne JavaScript - und das sind die meisten KI-Crawler - sieht sonst nur
// <div id="root"></div>, also nichts.
//
// ACHTUNG: BASIS muss die Domain sein, unter der die Seite wirklich laeuft.
import fs from "fs";
import path from "path";

const BASIS = "https://myspecialhotel.com";
const DIST = "dist";

const src = fs.readFileSync("src/App.jsx", "utf8");
const a = src.indexOf("const HOTELS = ["), b = src.indexOf("\n];", a);
const HOTELS = eval(src.slice(a + "const HOTELS = ".length, b + 2));

const KATEGORIEN = [
  { pfad: "boutique-design", cat: "design", titel: "Boutique- & Designhotels",
    text: "Handverlesene Boutique- und Designhotels in Europa - Häuser mit eigener Handschrift, von Architektur bis Innenausstattung." },
  { pfad: "digitale-nomaden", cat: "nomad", titel: "Hotels für digitale Nomaden",
    text: "Unterkünfte mit schnellem WLAN, Coworking-Bereichen und Arbeitsplätzen im Zimmer - für alle, die unterwegs arbeiten." },
  { pfad: "hostels", cat: "hostel", titel: "Hostels",
    text: "Zentrale Hostels in europäischen Städten - mit Gemeinschaftsräumen, Privatzimmern und Schlafsälen." },
  { pfad: "luxus", cat: "luxury", titel: "Luxushotels",
    text: "Grandhotels und Luxushäuser in Europa - historische Adressen ebenso wie moderne Resorts." },
  { pfad: "ski-winterurlaub", cat: "ski", titel: "Skihotels & Winterurlaub",
    text: "Hotels in den Alpen mit Nähe zur Piste - für Skiurlaub und Winterwochenenden in Österreich, der Schweiz, Italien und Deutschland." },
  { pfad: "wellness", cat: "wellness", titel: "Wellness- & Spahotels",
    text: "Wellnesshotels mit Spa, Sauna und Ruhebereichen - in den Bergen, am See und am Meer." },
];

const inKat = (k) => HOTELS.filter(h => h.cat === k || (h.cats && h.cats.includes(k)));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Kopf- und Fussteile der gebauten index.html uebernehmen (Skript-/CSS-Verweise)
const gebaut = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const assets = [...gebaut.matchAll(/<(script|link)[^>]*(?:src|href)="\/assets\/[^"]+"[^>]*>(?:<\/script>)?/g)].map(m => m[0]).join("\n    ");

function seite({ pfad, titel, beschreibung, inhalt, jsonld }) {
  const url = BASIS + (pfad === "/" ? "/" : pfad);
  return `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(titel)}</title>
    <meta name="description" content="${esc(beschreibung)}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="MySpecialHotel" />
    <meta property="og:title" content="${esc(titel)}" />
    <meta property="og:description" content="${esc(beschreibung)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:locale" content="de_DE" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
    <!-- Nur fuer die Millisekunden, bis die App uebernimmt.
         WICHTIG: ausschliesslich #vorab ansprechen, niemals #root - sonst
         bleibt die Formatierung nach dem App-Start bestehen und presst das
         gesamte Layout in eine schmale Spalte. -->
    <style>
      body { margin: 0; background: #fff; }
      #vorab { font-family: Inter, system-ui, sans-serif; color: #1a1a2e;
               max-width: 900px; margin: 0 auto; padding: 48px 24px; }
      #vorab h1, #vorab h2 { font-family: 'Playfair Display', Georgia, serif; }
      #vorab h1 { font-size: 34px; margin: 0 0 12px; }
      #vorab h2 { font-size: 21px; margin: 32px 0 10px; }
      #vorab p { color: #6b7280; line-height: 1.7; margin: 0 0 12px; }
      #vorab ul { color: #6b7280; line-height: 1.9; padding-left: 20px; }
      #vorab a { color: #C9960C; }
    </style>
    ${assets}
  </head>
  <body>
    <div id="root"><div id="vorab">${inhalt}</div></div>
  </body>
</html>
`;
}

// Der Inhalt landet in #root und wird beim Start der App ersetzt.
// Er zeigt genau das, was die App an dieser Stelle auch zeigt - kein Cloaking.
function liste(hotels) {
  return `<ul>${hotels.map(h =>
    `<li>${esc(h.name)} &ndash; ${esc(h.city)}, ${esc(h.country)}</li>`).join("")}</ul>`;
}

const org = {
  "@context": "https://schema.org", "@type": "Organization",
  name: "MySpecialHotel", url: BASIS + "/",
  description: "Redaktionell ausgewählte Hotelempfehlungen für den deutschsprachigen Raum."
};

const seiten = [];

// Startseite
seiten.push({
  datei: "index.html", pfad: "/",
  titel: "MySpecialHotel – handverlesene Hotels und KI-Hotelberatung",
  beschreibung: `Handverlesene Hotelempfehlungen für Europa: Wellness, Ski, Boutique, Luxus, Hostels und Hotels für digitale Nomaden. Dazu ein KI-Berater, der passende Unterkünfte findet. ${HOTELS.length} Häuser, kostenlos und unabhängig.`,
  inhalt: `<h1>MySpecialHotel</h1><p>Handverlesene Hotelempfehlungen für Europa. ${HOTELS.length} Häuser in sechs Kategorien, dazu ein KI-Berater für passende Unterkünfte.</p>
    <h2>Kategorien</h2><ul>${KATEGORIEN.map(k => `<li><a href="/mein-hotel/${k.pfad}">${esc(k.titel)}</a> (${inKat(k.cat).length} Häuser)</li>`).join("")}</ul>
    <p><a href="/ki-berater">KI-Hotelberater</a></p>`,
  jsonld: {
    "@context": "https://schema.org", "@type": "WebSite", name: "MySpecialHotel", url: BASIS + "/",
    inLanguage: "de-DE", publisher: org
  }
});

// Kategorieseiten
KATEGORIEN.forEach(k => {
  const h = inKat(k.cat);
  seiten.push({
    datei: path.join("mein-hotel", k.pfad, "index.html"), pfad: "/mein-hotel/" + k.pfad,
    titel: `${k.titel} – ${h.length} Empfehlungen | MySpecialHotel`,
    beschreibung: `${k.text} ${h.length} handverlesene Häuser.`,
    inhalt: `<h1>${esc(k.titel)}</h1><p>${esc(k.text)}</p><h2>Unsere ${h.length} Empfehlungen</h2>${liste(h)}<p><a href="/">Zur Startseite</a></p>`,
    jsonld: {
      "@context": "https://schema.org", "@type": "ItemList", name: k.titel, description: k.text,
      numberOfItems: h.length,
      itemListElement: h.map((x, i) => ({
        "@type": "ListItem", position: i + 1,
        // Bewusst nur belegbare Angaben: kein Preis, keine Sterne, keine Bewertung
        item: { "@type": "Hotel", name: x.name, image: x.img,
          address: { "@type": "PostalAddress", addressLocality: x.city, addressCountry: x.country } }
      }))
    }
  });
});

// Übersicht "Mein Hotel"
seiten.push({
  datei: path.join("mein-hotel", "index.html"), pfad: "/mein-hotel",
  titel: "Mein Hotel – Hotels nach Kategorie | MySpecialHotel",
  beschreibung: "Hotels nach Kategorie: Boutique und Design, digitale Nomaden, Hostels, Luxus, Ski und Wellness.",
  inhalt: `<h1>Mein Hotel</h1><p>Wähle deine Kategorie:</p><ul>${KATEGORIEN.map(k => `<li><a href="/mein-hotel/${k.pfad}">${esc(k.titel)}</a> (${inKat(k.cat).length})</li>`).join("")}</ul>`,
  jsonld: { "@context": "https://schema.org", "@type": "CollectionPage", name: "Mein Hotel", url: BASIS + "/mein-hotel", publisher: org }
});

// KI-Berater
seiten.push({
  datei: path.join("ki-berater", "index.html"), pfad: "/ki-berater",
  titel: "KI-Hotelberater – Unterkunft per Chat finden | MySpecialHotel",
  beschreibung: "Beschreibe deinen Wunsch, und der KI-Berater sucht passende Unterkünfte und zeigt sie mit Buchungslink. Kostenlos und ohne Anmeldung.",
  inhalt: `<h1>KI-Hotelberater</h1><p>Beschreibe Ziel, Anlass und Stil - der Berater sucht passende Häuser und zeigt sie mit direktem Buchungslink. Kostenlos, ohne Anmeldung.</p><p><a href="/">Zur Startseite</a></p>`,
  jsonld: { "@context": "https://schema.org", "@type": "WebPage", name: "KI-Hotelberater", url: BASIS + "/ki-berater", publisher: org }
});

// Rechtstexte - nicht in die Sitemap, aber als Seite vorhanden
[["impressum", "Impressum"], ["datenschutz", "Datenschutzerklärung"]].forEach(([p, t]) => {
  seiten.push({
    datei: path.join(p, "index.html"), pfad: "/" + p, ausSitemap: true,
    titel: `${t} | MySpecialHotel`, beschreibung: `${t} von MySpecialHotel.`,
    inhalt: `<h1>${t}</h1><p><a href="/">Zur Startseite</a></p>`,
    jsonld: { "@context": "https://schema.org", "@type": "WebPage", name: t, url: BASIS + "/" + p }
  });
});

seiten.forEach(s => {
  const ziel = path.join(DIST, s.datei);
  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  fs.writeFileSync(ziel, seite(s));
});

const heute = new Date().toISOString().slice(0, 10);
const eintraege = seiten.filter(s => !s.ausSitemap).map(s =>
  `  <url><loc>${BASIS}${s.pfad === "/" ? "/" : s.pfad}</loc><lastmod>${heute}</lastmod><changefreq>weekly</changefreq><priority>${s.pfad === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n");
fs.writeFileSync(path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${eintraege}\n</urlset>\n`);

console.log(`SEO: ${seiten.length} Seiten erzeugt, Sitemap mit ${seiten.filter(s => !s.ausSitemap).length} Eintraegen`);
seiten.forEach(s => console.log(`   ${s.pfad.padEnd(32)} ${s.datei}`));
