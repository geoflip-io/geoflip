import { useState, useRef, useEffect, useContext } from "react";
import { TransformContext } from "./TransformContext";
import { Box } from "@mui/material";
import mapboxgl, { LngLat } from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { useTheme } from "@mui/material/styles";
import { ClearAll, SatelliteToggle } from "./map/CustomControls"; // Import the new control
import { useClearActiveLayer, useAddToActiveLayer } from "./utils/MapOperations";
import { getLayerStyles } from './utils/LayerStyles';
import "./map/CustomControls.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapContainer = () => {
    const theme = useTheme();
    const { mapRef, drawRef, stopRotationRef, setActiveFeatures, setEraseFeatures, setClipFeatures } = useContext(TransformContext);
    const [mapCentrePosition, setMapCentrePosition] = useState(new LngLat(0, 0));
    const mapContainer = useRef(null);
    const rotationInterval = useRef(null);
    const clearActiveLayer = useClearActiveLayer();
    const addToActiveLayer = useAddToActiveLayer();
    const layers = getLayerStyles(theme);

    useEffect(() => {
        if (mapRef.current || !mapContainer.current) return; 

        mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            center: mapCentrePosition,
            zoom: 2,
            style: theme.map.globe.style,
        });

        drawRef.current = new MapboxDraw({
            displayControlsDefault: false,
            controls: {
                polygon: true,
                line_string: true,
                point: true
            }
        });

        stopRotationRef.current = stopRotation;

        mapRef.current.on("style.load", () => {
            if (mapRef.current) {
                mapRef.current.setFog({
                    color: theme.map.globe.fogColor, 
                    "high-color": theme.map.globe.fogHighColor,
                    "horizon-blend": 0.02,
                    "space-color": theme.map.globe.space,
                });
            }
        });

        mapRef.current.on("load", () => {
            startRotation();
            if (mapRef.current && drawRef.current) {
                mapRef.current.addControl(drawRef.current, "top-left");
                mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
                mapRef.current.addControl(new ClearAll(drawRef.current, mapRef, setEraseFeatures, setClipFeatures, clearActiveLayer), 'top-left');
                mapRef.current.addControl(new SatelliteToggle(mapRef, theme), 'top-left');
                
                mapRef.current.addSource('combined-features', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: []
                    },
                    generateId: true
                });

                mapRef.current.addSource('geoflip-output', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: []
                    },
                    generateId: true
                });

                // handle all the layers
                layers.forEach(layer => {
                    if (mapRef.current){
                        mapRef.current.addLayer(layer);

                        mapRef.current.on('click', layer.id, (e) => {
                            const feature = e.features[0];
                            // const id = feature.id;

                            // Save this ID somewhere (e.g. selectedFeatureId state)
                            console.log(feature);
                        });
                    }
                });
            }
        });

        mapRef.current.on('draw.create', updateActiveFeatures);
        mapRef.current.on('draw.delete', updateActiveFeatures);
        mapRef.current.on('draw.update', updateActiveFeatures);

        mapRef.current.on("mousedown", stopRotation);
        mapRef.current.on("touchstart", stopRotation);
        mapRef.current.on("move", () => {
            if (mapRef.current) {
                const currentCenter = mapRef.current.getCenter();
                setMapCentrePosition(currentCenter);
            }
        });

        return () => {
            stopRotation();
        };
    }, [mapRef, mapContainer]);

    const startRotation = () => {
        if (rotationInterval.current) return;

        rotationInterval.current = window.setInterval(() => {
            if (mapRef.current) {
                const currentCenter = mapRef.current.getCenter();
                mapRef.current.easeTo({
                    center: [currentCenter.lng + 1, currentCenter.lat],
                    duration: 1000,
                    easing: (t) => t,
                });
            }
        }, 100);
    };

    const stopRotation = () => {
        if (rotationInterval.current) {
            clearInterval(rotationInterval.current);
            rotationInterval.current = null;
        }
    };

    const updateActiveFeatures = () => {
        const features = JSON.parse(JSON.stringify(drawRef.current.getAll().features));
        addToActiveLayer(features);
    };

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                '& .map-container': {
                    height: "100%",
                    width: "100%",
                    borderRadius: "10px",
                }
            }}
        >
            <div
                ref={mapContainer}
                className="map-container"
            />
        </Box>
    );
};

export default MapContainer;
