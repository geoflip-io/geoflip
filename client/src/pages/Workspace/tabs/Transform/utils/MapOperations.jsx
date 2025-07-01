import * as turf from '@turf/turf';
import mapboxgl from "mapbox-gl";
import axios from 'axios';
import { toast } from 'react-toastify';

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

export { zoomToBounds, handleAPIError }