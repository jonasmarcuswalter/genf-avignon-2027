"use client";

/* eslint-disable @next/next/no-img-element -- Pre-compressed, art-directed assets stay direct for the GitHub Pages static export. */

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
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
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const assetPath = (path: string) => `${basePath}${path}`;

export default function Home() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedBasecampRideId, setSelectedBasecampRideId] = useState<BasecampRide["id"]>("granon");
  const progressRef = useRef<HTMLSpanElement>(null);
  const assemblyRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const routeRef = useRef<HTMLElement>(null);
  const stagesRef = useRef<HTMLElement>(null);
  const carbRef = useRef<HTMLElement>(null);
  const resortRef = useRef<HTMLElement>(null);
  const colsRef = useRef<HTMLElement>(null);
  const closingRef = useRef<HTMLElement>(null);
  const selectedStage = stages.find((stage) => stage.day === selectedDay) ?? stages[0];
  const selectedBasecampRide = basecampRides.find((ride) => ride.id === selectedBasecampRideId) ?? basecampRides[0];
  const totalKm = useMemo(() => stages.reduce((sum, stage) => sum + stage.km, 0), []);
  const totalGain = useMemo(() => stages.reduce((sum, stage) => sum + stage.gain, 0), []);
  const mapStops = useMemo(() => stages.map(({ day, stop, coordinates }) => ({ day, name: stop, coordinates })), []);

  useEffect(() => {
    let frame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateProgress = () => {
      frame = 0;
      const clamp = (value: number) => Math.min(1, Math.max(0, value));
      const phase = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
      const reveal = (element: HTMLElement | null) => {
        if (!element || reducedMotion.matches) return 1;
        const rect = element.getBoundingClientRect();
        return clamp((window.innerHeight * 0.9 - rect.top) / (window.innerHeight * 0.82));
      };
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? clamp(window.scrollY / scrollable) : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleY(${progress})`;

      const hero = heroRef.current;
      if (hero) {
        const heroProgress = reducedMotion.matches ? 0 : clamp(window.scrollY / window.innerHeight);
        hero.style.setProperty("--hero-media-y", `${heroProgress * 92}px`);
        hero.style.setProperty("--hero-media-scale", String(1 + heroProgress * 0.09));
        hero.style.setProperty("--hero-title-y", `${heroProgress * -46}px`);
        hero.style.setProperty("--hero-key-y", `${heroProgress * 46}px`);
        hero.style.setProperty("--hero-key-turn", `${8 + heroProgress * 38}deg`);
      }

      const assembly = assemblyRef.current;
      if (assembly) {
        const rect = assembly.getBoundingClientRect();
        const travel = Math.max(1, assembly.offsetHeight - window.innerHeight);
        const leadIn = window.innerHeight * 0.55;
        const assemblyProgress = reducedMotion.matches ? 1 : clamp((leadIn - rect.top) / (travel + leadIn));
        const tileA = phase(assemblyProgress, 0, 0.34);
        const tileB = phase(assemblyProgress, 0.1, 0.46);
        const tileC = phase(assemblyProgress, 0.2, 0.56);
        const route = phase(assemblyProgress, 0.46, 0.8);
        const copy = phase(assemblyProgress, 0.72, 0.96);
        assembly.style.setProperty("--tile-a", String(tileA));
        assembly.style.setProperty("--tile-a-x", `${-58 * (1 - tileA)}vw`);
        assembly.style.setProperty("--tile-a-y", `${-16 * (1 - tileA)}vh`);
        assembly.style.setProperty("--tile-a-r", `${-8 * (1 - tileA)}deg`);
        assembly.style.setProperty("--tile-b", String(tileB));
        assembly.style.setProperty("--tile-b-y", `${62 * (1 - tileB)}vh`);
        assembly.style.setProperty("--tile-b-scale", String(0.82 + tileB * 0.18));
        assembly.style.setProperty("--tile-c", String(tileC));
        assembly.style.setProperty("--tile-c-x", `${58 * (1 - tileC)}vw`);
        assembly.style.setProperty("--tile-c-y", `${-13 * (1 - tileC)}vh`);
        assembly.style.setProperty("--tile-c-r", `${9 * (1 - tileC)}deg`);
        assembly.style.setProperty("--route", String(route));
        assembly.style.setProperty("--route-dash", `${1100 * (1 - route)}px`);
        assembly.style.setProperty("--assembly-copy", String(copy));
        assembly.style.setProperty("--assembly-copy-y", `${38 * (1 - copy)}px`);
      }

      const routeSection = routeRef.current;
      if (routeSection) {
        const headingAmount = reveal(routeSection);
        const mapAmount = reveal(routeSection.querySelector<HTMLElement>(".map-frame"));
        routeSection.style.setProperty("--map-fold", `${42 * (1 - mapAmount)}%`);
        routeSection.style.setProperty("--map-y", `${74 * (1 - mapAmount)}px`);
        routeSection.style.setProperty("--map-r", `${-1.8 * (1 - mapAmount)}deg`);
        routeSection.style.setProperty("--map-reveal", String(mapAmount));
        routeSection.style.setProperty("--route-heading-x", `${-110 * (1 - headingAmount)}px`);
        routeSection.style.setProperty("--route-reveal", String(headingAmount));
        routeSection.style.setProperty("--route-stamp-y", `${-190 * (1 - mapAmount)}px`);
        routeSection.style.setProperty("--route-stamp-turn", `${-34 + mapAmount * 28}deg`);
      }

      const stageSection = stagesRef.current;
      if (stageSection) {
        const introAmount = reveal(stageSection);
        const stripAmount = reveal(stageSection.querySelector<HTMLElement>(".stage-run"));
        const spreadAmount = reveal(stageSection.querySelector<HTMLElement>(".stage-spread"));
        stageSection.style.setProperty("--stage-image-x", `${-140 * (1 - spreadAmount)}px`);
        stageSection.style.setProperty("--stage-image-r", `${-9 + spreadAmount * 7.9}deg`);
        stageSection.style.setProperty("--stage-detail-x", `${140 * (1 - spreadAmount)}px`);
        stageSection.style.setProperty("--stage-reveal", String(spreadAmount));
        stageSection.style.setProperty("--rest-turn", `${-190 + stripAmount * 188}deg`);
        stageSection.style.setProperty("--rest-scale", String(0.22 + stripAmount * 0.83));
        stageSection.style.setProperty("--stage-rider-x", `${-24 + introAmount * 148}vw`);
        stageSection.style.setProperty("--stage-rider-y", `${46 - introAmount * 66}px`);
        stageSection.style.setProperty("--stage-rider-turn", `${-18 + introAmount * 30}deg`);
      }

      const carbSection = carbRef.current;
      if (carbSection) {
        const rect = carbSection.getBoundingClientRect();
        const travel = Math.max(1, carbSection.offsetHeight - window.innerHeight);
        const compact = window.innerWidth <= 780;
        const leadIn = window.innerHeight * (compact ? 0.95 : 0.8);
        const carbProgress = reducedMotion.matches ? 1 : clamp((leadIn - rect.top) / (travel + leadIn));
        const sun = phase(carbProgress, 0, 0.28);
        const title = phase(carbProgress, 0.05, 0.34);
        const croissant = phase(carbProgress, 0.16, 0.58);
        const coffee = phase(carbProgress, 0.27, 0.69);
        const bike = phase(carbProgress, 0.42, 0.82);
        const ring = phase(carbProgress, 0.54, 0.9);
        const finale = phase(carbProgress, 0.76, 0.98);
        carbSection.style.setProperty("--carb-sun-scale", String(0.08 + sun * 1.32));
        carbSection.style.setProperty("--carb-title-x", `${compact ? 0 : -115 * (1 - title)}vw`);
        carbSection.style.setProperty("--carb-title-opacity", String(title * (1 - phase(carbProgress, 0.68, 0.84))));
        carbSection.style.setProperty("--croissant-x", `${(compact ? -28 : -72) + croissant * (compact ? 56 : 142)}vw`);
        carbSection.style.setProperty("--croissant-y", `${18 - Math.sin(croissant * Math.PI) * 34}vh`);
        carbSection.style.setProperty("--croissant-turn", `${-45 + croissant * 430}deg`);
        carbSection.style.setProperty("--croissant-opacity", String(phase(carbProgress, 0.16, 0.24) * (1 - phase(carbProgress, 0.53, 0.61))));
        carbSection.style.setProperty("--coffee-x", `${(compact ? 28 : 72) - coffee * (compact ? 56 : 142)}vw`);
        carbSection.style.setProperty("--coffee-y", `${-24 + Math.sin(coffee * Math.PI) * 38}vh`);
        carbSection.style.setProperty("--coffee-turn", `${32 - coffee * 390}deg`);
        carbSection.style.setProperty("--coffee-opacity", String(phase(carbProgress, 0.27, 0.35) * (1 - phase(carbProgress, 0.64, 0.72))));
        carbSection.style.setProperty("--bike-x", `${(compact ? -28 : -58) + bike * (compact ? 56 : 176)}vw`);
        carbSection.style.setProperty("--bike-y", `${32 - Math.sin(bike * Math.PI) * 42}vh`);
        carbSection.style.setProperty("--bike-turn", `${-16 + bike * 26}deg`);
        carbSection.style.setProperty("--bike-opacity", String(phase(carbProgress, 0.42, 0.5) * (1 - phase(carbProgress, 0.79, 0.86))));
        carbSection.style.setProperty("--ring-y", `${88 - ring * 92}vh`);
        carbSection.style.setProperty("--ring-scale", String(0.2 + ring * 0.95));
        carbSection.style.setProperty("--ring-turn", `${-210 + ring * 390}deg`);
        carbSection.style.setProperty("--ring-opacity", String(phase(carbProgress, 0.54, 0.64) * (1 - phase(carbProgress, 0.88, 0.96))));
        carbSection.style.setProperty("--carb-final", String(finale));
        carbSection.style.setProperty("--carb-final-y", `${80 * (1 - finale)}px`);
      }

      const resort = resortRef.current;
      if (resort) {
        const amount = reveal(resort);
        resort.style.setProperty("--resort-image-scale", String(1.18 - amount * 0.18));
        resort.style.setProperty("--resort-image-y", `${-70 + amount * 70}px`);
        resort.style.setProperty("--resort-title-x", `${-120 * (1 - amount)}px`);
        resort.style.setProperty("--resort-reveal", String(amount));
        resort.style.setProperty("--pool-turn", `${-110 + amount * 118}deg`);
      }

      const colSection = colsRef.current;
      if (colSection) {
        const amount = reveal(colSection);
        colSection.style.setProperty("--cols-reveal", String(amount));
        colSection.style.setProperty("--cols-y", `${120 * (1 - amount)}px`);
      }

      const closing = closingRef.current;
      if (closing) {
        const rect = closing.getBoundingClientRect();
        const travel = Math.max(1, closing.offsetHeight - window.innerHeight);
        const departure = reducedMotion.matches ? 1 : clamp(-rect.top / travel);
        const train = phase(departure, 0.12, 0.9);
        const copy = reducedMotion.matches ? 1 : phase(departure, 0.18, 0.52);
        closing.style.setProperty("--train-x", reducedMotion.matches ? "0vw" : `${-118 + train * 236}vw`);
        closing.style.setProperty("--departure-image-x", reducedMotion.matches ? "0%" : `${-5 * train}%`);
        closing.style.setProperty("--departure-image-scale", reducedMotion.matches ? "1" : String(1 + train * 0.1));
        closing.style.setProperty("--departure-copy", String(copy));
        closing.style.setProperty("--departure-copy-x", `${-70 * (1 - copy)}px`);
        closing.style.setProperty("--ticket-turn", `${8 - train * 12}deg`);
        closing.style.setProperty("--wheel-turn", `${train * 2160}deg`);
      }
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const previousStage = () => setSelectedDay((day) => day === 1 ? stages.length : day - 1);
  const nextStage = () => setSelectedDay((day) => day === stages.length ? 1 : day + 1);
  const selectStageFromKey = (event: ReactKeyboardEvent<HTMLButtonElement>, day: number) => {
    let nextDay = day;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextDay = day === stages.length ? 1 : day + 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextDay = day === 1 ? stages.length : day - 1;
    else if (event.key === "Home") nextDay = 1;
    else if (event.key === "End") nextDay = stages.length;
    else return;
    event.preventDefault();
    setSelectedDay(nextDay);
    window.requestAnimationFrame(() => document.getElementById(`stage-button-${nextDay}`)?.focus());
  };
  const selectRideFromKey = (event: ReactKeyboardEvent<HTMLButtonElement>, rideId: BasecampRide["id"]) => {
    if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextId = rideId === "granon" ? "finestre" : "granon";
    setSelectedBasecampRideId(nextId);
    window.requestAnimationFrame(() => document.getElementById(`basecamp-button-${nextId}`)?.focus());
  };

  return (
    <main className="ullaub-world">
      <div className="tour-progress" aria-hidden="true"><i /><span ref={progressRef} /></div>
      <section className="hero hero-broadcast" id="top" ref={heroRef}>
        <nav className="nav shell" aria-label="Hauptnavigation">
          <a className="wordmark" href="#top"><span aria-hidden="true">☼</span><b>ULLAUB</b><small>TOUR DES COLS</small></a>
          <div className="nav-links"><a href="#route">Reiseplan</a><a href="#stages">Strampelplan</a><a href="#briancon">Ullaub-Zone</a><a href="#cols">All inclusive</a></div>
          <span className="edition">LIVE · SEP 2027</span>
        </nav>
        <div className="hero-world shell">
          <p className="hero-kicker"><span>CH 04.09</span> Genf → Avignon <span>FR 18.09</span></p>
          <div className="hero-title-lockup">
            <span className="hero-issue">RESORT BROADCAST № 27</span>
            <h1 aria-label="Ullaub – Tour des Cols"><span>ULLAUB</span><em>Tour des Cols</em></h1>
          </div>

          <figure className="hero-media">
            <img src={assetPath("/media/ullaub-journey.webp")} alt="Eine leuchtende Passstraße verbindet Alpen, Rennrad und Resort" />
            <figcaption><span>Jetzt im Programm</span><b>Die Route fährt vor.</b></figcaption>
          </figure>

          <div className="hero-copy">
            <p className="hero-lead">Zehn Tage Strampelplan durch die Alpen, fünf Tage Ullaub-Zone in Briançon und zum Dessert der Ventoux.</p>
            <div className="hero-actions"><a className="button button-primary" href="#route">Reiseplan öffnen <span>↓</span></a><a className="button button-quiet" href={komootUrl} target="_blank" rel="noreferrer">Komoot einchecken <span>↗</span></a></div>
          </div>
          <aside className="hero-stats" aria-label="Tourkennzahlen">
            <div><strong>{format.format(totalKm)}</strong><span>km Ullaub</span></div>
            <div><strong>~{format.format(totalGain)}</strong><span>hm inklusive</span></div>
            <div><strong>10</strong><span>Strampeltage</span></div>
            <div><strong>14</strong><span>Cols à la carte</span></div>
          </aside>
          <a className="hotel-key" href="#route"><span>ROOM</span><strong>900</strong><small>CHECK-IN ↓</small></a>
        </div>
        <div className="hero-rule"><div><span>04—18 SEPTEMBER</span><span>ALPEN → PROVENCE</span><span>POOLBLAU · BERGE · BIDONS · CARBS</span><span>04—18 SEPTEMBER</span><span>ALPEN → PROVENCE</span></div></div>
      </section>

      <section className="tour-assembly" ref={assemblyRef} aria-labelledby="assembly-title">
        <span className="assembly-scroll-marker is-mid" id="assembly-mid" aria-hidden="true" />
        <span className="assembly-scroll-marker is-finish" id="assembly-finish" aria-hidden="true" />
        <div className="assembly-sticky">
          <div className="assembly-topline"><span>SCROLL · TOUR-MONTAGE</span><span>GENF · 04 SEP → AVIGNON · 18 SEP</span></div>
          <div className="assembly-frame">
            <div className="assembly-panel panel-a" aria-hidden="true"><img src={assetPath("/media/ullaub-journey.webp")} alt="" /></div>
            <div className="assembly-panel panel-b" aria-hidden="true"><img src={assetPath("/media/ullaub-journey.webp")} alt="" /></div>
            <div className="assembly-panel panel-c" aria-hidden="true"><img src={assetPath("/media/ullaub-journey.webp")} alt="" /></div>
            <svg className="assembly-route" viewBox="0 0 1200 675" aria-hidden="true">
              <path d="M42 535 C173 492 176 393 291 382 C418 369 395 278 512 278 C626 279 626 370 738 337 C838 308 784 205 918 201 C1030 198 1067 140 1162 109" />
            </svg>
            <div className="assembly-copy">
              <p>900 KM · 14 COLS · 15 TAGE</p>
              <h2 id="assembly-title"><span>GENF</span><i>→</i><span>AVIGNON</span></h2>
              <strong>Eine Tour setzt sich zusammen.</strong>
            </div>
          </div>
          <p className="assembly-instruction"><span>↓</span> Scrollen, bis Berg, Bike und Ullaub einrasten.</p>
        </div>
      </section>

      <section className="route-section route-broadcast" id="route" ref={routeRef}>
        <div className="route-heading shell">
          <p className="chapter-number">01</p>
          <div><p className="eyebrow dark">Die große Faltkarte</p><h2>Eine Linie.<br /><em>Sehr viel Berg.</em></h2></div>
          <p className="section-copy">Die echte GPX-Linie von Genf nach Avignon. Zehn Etappen, fünf Tage Pause und Übernachtungsorte, in denen es auch wirklich ein Bett gibt.</p>
        </div>
        <div className="route-stage shell">
          <div className="map-frame">
            <RouteMap stops={mapStops} activeDay={selectedDay} onSelectDay={setSelectedDay} />
            <div className="map-key"><span><i /> 900 km Originalroute</span><span><b>{selectedDay}</b> {selectedStage.stop}</span></div>
          </div>
          <p className="route-annotation">900 KM<br /><span>GENF 46°12′N</span><br />→<br /><span>AVIGNON 43°57′N</span></p>
        </div>
        <div className="journey-checkpoints shell" aria-label="Reise-Eckpunkte">
          {[stages[0], stages[4], stages[5], stages[9]].map((stage, index) => (
            <a href="#stages" onClick={() => setSelectedDay(stage.day)} key={stage.day} className={selectedDay === stage.day ? "is-active" : ""}>
              <small>{index === 0 ? "CHECK-IN" : index === 1 ? "ULLAUB-ZONE" : index === 2 ? "RE-CHECK-IN" : "CHECK-OUT"}</small>
              <b>{stage.stop}</b><span>{stage.date}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="stages-section stage-roadbook" id="stages" ref={stagesRef}>
        <div className="stage-rider" aria-hidden="true"><span>🚲</span><b>KEIN ZIMMER-SERVICE</b></div>
        <div className="roadbook-masthead shell">
          <p className="chapter-number">02</p>
          <div><p className="eyebrow">Der offizielle Strampelplan</p><h2>Road<br /><em>Book.</em></h2></div>
          <p>Fünf Tage Alpen. Fünf Tage Ullaub. Fünf Tage Richtung Provence. Der aktive Tag steuert Roadbook und Karte.</p>
        </div>
        <div className="stage-run shell" role="tablist" aria-label="Etappen auswählen">
          <div className="stage-day-group" role="presentation">
            {stages.slice(0, 5).map((stage) => <button id={`stage-button-${stage.day}`} role="tab" aria-label={`Etappe ${stage.day}: ${stage.route}`} aria-selected={selectedDay === stage.day} aria-controls="stage-panel" tabIndex={selectedDay === stage.day ? 0 : -1} className={selectedDay === stage.day ? "is-selected" : ""} key={stage.day} type="button" onKeyDown={(event) => selectStageFromKey(event, stage.day)} onClick={() => setSelectedDay(stage.day)}><span>{String(stage.day).padStart(2, "0")}</span><small>{stage.stop}</small></button>)}
          </div>
          <div className="rest-stamp"><span>09—13 SEP</span><strong>5 TAGE<br />ULLAUB</strong><small>Briançon macht Pause.</small></div>
          <div className="stage-day-group" role="presentation">
            {stages.slice(5).map((stage) => <button id={`stage-button-${stage.day}`} role="tab" aria-label={`Etappe ${stage.day}: ${stage.route}`} aria-selected={selectedDay === stage.day} aria-controls="stage-panel" tabIndex={selectedDay === stage.day ? 0 : -1} className={selectedDay === stage.day ? "is-selected" : ""} key={stage.day} type="button" onKeyDown={(event) => selectStageFromKey(event, stage.day)} onClick={() => setSelectedDay(stage.day)}><span>{String(stage.day).padStart(2, "0")}</span><small>{stage.stop}</small></button>)}
          </div>
        </div>
        <div className="stage-spread shell">
          <figure className="stage-portrait">
            <img src={assetPath("/media/ullaub-journey.webp")} alt="Leere Passstraße mit Rennrad zwischen Alpen und Provence" loading="lazy" />
            <figcaption><b>DIE ROUTE FÄHRT VOR.</b><span>Du fährst hinterher.</span></figcaption>
          </figure>
          <article id="stage-panel" role="tabpanel" aria-labelledby={`stage-button-${selectedStage.day}`} className={`stage-detail ${selectedStage.tone === "warm" ? "is-warm" : ""}`} aria-live="polite">
            <div className="stage-detail-top"><span>ETAPPE {String(selectedStage.day).padStart(2, "0")}</span><small>{selectedStage.date}</small></div>
            <h3>{selectedStage.route}</h3>
            <div className="big-numbers"><div><b>{selectedStage.km}</b><span>KILOMETER</span></div><div><b>+{format.format(selectedStage.gain)}</b><span>HÖHENMETER</span></div></div>
            <div className="detail-block"><small>COL-MENÜ</small><p>{selectedStage.cols.join(" · ")}</p></div>
            <div className="detail-block booking"><small>BETT & BASIS · {selectedStage.stop.toUpperCase()}</small><p>{selectedStage.booking}</p></div>
            <div className="stage-controls"><button type="button" onClick={previousStage} aria-label="Vorherige Etappe">←</button><span>{String(selectedStage.day).padStart(2, "0")} / 10</span><button type="button" onClick={nextStage} aria-label="Nächste Etappe">→</button></div>
          </article>
        </div>
      </section>

      <section className="carb-loader" id="carb-loading" ref={carbRef} aria-labelledby="carb-title">
        <div className="carb-sticky">
          <div className="carb-grid" aria-hidden="true" />
          <div className="carb-sun" aria-hidden="true" />
          <p className="carb-channel">ULLAUB-TV · ZWISCHENPROGRAMM · BITTE NICHT WEGSCHALTEN</p>
          <p className="carb-title" aria-hidden="true"><span>CARB</span><em>LOADING</em></p>
          <div className="croissant-rocket" aria-hidden="true"><span>🥐</span><b>× 08</b><small>NOTFALL-CARBS</small></div>
          <div className="coffee-orbit" aria-hidden="true"><span>☕</span><b>DOPPIO</b><small>JETZT SOFORT</small></div>
          <div className="bike-zoom" aria-hidden="true"><span>🚲</span><b>OPTIONAL!</b></div>
          <div className="pool-ring" aria-hidden="true"><span>5</span><small>TAGE</small></div>
          <div className="carb-finale">
            <p>09—13 SEP · BRIANÇON</p>
            <h2 id="carb-title">5 TAGE<br /><em>ULLAUB.</em></h2>
            <strong>System erfolgreich überladen.</strong>
          </div>
        </div>
      </section>

      <section className="basecamp-section resort-intermission" id="briancon" ref={resortRef}>
        <div className="resort-scene">
          <figure><img src={assetPath("/media/ullaub-resort.webp")} alt="Rennrad, Pool, Croissants und Espresso in einem alpinen Resort" loading="lazy" /></figure>
          <div className="resort-title"><p className="eyebrow">03 · Ullaub-Zone Briançon</p><h2>Check in.<br /><em>Drop out.</em></h2><p>Fünf Tage Haus, Sauna, Espresso und Carbs. Radfahren ist hier optional.</p></div>
          <div className="pool-sign" aria-hidden="true"><span>POOL</span><b>09—13</b><small>SEP</small></div>
        </div>
        <div className="room-service shell">
          <div className="room-service-head"><span>ROOM SERVICE</span><h3>Falls die Beine<br />dumme Ideen haben.</h3><p>Zwei Ausfahrten, null Pflichtprogramm.</p></div>
          <div className="basecamp-options" role="tablist" aria-label="Optionale Briançon-Ausfahrten">
            {basecampRides.map((ride) => <button id={`basecamp-button-${ride.id}`} role="tab" aria-controls="basecamp-panel" aria-selected={selectedBasecampRide.id === ride.id} tabIndex={selectedBasecampRide.id === ride.id ? 0 : -1} className={selectedBasecampRide.id === ride.id ? "is-selected" : ""} key={ride.id} type="button" onKeyDown={(event) => selectRideFromKey(event, ride.id)} onClick={() => setSelectedBasecampRideId(ride.id)}><span>{ride.id === "granon" ? "01" : "02"}</span><strong>{ride.name}</strong><small>{ride.level}</small></button>)}
          </div>
          <article id="basecamp-panel" role="tabpanel" aria-labelledby={`basecamp-button-${selectedBasecampRide.id}`} className={`basecamp-detail is-${selectedBasecampRide.tone}`} aria-live="polite">
            <div className="basecamp-detail-top"><span>OPTION {selectedBasecampRide.id === "granon" ? "01" : "02"}</span><small>{selectedBasecampRide.surface}</small></div>
            <h3>{selectedBasecampRide.name}</h3>
            <p className="basecamp-route">{selectedBasecampRide.route}</p>
            <div className="basecamp-big-numbers"><div><b>{selectedBasecampRide.km}</b><span>KM</span></div><div><b>+{format.format(selectedBasecampRide.gain)}</b><span>HM</span></div><div><b>{selectedBasecampRide.rideTime}</b><span>FAHRZEIT</span></div></div>
            <div className="basecamp-copy"><p>{selectedBasecampRide.punchline}</p><small>{selectedBasecampRide.description}</small></div>
            <div className="basecamp-meta"><div><span>BERGPROGRAMM</span><p>{selectedBasecampRide.keyClimbs}</p></div><div><span>RAD-CHECK</span><p>{selectedBasecampRide.bikeNote}</p></div></div>
            <a className="basecamp-link" href={selectedBasecampRide.komoot} target="_blank" rel="noreferrer">In Komoot einchecken <span>↗</span></a>
          </article>
          <p className="basecamp-rule">Die Hauptoption bleibt: ausschlafen. Kein Rechtfertigungsformular nötig.</p>
        </div>
      </section>

      <section className="cols-section passport-section" id="cols" ref={colsRef}>
        <div className="cols-intro shell">
          <div className="cols-elevation" role="img" aria-label="Vierzehn Balken zeigen die Höhenmeter der vierzehn Alpenpässe">
            <div className="col-bars" aria-hidden="true">
              {cols.map((col) => {
                const gain = Number(col.gain.replace(".", ""));
                return <span key={col.name} style={{ height: `${22 + (gain / 1599) * 70}%` }}><i>{col.day}</i></span>;
              })}
            </div>
            <div className="elevation-caption" aria-hidden="true"><strong>14</strong><span>COLS<br />À LA CARTE</span></div>
          </div>
          <div><p className="eyebrow">04 · All-inclusive-Höhenmeter</p><h2>14 Gründe,<br /><em>kurz nachzufragen.</em></h2><p className="section-copy">Alle Auffahrten mit den exakten Quäldich-Zahlen. Jeder Stempel öffnet das Originalprofil für Vorfreude, Nervosität und Gangwahl.</p></div>
        </div>
        <div className="col-passport shell" id="passport">
          {cols.map((col, index) => <a className={`col-card stamp-${index % 5} ${col.name === "Alpe d’Huez" || col.name === "Mont Ventoux" ? "featured" : ""}`} href={col.url} target="_blank" rel="noreferrer" key={col.name}><div className="col-card-head"><span>{String(index + 1).padStart(2, "0")} · {col.day}</span><b>{col.name}</b><i>↗</i></div><p>{col.side}</p><div className="climb-profile" role="img" aria-label={`Stilisiertes Höhenprofil für ${col.name}`}><span>HÖHENPROFIL</span><i className="profile-fill" style={{ clipPath: `polygon(${col.profile})` }} /><i className="profile-shade" style={{ clipPath: `polygon(${col.profile})` }} /><i className="profile-sun" /></div><div className="col-stats"><span><strong>{col.km}</strong> km</span><span><strong>+{col.gain}</strong> hm</span><span><strong>Ø {col.grade}</strong> %</span></div></a>)}
        </div>
      </section>

      <section className="closing closing-broadcast" id="checkout" ref={closingRef}>
        <div className="closing-sticky">
          <img src={assetPath("/media/ullaub-departure.webp")} alt="Ein gepacktes Rennrad wartet am offenen Nachtzug" loading="lazy" />
          <div className="closing-copy">
            <p className="eyebrow">05 · Ullaub Ende</p>
            <h2>Der Zug<br /><em>wartet nicht.</em></h2>
            <p>Gut gebräunt. Stabil gefahren. Die Berge bitte nicht persönlich nehmen.</p>
            <a className="button button-primary" href="#top">Noch einmal einchecken <span>↑</span></a>
          </div>
          <div className="departure-track" aria-hidden="true">
            <div className="departing-train"><b>ULLAUB EXPRESS</b><span /><span /><span /><span /><span /><i /><i /></div>
          </div>
          <div className="closing-ticket" aria-label="Reisedaten"><span>GVA</span><i>→</i><span>AVN</span><small>04—18 · 09 · 2027</small></div>
        </div>
      </section>

      <footer className="footer"><div className="shell"><span>ULLAUB · GENF → AVIGNON</span><span>GPX-STAND · 04 AUG 2026</span><span>TOUR DES COLS · 2027</span></div></footer>
    </main>
  );
}
