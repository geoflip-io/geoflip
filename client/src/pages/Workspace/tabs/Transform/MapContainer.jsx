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
import FeatureWindow from "./map/FeatureWindow";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapContainer = () => {
    const theme = useTheme();
    const { mapRef, drawRef, stopRotationRef, setEraseFeatures, setClipFeatures, selectedFeature, setSelectedFeature } = useContext(TransformContext);
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
                mapRef.current.addControl(new mapboxgl.NavigationControl(), "bottom-left");
                mapRef.current.addControl(new ClearAll(drawRef.current, mapRef, setEraseFeatures, setClipFeatures, clearActiveLayer), 'top-left');
                mapRef.current.addControl(new SatelliteToggle(mapRef, theme), 'top-left');
                
                mapRef.current.addSource('combined-features', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: []
                    }
                });

                mapRef.current.addSource('geoflip-output', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: []
                    }
                });

                mapRef.current.addSource('highlight-feature', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                }
                });

                // handle all the layers
                layers.forEach(layer => {
                    if (mapRef.current){
                        mapRef.current.addLayer(layer);

                        // set the selected feature state when layer is clicked
                        mapRef.current.on('click', layer.id, (e) => {
                            const feature = e.features[0].toJSON();
                            setSelectedFeature(feature);
                            mapRef.current.getSource('highlight-feature').setData({
                                type: 'FeatureCollection',
                                features: [feature]
                            });
                        });
                    }
                });

                // this clears the selected layer data when you click on the map but not on a feature
                if (mapRef.current) {
                    mapRef.current.on('click', (e) => {
                        // query all feature layers at once
                        const features = mapRef.current.queryRenderedFeatures(e.point, {
                            layers: layers.map(layer => layer.id)
                        });
                        if (features.length === 0) {
                            setSelectedFeature(null);
                            mapRef.current.getSource('highlight-feature').setData({
                                type: 'FeatureCollection',
                                features: []
                            });
                        }
                    });
                }

                // Universal pointer cursor on hover
                mapRef.current.on('mousemove', (e) => {
                    const features = mapRef.current.queryRenderedFeatures(e.point, {
                        layers: layers.map(layer => layer.id)
                    });
                    mapRef.current.getCanvas().style.cursor = features.length ? 'pointer' : '';
                });
            }
        });

        mapRef.current.on('draw.modechange', (e) => {
            const mode = e.mode;

            if (mode === 'simple_select') {
                updateActiveFeatures();
            }
        });

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
                position: 'relative',
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
            {/* Floating info panel - only displays when there is a selected feature*/}
            {selectedFeature && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        // bottom: 6,
                        maxHeight: 'calc(100% - 12px)',
                        minWidth: 250,
                        maxWidth: 350,
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 2,
                        backgroundColor: theme.palette.secondary.main,
                        boxShadow: 3,
                        borderRadius: 2,
                        zIndex: 10
                    }}
                >
                    <FeatureWindow />
                </Box>
            )}
        </Box>
    );
};

export default MapContainer;
