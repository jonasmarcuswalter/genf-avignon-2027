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
  profile: string;
  url: string;
};

type BasecampRide = {
  id: "granon" | "finestre";
  name: string;
  route: string;
  km: number;
  gain: number;
  rideTime: string;
  surface: string;
  level: string;
  punchline: string;
  description: string;
  keyClimbs: string;
  bikeNote: string;
  komoot: string;
  tone: "granon" | "finestre";
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
  { name: "Col de Tamié", side: "Nordauffahrt von Faverges", day: "T1", km: "9,9", gain: "406", grade: "4,1", profile: "0% 91%, 12% 87%, 21% 74%, 32% 78%, 43% 56%, 55% 60%, 68% 42%, 80% 31%, 100% 17%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/col-de-tamie/profile/nordauffahrt-von-faverges/" },
  { name: "Col de la Madeleine", side: "Nordrampe von Feissons", day: "T2", km: "27,5", gain: "1.582", grade: "5,8", profile: "0% 93%, 11% 89%, 20% 83%, 30% 74%, 40% 69%, 49% 55%, 60% 52%, 70% 36%, 82% 27%, 100% 9%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/col-de-la-madeleine/profile/nordrampe-von-feissons/" },
  { name: "Col du Glandon", side: "Nordrampe von La Chambre", day: "T2–3", km: "24,0", gain: "1.483", grade: "6,2", profile: "0% 94%, 10% 90%, 19% 80%, 31% 81%, 42% 61%, 52% 57%, 64% 45%, 73% 25%, 85% 30%, 100% 7%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/col-du-glandon/profile/nordrampe-von-la-chambre/" },
  { name: "Alpe d’Huez", side: "Auffahrt von Bourg d’Oisans", day: "T3", km: "13,4", gain: "1.132", grade: "8,4", profile: "0% 94%, 9% 88%, 19% 78%, 29% 66%, 39% 58%, 50% 43%, 60% 37%, 70% 25%, 82% 17%, 100% 5%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/alpe-d-huez/profile/auffahrt-von-bourg-d-oisans/" },
  { name: "Col de Sarenne", side: "Westanfahrt von Bourg d’Oisans", day: "T3", km: "22,4", gain: "1.429", grade: "6,4", profile: "0% 94%, 10% 82%, 20% 76%, 31% 82%, 42% 59%, 54% 51%, 65% 35%, 75% 45%, 86% 22%, 100% 8%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/col-de-sarenne/profile/westanfahrt-von-bourg-d-oisans/" },
  { name: "Col du Lautaret", side: "Westauffahrt von Les Clapiers", day: "T4", km: "35,0", gain: "1.340", grade: "3,8", profile: "0% 94%, 14% 90%, 29% 82%, 41% 72%, 54% 66%, 66% 55%, 79% 43%, 89% 28%, 100% 17%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/col-du-lautaret/profile/westauffahrt-von-les-clapiers/" },
  { name: "Col du Galibier", side: "Südrampe vom Col du Lautaret", day: "T4", km: "8,6", gain: "597", grade: "6,9", profile: "0% 93%, 9% 86%, 19% 78%, 31% 68%, 42% 61%, 52% 48%, 63% 40%, 75% 24%, 87% 19%, 100% 5%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/col-du-galibier/profile/suedrampe-vom-col-du-lautaret/" },
  { name: "Col du Télégraphe", side: "Südanfahrt von Valloire", day: "T4", km: "4,9", gain: "176", grade: "3,6", profile: "0% 93%, 15% 87%, 27% 80%, 40% 74%, 54% 62%, 67% 55%, 80% 42%, 100% 28%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/col-du-telegraphe/profile/suedanfahrt-von-valloire/" },
  { name: "Col du Mont Cenis", side: "Nordanfahrt von Lanslebourg", day: "T5", km: "9,8", gain: "682", grade: "7,0", profile: "0% 94%, 10% 87%, 20% 71%, 31% 65%, 42% 68%, 53% 48%, 64% 38%, 75% 41%, 87% 20%, 100% 7%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/col-du-mont-cenis/profile/nordanfahrt-von-lanslebourg/" },
  { name: "Col de Montgenèvre", side: "Ostauffahrt von Cesana Torinese", day: "T5", km: "9,3", gain: "524", grade: "5,6", profile: "0% 92%, 12% 86%, 24% 76%, 38% 70%, 49% 54%, 61% 51%, 75% 34%, 87% 28%, 100% 12%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/col-de-montgenevre/profile/ostauffahrt-von-cesena-torinese/" },
  { name: "Col d’Izoard", side: "Nordrampe von Briançon", day: "T6", km: "19,2", gain: "1.211", grade: "6,3", profile: "0% 94%, 10% 87%, 20% 74%, 31% 70%, 42% 56%, 52% 49%, 63% 36%, 73% 20%, 84% 23%, 100% 7%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/col-d-izoard/profile/nordrampe-von-briancon/" },
  { name: "Col de Vars", side: "Nordrampe von Guillestre", day: "T6", km: "19,0", gain: "1.109", grade: "5,8", profile: "0% 94%, 10% 82%, 22% 75%, 32% 63%, 43% 66%, 54% 47%, 65% 51%, 76% 32%, 87% 26%, 100% 9%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/col-de-vars/profile/nordrampe-von-guillestre/" },
  { name: "Col de la Cayolle", side: "Nordrampe von Barcelonnette", day: "T7", km: "30,0", gain: "1.190", grade: "4,0", profile: "0% 95%, 12% 89%, 25% 80%, 38% 75%, 50% 60%, 63% 54%, 75% 39%, 88% 27%, 100% 14%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/col-de-la-cayolle/profile/nordrampe-von-barcelonnette/" },
  { name: "Mont Ventoux", side: "Südrampe von Bédoin", day: "T10", km: "21,2", gain: "1.599", grade: "7,5", profile: "0% 95%, 9% 91%, 18% 81%, 29% 75%, 39% 58%, 50% 45%, 60% 35%, 70% 21%, 80% 18%, 90% 10%, 100% 5%, 100% 100%, 0% 100%", url: "https://www.quaeldich.de/paesse/mont-ventoux/profile/suedrampe-von-bedoin/" },
];

