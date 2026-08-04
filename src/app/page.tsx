"use client";

import { useMemo, useState } from "react";
import RouteMap from "@/components/route-map";

type Stage = {
  day: number;
  date: string;
  route: string;
  stop: string;
  km: number;
  gain: number;
  cols: string[];
  booking: string;
  coordinates: [number, number];
  tone?: "warm";
};

type Col = {
  name: string;
  side: string;
  day: string;
  km: string;
  gain: string;
  grade: string;
  url: string;
};

const komootUrl = "https://www.komoot.com/de-de/tour/3168160179?share_token=abVzeXcWdamobmQ3OkvlriMsbYu5lKUeHb5WmCa7qWVoBz6zU4&ref=wtd&t_s=referral&t_cid=route_share&t_ref_username=1472812756621";

const stages: Stage[] = [
  { day: 1, date: "Sa · 04 Sep", route: "Genf → Albertville", stop: "Albertville", km: 88, gain: 1025, cols: ["Col de Tamié"], booking: "Große Auswahl: Hotels, Restaurants, Versorgung.", coordinates: [45.66911, 6.39008] },
  { day: 2, date: "So · 05 Sep", route: "Albertville → Saint-Colomban", stop: "Saint-Colomban-des-Villards", km: 74, gain: 2302, cols: ["Col de la Madeleine", "Glandon beginnt"], booking: "Kleine Auswahl – die Übernachtung früh sichern.", coordinates: [45.29370, 6.22591] },
  { day: 3, date: "Mo · 06 Sep", route: "Saint-Colomban → Le Freney", stop: "Le Freney-d’Oisans", km: 79, gain: 2268, cols: ["Glandon fertig", "Alpe d’Huez", "Col de Sarenne"], booking: "Auberge, B&B und Hotels: früh buchen.", coordinates: [45.04998, 6.14270], tone: "warm" },
  { day: 4, date: "Di · 07 Sep", route: "Le Freney → Lanslebourg", stop: "Lanslebourg-Mont-Cenis", km: 109, gain: 2439, cols: ["Lautaret", "Galibier", "Télégraphe"], booking: "Bergort mit Hotels, Essen und Einkauf.", coordinates: [45.28426, 6.86861] },
  { day: 5, date: "Mi · 08 Sep", route: "Lanslebourg → Briançon", stop: "Briançon", km: 95, gain: 2147, cols: ["Mont Cenis", "Montgenèvre"], booking: "Stadtbasis: breite Hotel- und Gastroauswahl.", coordinates: [44.89919, 6.64128] },
  { day: 6, date: "Di · 14 Sep", route: "Briançon → Barcelonnette", stop: "Barcelonnette", km: 100, gain: 2191, cols: ["Izoard", "Vars"], booking: "Stadt mit breiter Auswahl und guter Versorgung.", coordinates: [44.38576, 6.65039] },
  { day: 7, date: "Mi · 15 Sep", route: "Barcelonnette → Saint-André", stop: "Saint-André-les-Alpes", km: 111, gain: 1876, cols: ["Col de la Cayolle"], booking: "Tourismusort – früh buchen.", coordinates: [43.96862, 6.50692] },
  { day: 8, date: "Do · 16 Sep", route: "Saint-André → Sisteron", stop: "Sisteron", km: 69, gain: 223, cols: ["Kein großer Col"], booking: "Entspannte Stadtetappe, gute Verfügbarkeit.", coordinates: [44.16423, 5.94972] },
  { day: 9, date: "Fr · 17 Sep", route: "Sisteron → Villes-sur-Auzon", stop: "Villes-sur-Auzon", km: 88, gain: 939, cols: ["Gorges de la Nesque"], booking: "Gîtes, B&B, Camping – begrenzter Bestand.", coordinates: [44.05882, 5.23384] },
  { day: 10, date: "Sa · 18 Sep", route: "Villes-sur-Auzon → Avignon", stop: "Avignon", km: 87, gain: 1588, cols: ["Mont Ventoux ab Bédoin"], booking: "Finish mit maximaler Hotelauswahl.", coordinates: [43.94258, 4.80511], tone: "warm" },
];

