"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

type Stop = {
  day: number;
  name: string;
  coordinates: [number, number];
};

export default function RouteMap({ stops }: { stops: Stop[] }) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (!container.current || mapRef.current) return;

    let disposed = false;

    async function drawMap() {
      const L = await import("leaflet");
      if (disposed || !container.current) return;

      const map = L.map(container.current, {
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: true,
      });
      mapRef.current = map;

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 15,
        attribution: "© OpenStreetMap-Mitwirkende",
      }).addTo(map);

      const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      const source = await fetch(`${basePath}/route.gpx`).then((response) => response.text());
      if (disposed) return;
      const xml = new DOMParser().parseFromString(source, "application/xml");
      const points = Array.from(xml.querySelectorAll("trkpt"))
        .map((point) => [Number(point.getAttribute("lat")), Number(point.getAttribute("lon"))] as [number, number])
        .filter(([lat, lon]) => Number.isFinite(lat) && Number.isFinite(lon));

      const line = L.polyline(points, {
        color: "#ff5b4d",
        weight: 4,
        opacity: 0.94,
        lineJoin: "round",
      }).addTo(map);

      stops.forEach((stop) => {
        const marker = L.marker(stop.coordinates, {
          icon: L.divIcon({
            className: "stage-marker-wrap",
            html: `<span class="stage-marker">${stop.day}</span>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          }),
          keyboard: true,
          title: `Tag ${stop.day}: ${stop.name}`,
        }).addTo(map);
        marker.bindTooltip(`<b>Tag ${stop.day}</b><br>${stop.name}`, { direction: "top", offset: [0, -14] });
      });

      map.fitBounds(line.getBounds(), { padding: [32, 32] });
    }

    drawMap();
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [stops]);

  return <div ref={container} className="route-map" aria-label="Interaktive Karte der GPX-Route von Genf nach Avignon" />;
}
