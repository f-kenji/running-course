import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-gpx";

export default function GPXLayer({ url }: { url: string }) {
    const map = useMap();

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
        const gpx = new (L as any).GPX(url, {
            async: true,
            marker_options: {
                startIconUrl: null,
                endIconUrl: null,
                shadowUrl: null,
            },
            polyline_options: {
                color: "transparent", // 元の線は非表示
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

                // アニメーション用のPolylineとマーカーを作成
                const animatedLine = L.polyline([], {
                    color: "#ff3333",
                    weight: 4,
                }).addTo(map);

                const marker = L.circleMarker(latlngs[0], {
                    radius: 6,
                    color: "#ff3333ff",
                    fillColor: "#ffffffff",
                    fillOpacity: 1,
                }).addTo(map);

                // 線を伸ばすアニメーション
                const totalTime = 200; // 0.2秒で描画
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
                console.log(latlngs.map(l => ({ lat: l.lat, lng: l.lng })));
                animate();
            })
            .addTo(map);
        // クリーンアップ
        return () => {
            map.removeLayer(gpx as any);
        };
    }, [map, url]);
    return null;
}
