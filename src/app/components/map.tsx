"use client";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-gpx";
import GPXLayer from "@/app/components/gpxlayer";

export default function Map() {
  return (
    <>
      <div className="w-2/3 m-auto pt-8 pb-10 ">
      <h1 className="text-4xl pb-4 font-bold">コース**</h1>
        <MapContainer
          scrollWheelZoom={true}
          dragging={true}
          style={{ height: "500px", width: "100%", borderRadius: "2.0rem", overflow: "hidden" }} //
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <GPXLayer url="/activity_20443982855.gpx" />
          
        </MapContainer>
      </div>
    </>
  );
}