import { createContext, useState } from "react";

export const ExportsContext = createContext();

function ExportsContextProvider({ children }) {
	const [exportJobs, setExportJobs] = useState([]);

    const addExportJob = (name, outputFormat, task_id) => {
        const job = {
            name: name,
            outputFormat: outputFormat,
            task_id: task_id,
        }
        setExportJobs((prevJobs) => [...prevJobs, job]);
    };

    const removeExportJob = (index) => {
        const newJobs = [...exportJobs];
        newJobs.splice(index, 1);
        setExportJobs(newJobs);
    };

	return (
		<ExportsContext.Provider value={{ exportJobs, addExportJob, removeExportJob }}>
			{children}
		</ExportsContext.Provider>
	);
}

export default ExportsContextProvider;