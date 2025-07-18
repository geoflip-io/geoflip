const getLayerStyles = (theme) => [
	{
		id: 'red-fill',
		type: 'fill',
		source: 'combined-features',
		filter: ['all', ['==', ['get', 'style'], 'red'], ['==', ['geometry-type'], 'Polygon']],
		paint: {
			'fill-color': theme.map.features.erase,
			'fill-opacity': 0.3
		}
	},
	{
		id: 'red-outline',
		type: 'line',
		source: 'combined-features',
		filter: ['all', ['==', ['get', 'style'], 'red'], ['==', ['geometry-type'], 'Polygon']],
		paint: {
			'line-color': theme.map.features.erase,
			'line-width': 2
		}
	},
	{
		id: 'red-line',
		type: 'line',
		source: 'combined-features',
		filter: ['all', ['==', ['get', 'style'], 'red'], ['==', ['geometry-type'], 'LineString']],
		paint: {
			'line-color': theme.map.features.erase,
			'line-width': 2
		}
	},
	{
		id: 'red-point',
		type: 'circle',
		source: 'combined-features',
		filter: ['all', ['==', ['get', 'style'], 'red'], ['==', ['geometry-type'], 'Point']],
		paint: {
			'circle-color': theme.palette.error.secondary,
			'circle-radius': 3,
			'circle-stroke-width': 2,
			'circle-stroke-color': theme.map.features.erase,
		}
	},
	{
		id: 'orange-fill',
		type: 'fill',
		source: 'combined-features',
		filter: ['all', ['==', ['get', 'style'], 'orange'], ['==', ['geometry-type'], 'Polygon']],
		paint: {
			'fill-color': theme.map.features.clip,
			'fill-opacity': 0.3
		}
	},
	{
		id: 'orange-outline',
		type: 'line',
		source: 'combined-features',
		filter: ['all', ['==', ['get', 'style'], 'orange'], ['==', ['geometry-type'], 'Polygon']],
		paint: {
			'line-color': theme.map.features.clip,
			'line-width': 2
		}
	},
	{
		id: 'orange-line',
		type: 'line',
		source: 'combined-features',
		filter: ['all', ['==', ['get', 'style'], 'orange'], ['==', ['geometry-type'], 'LineString']],
		paint: {
			'line-color': theme.map.features.clip,
			'line-width': 2
		}
	},
	{
		id: 'orange-point',
		type: 'circle',
		source: 'combined-features',
		filter: ['all', ['==', ['get', 'style'], 'orange'], ['==', ['geometry-type'], 'Point']],
		paint: {
			'circle-color': "#eda774",
			'circle-radius': 3,
			'circle-stroke-width': 2,
			'circle-stroke-color': theme.map.features.clip,
		}
	},

	// main output layer
	{
		id: 'geoflip-output-fill',
		type: 'fill',
		source: 'geoflip-output',
		paint: {
			'fill-color': '#3690EB',
			'fill-opacity': 0.5
		},
		filter: ['==', '$type', 'Polygon']
	},
	{
		id: 'geoflip-output-outline',
		type: 'line',
		source: 'geoflip-output',
		paint: {
			'line-color': '#2D4864',
			'line-width': 2
		},
		filter: ['==', '$type', 'Polygon']
	},
	{
		id: 'geoflip-output-line',
		type: 'line',
		source: 'geoflip-output',
		paint: {
			'line-color': '#2D4864',
			'line-width': 2
		},
		filter: ['==', '$type', 'LineString']
	},
	{
		id: 'geoflip-output-point',
		type: 'circle',
		source: 'geoflip-output',
		paint: {
			'circle-radius': 3,
			'circle-stroke-width': 2,
			'circle-color': '#3690EB',
			'circle-stroke-color': '#2D4864',
		},
		filter: ['==', '$type', 'Point']
	}
];

export {getLayerStyles};