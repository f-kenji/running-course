"use client";
import dynamic from "next/dynamic";
import React from "react";
import Link from "next/link"

//　dinamic　を利用
function MapPage() {
  // <GPXLayer url="/activity_20443982855.gpx" />
  const url = "/activity_20443982855.gpx"
  const Map = React.useMemo(
    () =>
      dynamic(() => import("@/app/components/features/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );
  return (
    <>
      <h1 className="text-4xl pb-4 font-bold">コース**</h1>
      {/* <Map url={url} /> */}
      <Link href="/">Running Course</Link>
    </>
  )
}

export default MapPage;