const cols: Col[] = [
  { name: "Col de Tamié", side: "Nordauffahrt von Faverges", day: "T1", km: "9,9", gain: "406", grade: "4,1", url: "https://www.quaeldich.de/paesse/col-de-tamie/profile/nordauffahrt-von-faverges/" },
  { name: "Col de la Madeleine", side: "Nordrampe von Feissons", day: "T2", km: "27,5", gain: "1.582", grade: "5,8", url: "https://www.quaeldich.de/paesse/col-de-la-madeleine/profile/nordrampe-von-feissons/" },
  { name: "Col du Glandon", side: "Nordrampe von La Chambre", day: "T2–3", km: "24,0", gain: "1.483", grade: "6,2", url: "https://www.quaeldich.de/paesse/col-du-glandon/profile/nordrampe-von-la-chambre/" },
  { name: "Alpe d’Huez", side: "Auffahrt von Bourg d’Oisans", day: "T3", km: "13,4", gain: "1.132", grade: "8,4", url: "https://www.quaeldich.de/paesse/alpe-d-huez/profile/auffahrt-von-bourg-d-oisans/" },
  { name: "Col de Sarenne", side: "Westanfahrt von Bourg d’Oisans", day: "T3", km: "22,4", gain: "1.429", grade: "6,4", url: "https://www.quaeldich.de/paesse/col-de-sarenne/profile/westanfahrt-von-bourg-d-oisans/" },
  { name: "Col du Lautaret", side: "Westauffahrt von Les Clapiers", day: "T4", km: "35,0", gain: "1.340", grade: "3,8", url: "https://www.quaeldich.de/paesse/col-du-lautaret/profile/westauffahrt-von-les-clapiers/" },
  { name: "Col du Galibier", side: "Südrampe vom Col du Lautaret", day: "T4", km: "8,6", gain: "597", grade: "6,9", url: "https://www.quaeldich.de/paesse/col-du-galibier/profile/suedrampe-vom-col-du-lautaret/" },
  { name: "Col du Télégraphe", side: "Südanfahrt von Valloire", day: "T4", km: "4,9", gain: "176", grade: "3,6", url: "https://www.quaeldich.de/paesse/col-du-telegraphe/profile/suedanfahrt-von-valloire/" },
  { name: "Col du Mont Cenis", side: "Nordanfahrt von Lanslebourg", day: "T5", km: "9,8", gain: "682", grade: "7,0", url: "https://www.quaeldich.de/paesse/col-du-mont-cenis/profile/nordanfahrt-von-lanslebourg/" },
  { name: "Col de Montgenèvre", side: "Ostauffahrt von Cesana Torinese", day: "T5", km: "9,3", gain: "524", grade: "5,6", url: "https://www.quaeldich.de/paesse/col-de-montgenevre/profile/ostauffahrt-von-cesena-torinese/" },
  { name: "Col d’Izoard", side: "Nordrampe von Briançon", day: "T6", km: "19,2", gain: "1.211", grade: "6,3", url: "https://www.quaeldich.de/paesse/col-d-izoard/profile/nordrampe-von-briancon/" },
  { name: "Col de Vars", side: "Nordrampe von Guillestre", day: "T6", km: "19,0", gain: "1.109", grade: "5,8", url: "https://www.quaeldich.de/paesse/col-de-vars/profile/nordrampe-von-guillestre/" },
  { name: "Col de la Cayolle", side: "Nordrampe von Barcelonnette", day: "T7", km: "30,0", gain: "1.190", grade: "4,0", url: "https://www.quaeldich.de/paesse/col-de-la-cayolle/profile/nordrampe-von-barcelonnette/" },
  { name: "Mont Ventoux", side: "Südrampe von Bédoin", day: "T10", km: "21,2", gain: "1.599", grade: "7,5", url: "https://www.quaeldich.de/paesse/mont-ventoux/profile/suedrampe-von-bedoin/" },
];

