// src/types/leaflet-gpx.d.ts
import * as L from "leaflet";

declare module "leaflet" {
  namespace GPX {
    interface Options extends L.PathOptions {
      async?: boolean;
      marker_options?: {
        startIconUrl?: string | null;
        endIconUrl?: string | null;
        shadowUrl?: string | null;
      };
    }
  }

  class GPX extends L.FeatureGroup {
    constructor(gpx: string, options?: GPX.Options);
  }
}
