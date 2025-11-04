"use client";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";
import GPXLayer from "@/app/components/features/gpxLayer";
import { MapProps } from "@/types/map.types";

export default function Map({ url }: MapProps) {
  return (
    <>
      <div className="w-[98%] m-auto pb-2 ">
        <MapContainer
          scrollWheelZoom={true}
          dragging={true}
          style={{ height: "250px", width: "100%", borderRadius: "2.0rem", overflow: "hidden" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {url && <GPXLayer url={url} />}
        </MapContainer>
      </div>
    </>
  );
}