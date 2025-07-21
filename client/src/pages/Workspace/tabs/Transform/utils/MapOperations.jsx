import * as turf from '@turf/turf';
import mapboxgl from "mapbox-gl";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { TransformContext } from '../TransformContext';

const zoomToBounds = (map, features) => {
	// Fit map to the extent of the new features using Turf.js
	if (map && features.length > 0) {
		const featureCollection = turf.featureCollection(features);
		const bbox = turf.bbox(featureCollection);
		const bounds = new mapboxgl.LngLatBounds(
			[bbox[0], bbox[1]],
			[bbox[2], bbox[3]]
		);

		// the mapbox type for fitbounds seems to conflict with typescript
		map.fitBounds(bounds, {
			padding: 50,
			maxZoom: 15,
			duration: 5000 
		});
	}
}

const handleAPIError = async(error, startMessage=null) => {
    if (axios.isAxiosError(error) && error.response) {
        const errorResponse = error.response;
        try {
            switch (errorResponse.status) {
                case 401:
                    toast.error("Your session has expired. Please login again.");
                    return true;
                case 429:
                    toast.error(`Free tier limit reached: ${errorResponse.data.message}`);
                    break;
                default:
                    const text = await errorResponse.data.text();
                    const jsonError = JSON.parse(text);
                    const errorMessage = JSON.stringify(jsonError.errors.json);
                    toast.error(`error from geoflip - ${errorMessage}`);
            }
        } catch (parseError) {
            toast.error(`An unexpected error occurred. Please try again.`);
        }
    } else {
        toast.error(`An unexpected error occurred - ${error}`);
    }
    return false;
}

const useUpdateActiveLayer = () => {
	const { mapRef, setActiveFeatures, stopRotationRef } = useContext(TransformContext);

	const updateActiveLayer = (geojsonData) => {
		const map = mapRef.current;

		const updatedFeatures = geojsonData.features.map((feature, index) => {
			const cloned = JSON.parse(JSON.stringify(feature)); // deep clone to avoid state mutation

			if (!cloned.properties) {
				cloned.properties = {};
			}

			if (!cloned.properties.geoflip_id) {
				cloned.properties.geoflip_id = crypto.randomUUID?.() || `${Date.now()}-${index}`;
			}

			return cloned;
		});

		const updatedGeojson = {
			type: "FeatureCollection",
			features: updatedFeatures
		};

		if (map && map.getSource('geoflip-output')) {
			map.getSource('geoflip-output').setData(updatedGeojson);
		}

		setActiveFeatures(updatedFeatures);
		stopRotationRef.current();
		zoomToBounds(mapRef.current, updatedFeatures);
	};

	return updateActiveLayer;
};

const useClearActiveLayer = () => {
	const { mapRef, setActiveFeatures, setSelectedFeature } = useContext(TransformContext);

	const clearActiveLayer = () => {
		const map = mapRef.current;
		if (map && map.getSource('geoflip-output')) {
			map.getSource('geoflip-output').setData({
				type: "FeatureCollection",
				features: []
			});

			map.getSource('highlight-feature').setData({
				type: 'FeatureCollection',
				features: []
			});			
		}
		setActiveFeatures([]);
		setSelectedFeature(null);
	};

	return clearActiveLayer;
};

const useAddToActiveLayer = () => {
	const { mapRef, setActiveFeatures, drawRef } = useContext(TransformContext);

	const addToActiveLayer = (features) => {
		setActiveFeatures(prev => {
			const updatedFeatures = [...prev, ...features];

			const map = mapRef.current;
			if (map && map.getSource('geoflip-output')) {
				map.getSource('geoflip-output').setData({
					type: "FeatureCollection",
					features: updatedFeatures
				});
			}

			drawRef.current.deleteAll();
			return updatedFeatures;
		});
	};

	return addToActiveLayer;
};

const useDeleteFeatureFromLayer = () => {
	const { mapRef, activeFeatures, setActiveFeatures, selectedFeature, setSelectedFeature } = useContext(TransformContext);

	const deleteSelectedFeature = () => {
		const map = mapRef.current;

		if (!map || !map.getSource('geoflip-output') || !selectedFeature) return;

		const targetId = selectedFeature.properties?.geoflip_id;
		if (!targetId) {
			console.warn('No geoflip_id found on selected feature.');
			return;
		}

		// Filter out the selected feature from the active features list
		const updatedFeatures = activeFeatures.filter(
			(f) => f.properties?.geoflip_id !== targetId
		);

		// Update map source
		map.getSource('geoflip-output').setData({
			type: 'FeatureCollection',
			features: updatedFeatures
		});

		// Update context state
		setActiveFeatures(updatedFeatures);
		setSelectedFeature(null);

		// Clear highlight if needed
		if (map.getSource('highlight-feature')) {
			map.getSource('highlight-feature').setData({
				type: 'FeatureCollection',
				features: []
			});
		}
	};

	return deleteSelectedFeature;
};



export { zoomToBounds, handleAPIError, useUpdateActiveLayer, useClearActiveLayer, useAddToActiveLayer, useDeleteFeatureFromLayer }