const basecampRides: BasecampRide[] = [
  {
    id: "granon",
    name: "Col du Granon",
    route: "Briançon → Granon → Briançon",
    km: 34,
    gain: 1207,
    rideTime: "3–4 h",
    surface: "100 % Asphalt",
    level: "Kurz. Steil. Sonnig.",
    punchline: "Der freie Tag, an dem man nur kurz nachschaut, ob die Beine noch da sind.",
    description: "34 Kilometer, aber die Höhe steht praktisch senkrecht im Weg: von Briançon hoch bis knapp 2.400 Meter und wieder zurück. Die Passhöhe liegt im GPX bei Kilometer 17,2 — danach gibt es nur noch Aussicht und Bremsbeläge.",
    keyClimbs: "Col du Granon · ungefähr 1.150 HM am Stück",
    bikeNote: "Reines Rennrad-Terrain. Leichte Übersetzung, volle Bidons und keinen Termin danach planen.",
    komoot: "https://www.komoot.com/de-de/tour/3169902184?share_token=alfxWBeZINPR4m2nhOGP7FXjdXoGNA1J4dFMwthBAXpmXrDFqz&ref=wtd&t_s=referral&t_cid=route_share&t_ref_username=1472812756621",
    tone: "granon",
  },
  {
    id: "finestre",
    name: "Colle delle Finestre",
    route: "Briançon → Montgenèvre → Susa → Finestre → Sestriere → Briançon",
    km: 133,
    gain: 3542,
    rideTime: "8–10 h",
    surface: "Asphalt + Schotter bergauf",
    level: "All-Day. Schotter. Ansage.",
    punchline: "Die ganz große Tageskarte für Menschen, die am freien Tag noch sehr viel Landschaft möchten.",
    description: "Die große italienische Runde: erst über Montgenèvre ins Tal von Susa, dann rund 1.400 Höhenmeter zum Finestre. Der Schotterteil liegt auf der Auffahrt — genau so, wie bestellt. Über Sestriere und Montgenèvre kommt ihr mit der letzten Würde nach Briançon zurück.",
    keyClimbs: "Montgenèvre · Colle delle Finestre · Sestriere · Montgenèvre retour",
    bikeNote: "30 mm sind das Minimum, 32 mm und ein wirklich leichter Gang die deutlich bessere Idee. Nur für die Fraktion, die am freien Tag noch etwas Höhenluft möchte.",
    komoot: "https://www.komoot.com/de-de/tour/3169894892?share_token=axYNKWBmZqB5xh65wT7z3ZtPAsFhbIA37r8TsDUX4GL3tnzGk6&ref=wtd&t_s=referral&t_cid=route_share&t_ref_username=1472812756621",
    tone: "finestre",
  },
];

