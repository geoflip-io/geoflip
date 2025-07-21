import { createContext, useRef, useState } from "react";

export const TransformContext = createContext();

export function TransformContextProvider({ children }) {
    const mapRef = useRef(null);
    const drawRef = useRef(null);
    const stopRotationRef = useRef(null);
    const [activeFeatures, setActiveFeatures] = useState([]);
    const [eraseFeatures, setEraseFeatures] = useState([]);
    const [clipFeatures, setClipFeatures] = useState([]);
    const [selectedFeature, setSelectedFeature] = useState(null);

    return (
        <TransformContext.Provider value={{ 
            mapRef, 
            drawRef, 
            stopRotationRef, 
            activeFeatures, 
            setActiveFeatures, 
            eraseFeatures, 
            setEraseFeatures, 
            clipFeatures, 
            setClipFeatures,
            selectedFeature,
            setSelectedFeature
        }}>
            {children}
        </TransformContext.Provider>
    );
}

