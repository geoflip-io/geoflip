import { createContext, useState } from "react";

export const PipelineContext = createContext();

export function PipelineContextProvider({ children }) {
    const [inputData, setInputData] = useState({
        inputFile: null,
        inputFormat: null,
        inputCRS: null,
    });

    const [outputData, setOutputData] = useState({
        outputFormat: null,
        outputCRS: null,
    });

    const [transformationsData, setTransformationsData] = useState([]);

    return (
        <PipelineContext.Provider value={{ 
            inputData, 
            setInputData,
            transformationsData, 
            setTransformationsData,
            outputData, 
            setOutputData
        }}>
            {children}
        </PipelineContext.Provider>
    );
}

