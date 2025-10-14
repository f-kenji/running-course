"use client";
import dynamic from "next/dynamic";
import React from "react";

//　dinamic　を利用
function MapPage() {
  const Map = React.useMemo(
    () =>
      dynamic(() => import("../components/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  return <Map />;
}

export default MapPage;