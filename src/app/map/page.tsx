"use client";
import dynamic from "next/dynamic";
import React from "react";
import Link from "next/link"

//　dinamic　を利用
function MapPage() {
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
      <Map />
      <Link href="/">Running Course</Link>
    </>
  )
}

export default MapPage;