const format = new Intl.NumberFormat("de-CH");

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedBasecampRideId, setSelectedBasecampRideId] = useState<BasecampRide["id"]>("granon");
  const selectedStage = stages.find((stage) => stage.day === selectedDay) ?? stages[0];
  const selectedBasecampRide = basecampRides.find((ride) => ride.id === selectedBasecampRideId) ?? basecampRides[0];
  const totalKm = useMemo(() => stages.reduce((sum, stage) => sum + stage.km, 0), []);
  const totalGain = useMemo(() => stages.reduce((sum, stage) => sum + stage.gain, 0), []);
  const mapStops = useMemo(() => stages.map(({ day, stop, coordinates }) => ({ day, name: stop, coordinates })), []);

  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-sun" aria-hidden="true" />
        <div className="hero-horizon" aria-hidden="true" />
        <nav className="nav shell" aria-label="Hauptnavigation">
          <a className="wordmark" href="#top"><span aria-hidden="true">☼</span><b>ULLAUB</b><small>TOUR DES COLS</small></a>
          <div className="nav-links"><a href="#route">Reiseplan</a><a href="#stages">Strampelplan</a><a href="#briancon">Ullaub-Zone</a><a href="#cols">All inclusive</a></div>
          <span className="edition">SEP 2027</span>
        </nav>
        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow">Genf → Avignon · Rennrad-Edition</p>
            <h1><span>ULLAUB</span><em>TOUR DES COLS</em></h1>
            <p className="hero-subline">Genf → Avignon · 04–18 September 2027</p>
            <p className="hero-lead">Zehn Tage Strampelplan durch die Alpen, fünf Tage Ullaub-Zone in Briançon und zum Dessert der Ventoux. Sonnencreme einpacken. Carbs laden. Losfahren.</p>
            <div className="hero-actions"><a className="button button-primary" href="#route">Reiseplan öffnen <span>↓</span></a><a className="button button-quiet" href={komootUrl} target="_blank" rel="noreferrer">Komoot einchecken <span>↗</span></a></div>
          </div>
          <aside className="hero-stats" aria-label="Tourkennzahlen">
            <div><strong>{format.format(totalKm)}</strong><span>km Ullaub</span></div>
            <div><strong>~{format.format(totalGain)}</strong><span>hm inklusive</span></div>
            <div><strong>10</strong><span>Strampeltage</span></div>
            <div><strong>14</strong><span>Cols à la carte</span></div>
          </aside>
          <div className="all-inclusive-sticker" aria-hidden="true"><span>ALL</span><strong>INCL.</strong><small>17K HM</small></div>
        </div>
        <div className="hero-rule shell"><span>04—18 SEPTEMBER</span><span>ALPEN → PROVENCE</span><span>POOLBLAU, BERGE, BIDONS</span></div>
      </section>

      <section className="route-section" id="route">
        <div className="section-heading shell"><div><p className="eyebrow dark">01 · Reiseplan</p><h2>Poolblau los.<br />Provence an.</h2></div><p className="section-copy">Das ist die echte GPX-Linie: zehn Etappen, ein großes Alpenprogramm und Übernachtungsorte, in denen es auch wirklich ein Bett gibt.</p></div>
        <div className="map-frame"><RouteMap stops={mapStops} /><div className="map-key"><span><i /> GPX-Reiseplan</span><span><b>1</b> Check-in</span></div></div>
        <div className="timeline shell"><div><small>CHECK-IN</small><b>Genf</b><span>Sa 04 Sep</span></div><i /><div><small>ALPENBLOCK</small><b>Briançon</b><span>Mi 08 Sep</span></div><i /><div className="pause"><small>ULLAUB-ZONE</small><b>5 freie Tage</b><span>09–13 Sep</span></div><i /><div><small>CHECK-OUT</small><b>Avignon</b><span>Sa 18 Sep</span></div></div>
      </section>

      <section className="stages-section shell" id="stages">
        <div className="section-heading"><div><p className="eyebrow dark">02 · Strampelplan</p><h2>Raus aus dem Bett.<br />Rauf auf den Col.</h2></div><p className="section-copy">Kein Etappenmarathon für die Galerie: meistens 74–111 km. Erst fünf Tage Alpen, dann fünf Tage Pause, dann die große südliche Abfahrt.</p></div>
        <div className="stage-layout">
          <div className="stage-selector">
            <label htmlFor="stage-select">Tag aussuchen</label>
            <select id="stage-select" value={selectedDay} onChange={(event) => setSelectedDay(Number(event.target.value))}>
              <optgroup label="Genf bis Briançon">
                {stages.slice(0, 5).map((stage) => <option value={stage.day} key={stage.day}>Tag {stage.day} · {stage.route}</option>)}
              </optgroup>
              <optgroup label="Nach der Ullaub-Zone">
                {stages.slice(5).map((stage) => <option value={stage.day} key={stage.day}>Tag {stage.day} · {stage.route}</option>)}
              </optgroup>
            </select>
            <div className="rest-break"><span>09–13 Sep · Ullaub-Zone</span><strong>Briançon macht Pause.</strong><small>Fünf freie Tage zwischen Tag 5 und 6: Haus, Sauna, Espresso, Carbs laden — oder eine der Ausfahrten darunter.</small></div>
          </div>
          <article className={`stage-detail ${selectedStage.tone === "warm" ? "is-warm" : ""}`} aria-live="polite">
            <div className="stage-detail-top"><span>ETAPPE {String(selectedStage.day).padStart(2, "0")}</span><small>{selectedStage.date}</small></div>
            <h3>{selectedStage.route}</h3>
            <div className="big-numbers"><div><b>{selectedStage.km}</b><span>KM</span></div><div><b>+{format.format(selectedStage.gain)}</b><span>HM</span></div></div>
            <div className="detail-block"><small>COL-MENÜ</small><p>{selectedStage.cols.join(" · ")}</p></div>
            <div className="detail-block booking"><small>BETT & BASIS · {selectedStage.stop.toUpperCase()}</small><p>{selectedStage.booking}</p></div>
          </article>
        </div>
      </section>

      <section className="basecamp-section" id="briancon">
        <div className="pool-orb" aria-hidden="true" />
        <div className="shell">
          <div className="section-heading basecamp-heading"><div><p className="eyebrow">03 · Ullaub-Zone Briançon</p><h2>Freie Tage.<br /><em>Freie Beine.</em></h2></div><p className="section-copy">Briançon ist die Station zum Wohnen statt Weiterziehen. Die zwei Runden sind Optionen für diese Zeit — kein Pflichtprogramm.</p></div>
          <div className="basecamp-layout">
            <div className="basecamp-selector">
              <label htmlFor="basecamp-ride-select">Ausfahrt wählen</label>
              <select id="basecamp-ride-select" value={selectedBasecampRideId} onChange={(event) => setSelectedBasecampRideId(event.target.value as BasecampRide["id"])}>
                {basecampRides.map((ride) => <option value={ride.id} key={ride.id}>{ride.name} · {ride.km} km · +{format.format(ride.gain)} HM</option>)}
              </select>
              <div className="basecamp-options" aria-label="Optionale Briançon-Ausfahrten">
                {basecampRides.map((ride) => <button aria-pressed={selectedBasecampRide.id === ride.id} className={selectedBasecampRide.id === ride.id ? "is-selected" : ""} key={ride.id} type="button" onClick={() => setSelectedBasecampRideId(ride.id)}><span>{ride.id === "granon" ? "01" : "02"}</span><strong>{ride.name}</strong><small>{ride.level}</small></button>)}
              </div>
              <p className="basecamp-rule">Die Hauptoption bleibt immer: ausschlafen, Espresso, Sauna und Carbs laden. Kein Rechtfertigungsformular nötig.</p>
            </div>
            <article className={`basecamp-detail is-${selectedBasecampRide.tone}`} aria-live="polite">
              <div className="basecamp-detail-top"><span>OPTION {selectedBasecampRide.id === "granon" ? "01" : "02"}</span><small>{selectedBasecampRide.surface}</small></div>
              <h3>{selectedBasecampRide.name}</h3>
              <p className="basecamp-route">{selectedBasecampRide.route}</p>
              <div className="basecamp-big-numbers"><div><b>{selectedBasecampRide.km}</b><span>KM</span></div><div><b>+{format.format(selectedBasecampRide.gain)}</b><span>HM</span></div><div><b>{selectedBasecampRide.rideTime}</b><span>FAHRZEIT</span></div></div>
              <div className="basecamp-copy"><p>{selectedBasecampRide.punchline}</p><small>{selectedBasecampRide.description}</small></div>
              <div className="basecamp-meta"><div><span>BERGPROGRAMM</span><p>{selectedBasecampRide.keyClimbs}</p></div><div><span>RAD-CHECK</span><p>{selectedBasecampRide.bikeNote}</p></div></div>
              <a className="basecamp-link" href={selectedBasecampRide.komoot} target="_blank" rel="noreferrer">In Komoot einchecken <span>↗</span></a>
            </article>
          </div>
        </div>
      </section>

      <section className="cols-section" id="cols">
        <div className="shell"><div className="section-heading cols-heading"><div><p className="eyebrow">04 · All-inclusive-Höhenmeter</p><h2>Die Cols.<br />Sonnencreme reicht nicht.</h2></div><p className="section-copy">Alle Auffahrten mit den exakten Quäldich-Zahlen. Ein Klick führt direkt zum Höhenprofil — für Vorfreude, Nervosität und Gangwahl.</p></div>
          <div className="col-grid">
            {cols.map((col) => <a className={`col-card ${col.name === "Alpe d’Huez" || col.name === "Mont Ventoux" ? "featured" : ""}`} href={col.url} target="_blank" rel="noreferrer" key={col.name}><div className="col-card-head"><span>{col.day}</span><b>{col.name}</b><i>↗</i></div><p>{col.side}</p><div className="climb-profile" role="img" aria-label={`Stilisiertes Höhenprofil für ${col.name}`}><span>HÖHENPROFIL</span><i className="profile-fill" style={{ clipPath: `polygon(${col.profile})` }} /><i className="profile-shade" style={{ clipPath: `polygon(${col.profile})` }} /><i className="profile-sun" /></div><div className="col-stats"><span><strong>{col.km}</strong> km</span><span><strong>+{col.gain}</strong> hm</span><span><strong>Ø {col.grade}</strong> %</span></div></a>)}
          </div>
        </div>
      </section>

      <section className="closing shell"><p className="eyebrow dark">Ullaub Ende · Heimreise an</p><h2>Gut gebräunt.<br /><em>Stabil gefahren.</em></h2><p>Die kleinen Übernachtungsorte sind der einzige echte Engpass. Alles andere: früh buchen, gut essen, Bidons füllen und die Berge nicht persönlich nehmen.</p><a className="button button-primary" href="#top">Zurück zum Pool <span>↑</span></a></section>
      <footer className="footer shell"><span>ULLAUB · GENF → AVIGNON</span><span>GPX-STAND · 04 AUG 2026</span><span>TOUR DES COLS · 2027</span></footer>
    </main>
  );
}
