import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { createRoot } from 'react-dom/client';
import React from 'react';
import SatelliteOutlinedIcon from '@mui/icons-material/SatelliteOutlined';;  // Import satellite icon
import { getLayerStyles } from '../utils/LayerStyles';

class ClearAll {
    constructor(draw, mapRef, setEraseFeatures, setClipFeatures, clearActiveLayer) {
        this.draw = draw;
        this.container = null;
        this.root = null;
        this.mapRef = mapRef;
        this.setEraseFeatures = setEraseFeatures;
        this.setClipFeatures = setClipFeatures;
        this.clearActiveLayer = clearActiveLayer;
    }

    onAdd() {
        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group clear-all-container';
        
        const button = document.createElement('button');
        button.className = 'clear-all-button';
        button.type = 'button';
        button.setAttribute('title', 'Clear All');

        const iconContainer = document.createElement('div');
        iconContainer.className = 'clear-all-icon';
        
        this.root = createRoot(iconContainer);
        this.root.render(React.createElement(DeleteOutlineIcon));
        
        button.appendChild(iconContainer);
        button.onclick = this.onClick.bind(this);

        this.container.appendChild(button);
        return this.container;
    }

    onRemove() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    onClick() {
        this.clearActiveLayer();

        // Also clear the combined-features source on the map
        if (this.mapRef.current) {
            const source = this.mapRef.current.getSource('combined-features');
            if (source) {
                source.setData({
                    type: 'FeatureCollection',
                    features: []
                });
            }
        }
        this.setEraseFeatures([]);
        this.setClipFeatures([]);

        // try clear the drawn features but will cause an error if there are none
        // so catch the error if there is one.
        try {
            this.draw.deleteAll();
        } catch{}
    }
}

class SatelliteToggle {
    constructor(mapRef, theme) {
        this.mapRef = mapRef;
        this.isSatellite = false;
        this.container = null;
        this.root = null;
        this.theme = theme
    }

    onAdd() {
        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group satellite-toggle-container';

        const button = document.createElement('button');
        button.className = 'satellite-toggle-button';
        button.type = 'button';
        button.setAttribute('title', 'Toggle Satellite');

        const iconContainer = document.createElement('div');
        iconContainer.className = 'satellite-toggle-icon';
        
        this.root = createRoot(iconContainer);
        this.root.render(React.createElement(SatelliteOutlinedIcon));

        button.appendChild(iconContainer);
        button.onclick = this.toggleSatellite.bind(this);

        this.container.appendChild(button);
        return this.container;
    }

    onRemove() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    toggleSatellite() {
        const newStyle = this.isSatellite ? this.theme.map.globe.style : 'mapbox://styles/mapbox/satellite-streets-v11';

        if (this.mapRef.current) {
            this.mapRef.current.setStyle(newStyle);

            this.mapRef.current.once('style.load', () => {
                // Re-add the 'combined-features' source
                this.mapRef.current.addSource('combined-features', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: []
                    }
                });
    
                // Get the styles and re-add all layers
                const styles = getLayerStyles(this.theme);
                styles.forEach(style => {
                    if (this.mapRef.current) {
                        this.mapRef.current.addLayer(style);
                    }
                });
            });
        }
        this.isSatellite = !this.isSatellite;  // Toggle state
    }
}

export { ClearAll, SatelliteToggle };