const format = new Intl.NumberFormat("de-CH");

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(1);
  const selectedStage = stages.find((stage) => stage.day === selectedDay) ?? stages[0];
  const totalKm = useMemo(() => stages.reduce((sum, stage) => sum + stage.km, 0), []);
  const totalGain = useMemo(() => stages.reduce((sum, stage) => sum + stage.gain, 0), []);
  const mapStops = useMemo(() => stages.map(({ day, stop, coordinates }) => ({ day, name: stop, coordinates })), []);

  return (
    <main>
      <section className="hero" id="top">
        <nav className="nav shell" aria-label="Hauptnavigation">
          <a className="wordmark" href="#top"><span>∕∕</span> GRAND TOUR</a>
          <div className="nav-links"><a href="#route">Route</a><a href="#stages">Etappen</a><a href="#cols">Cols</a></div>
          <span className="edition">SEP 2027</span>
        </nav>
        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow">Rennrad-Bikepacking · Frankreich</p>
            <h1>Genf<br /><em>→</em> Avignon</h1>
            <p className="hero-lead">Ein Straßenband durch die französischen Alpen. Zehn Tage fahren, fünf Tage Briançon, ein Ventoux-Finale.</p>
            <div className="hero-actions"><a className="button button-primary" href="#route">Route erkunden <span>↓</span></a><a className="button button-quiet" href={komootUrl} target="_blank" rel="noreferrer">Tour in Komoot <span>↗</span></a></div>
          </div>
          <aside className="hero-stats" aria-label="Tourkennzahlen">
            <div><strong>{format.format(totalKm)}</strong><span>km GPX</span></div>
            <div><strong>~{format.format(totalGain)}</strong><span>Höhenmeter</span></div>
            <div><strong>10</strong><span>Fahrtage</span></div>
            <div><strong>14</strong><span>Cols</span></div>
          </aside>
        </div>
        <div className="hero-rule shell"><span>04—18 SEPTEMBER</span><span>ALPEN → PROVENCE</span><span>CARBS LADEN, DANN KURBELN</span></div>
      </section>

      <section className="route-section" id="route">
        <div className="section-heading shell"><div><p className="eyebrow dark">01 · Die Strecke</p><h2>Ein Band von Genf<br />in die Provence.</h2></div><p className="section-copy">Die Linie auf der Karte ist deine echte GPX-Route. Jede Zahl markiert das Ende eines Fahrtags und den Ort, an dem das Bett schon stehen sollte.</p></div>
        <div className="map-frame"><RouteMap stops={mapStops} /><div className="map-key"><span><i /> GPX-Route</span><span><b>1</b> Etappenziel</span></div></div>
        <div className="timeline shell"><div><small>START</small><b>Genf</b><span>Sa 04 Sep</span></div><i /><div><small>ALPENBLOCK</small><b>Briançon</b><span>Mi 08 Sep</span></div><i /><div className="pause"><small>BASECAMP</small><b>5 Pausentage</b><span>09–13 Sep</span></div><i /><div><small>FINISH</small><b>Avignon</b><span>Sa 18 Sep</span></div></div>
      </section>

      <section className="stages-section shell" id="stages">
        <div className="section-heading"><div><p className="eyebrow dark">02 · Tagesrhythmus</p><h2>Fahren. Essen.<br />Schlafen. Repeat.</h2></div><p className="section-copy">Nicht gottlos kurz und nicht Dauerfolter: meistens 74–111 km, mit einem echten Basecamp in Briançon, bevor es in die Provence geht.</p></div>
        <div className="stage-layout">
          <div className="stage-selector">
            <label htmlFor="stage-select">Etappe auswählen</label>
            <select id="stage-select" value={selectedDay} onChange={(event) => setSelectedDay(Number(event.target.value))}>
              <optgroup label="Genf bis Briançon">
                {stages.slice(0, 5).map((stage) => <option value={stage.day} key={stage.day}>Tag {stage.day} · {stage.route}</option>)}
              </optgroup>
              <optgroup label="Nach dem Basecamp">
                {stages.slice(5).map((stage) => <option value={stage.day} key={stage.day}>Tag {stage.day} · {stage.route}</option>)}
              </optgroup>
            </select>
            <div className="rest-break"><span>09–13 Sep</span><strong>Briançon Basecamp</strong><small>Fünf Pausentage zwischen Tag 5 und 6. Granon nur freiwillig.</small></div>
          </div>
          <article className={`stage-detail ${selectedStage.tone === "warm" ? "is-warm" : ""}`}>
            <div className="stage-detail-top"><span>TAG {String(selectedStage.day).padStart(2, "0")}</span><small>{selectedStage.date}</small></div>
            <h3>{selectedStage.route}</h3>
            <div className="big-numbers"><div><b>{selectedStage.km}</b><span>KM</span></div><div><b>+{format.format(selectedStage.gain)}</b><span>HM</span></div></div>
            <div className="detail-block"><small>COLS AUF DIESER ETAPPE</small><p>{selectedStage.cols.join(" · ")}</p></div>
            <div className="detail-block booking"><small>ÜBERNACHTEN IN {selectedStage.stop.toUpperCase()}</small><p>{selectedStage.booking}</p></div>
          </article>
        </div>
      </section>

      <section className="cols-section" id="cols">
        <div className="shell"><div className="section-heading cols-heading"><div><p className="eyebrow">03 · Die Anstiege</p><h2>Die Col-Liste.<br />Keine Ausreden.</h2></div><p className="section-copy">Klassische Auffahrten mit den jeweiligen Quäldich-Kennzahlen. Ein Klick bringt direkt zum vollständigen Höhenprofil.</p></div>
          <div className="col-grid">
            {cols.map((col) => <a className={`col-card ${col.name === "Alpe d’Huez" || col.name === "Mont Ventoux" ? "featured" : ""}`} href={col.url} target="_blank" rel="noreferrer" key={col.name}><div className="col-card-head"><span>{col.day}</span><b>{col.name}</b><i>↗</i></div><p>{col.side}</p><div className="col-stats"><span><strong>{col.km}</strong> km</span><span><strong>+{col.gain}</strong> hm</span><span><strong>Ø {col.grade}</strong> %</span></div></a>)}
          </div>
        </div>
      </section>

      <section className="closing shell"><p className="eyebrow dark">The only strategy</p><h2>Früh buchen.<br /><em>Stabil</em> fahren.</h2><p>Die kleinen Übernachtungsorte sind der Engpass. Der Rest ist: ordentlich essen, nicht am ersten Berg platzen und die Aussicht mitnehmen.</p><a className="button button-primary" href="#top">Zurück zum Start <span>↑</span></a></section>
      <footer className="footer shell"><span>GENF → AVIGNON</span><span>GPX-STAND · 04 AUG 2026</span><span>2027 TOUR COMPANION</span></footer>
    </main>
  );
}
