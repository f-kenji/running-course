import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-gpx";
import { MapProps } from "@/types/map.types";


export default function GPXLayer({ url }: MapProps) {
    const map = useMap();
    const [gpxUrl, setGpxUrl] = useState<string | null>(null)

    useEffect(() => {
        if (!url) return
        if (url instanceof File) {
            // ローカルファイル → Blob URL
            const blobUrl = URL.createObjectURL(url)
            setGpxUrl(blobUrl)
            return () => URL.revokeObjectURL(blobUrl)
        } else if (typeof url === "string") {
            // 公開URL
            setGpxUrl(url)
        }
    }, [url])

    // LatLngのネスト配列を1次元に平坦化
    const flattenLatLngs = (latlngs: any): L.LatLng[] => {
        if (!latlngs) return [];
        if (Array.isArray(latlngs[0])) {
            // ネスト配列なら再帰処理
            return latlngs.flatMap(flattenLatLngs);
        }
        return latlngs;
    };

    useEffect(() => {
        if (!map || !gpxUrl) return
        // デフォルトアイコンの読み込みを無効化
        L.Icon.Default.mergeOptions({
            iconUrl: "/icons/icon.png",
            iconRetinaUrl: "",
            shadowUrl: "",
        });

        // カスタムアイコンを事前に定義
        const startIcon = L.icon({
            iconUrl: '/icons/start.svg',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });

        const endIcon = L.icon({
            iconUrl: '/icons/goal.svg',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });

        const gpx = new (L as any).GPX(gpxUrl, {
            async: true,
            marker_options: {
                startIcon: startIcon,    // ← オブジェクトで渡す
                endIcon: endIcon,        // ← オブジェクトで渡す
                shadowUrl: "",
            },
            polyline_options: {
                color: "transparent",
            },
        })
            .on("loaded", (e: any) => {
                map.fitBounds(e.target.getBounds());

                // e.target は FeatureGroup で子レイヤーに Polyline が含まれる
                let latlngs: L.LatLng[] = [];

                e.target.getLayers().forEach((layer: any) => {
                    if (layer instanceof L.Polyline) {
                        latlngs = latlngs.concat(flattenLatLngs(layer.getLatLngs()));
                    } else if (layer.getLayers) {
                        layer.getLayers().forEach((subLayer: any) => {
                            if (subLayer instanceof L.Polyline) {
                                latlngs = latlngs.concat(flattenLatLngs(subLayer.getLatLngs()));
                            }
                        });
                    }
                });

                if (!latlngs.length) {
                    console.warn("GPX内にPolylineが見つかりませんでした");
                    return;
                }

                // 手動でスタート・ゴールマーカーを配置
                L.marker(latlngs[0], { icon: startIcon }).addTo(map);
                L.marker(latlngs[latlngs.length - 1], { icon: endIcon }).addTo(map);
                // アニメーション用のPolylineとマーカーを作成
                const animatedLine = L.polyline([], {
                    color: "#ff3333",
                    opacity: 0.5,
                    weight: 3,
                }).addTo(map);

                const marker = L.circleMarker(latlngs[0], {
                    radius: 6,
                    color: "#ff2537ff",
                    opacity: 0.75,
                    fillColor: "#ffffffff",
                    fillOpacity: 1,
                }).addTo(map);

                // 線を伸ばすアニメーション
                const totalTime = 500; // 0.5秒で描画
                const step = Math.ceil(latlngs.length / totalTime); // 1msごとにまとめて描画
                const interval = totalTime / latlngs.length; // 座標数に応じて自動計算

                let i = 0;

                const animate = () => {

                    if (i < latlngs.length) {
                        animatedLine.addLatLng(latlngs[i]);
                        marker.setLatLng(latlngs[i]);
                        i += step;
                        setTimeout(animate, interval);
                    }
                };
                // console.log(latlngs.map(l => ({ lat: l.lat, lng: l.lng })));
                animate();
            })
            .addTo(map);
        // クリーンアップ
        return () => {
            map.removeLayer(gpx as any);
        };
    }, [map, gpxUrl]);
    return null;
}
