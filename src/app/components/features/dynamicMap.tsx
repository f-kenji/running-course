// app/components/features/dynamicMap.tsx
"use client";

import { MapProps } from "@/types/map.types";
import dynamic from "next/dynamic";
import React from "react";


const Map = dynamic(() => import("@/app/components/features/map"), {
  loading: () => <p>マップを読み込んでいます...</p>,
  ssr: false,
});

export default function DynamicMap({ url }: MapProps) {
  return <Map url={url} />;
}