"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

type Stop = {
  day: number;
  name: string;
  coordinates: [number, number];
};

type RouteMapProps = {
  stops: Stop[];
  activeDay?: number;
  onSelectDay?: (day: number) => void;
};

export default function RouteMap({ stops, activeDay, onSelectDay }: RouteMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRefs = useRef(new Map<number, LeafletMarker>());
  const activeDayRef = useRef(activeDay);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!container.current || mapRef.current) return;

    let disposed = false;
    const markers = markerRefs.current;

    async function drawMap() {
      try {
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
        const response = await fetch(`${basePath}/route.json`);
        if (!response.ok) throw new Error(`Route konnte nicht geladen werden (${response.status})`);
        const points = await response.json() as [number, number][];
        if (disposed) return;
        if (!Array.isArray(points) || points.length < 2) throw new Error("Route enthält zu wenige Punkte");

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
              html: `<span class="stage-marker${activeDayRef.current === stop.day ? " is-active" : ""}">${stop.day}</span>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            }),
            keyboard: true,
            title: `Tag ${stop.day}: ${stop.name}`,
          }).addTo(map);
          marker.bindTooltip(`<b>Tag ${stop.day}</b><br>${stop.name}`, { direction: "top", offset: [0, -14] });
          marker.on("click", () => onSelectDay?.(stop.day));
          markers.set(stop.day, marker);
        });

        map.fitBounds(line.getBounds(), { padding: [32, 32] });
      } catch {
        if (!disposed) setLoadError(true);
      }
    }

    drawMap();
    return () => {
      disposed = true;
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [onSelectDay, stops]);

  useEffect(() => {
    activeDayRef.current = activeDay;
    markerRefs.current.forEach((marker, day) => {
      marker.getElement()?.querySelector(".stage-marker")?.classList.toggle("is-active", day === activeDay);
    });
  }, [activeDay]);

  return (
    <div className="route-map-shell" role="region" aria-label="Interaktive Karte der GPX-Route von Genf nach Avignon">
      <div ref={container} className="route-map" />
      {loadError ? <p className="route-map-error">Die Route lädt gerade nicht. Etappen und Eckdaten bleiben unten verfügbar.</p> : null}
    </div>
  );
}
