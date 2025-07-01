import WorkspaceApp from "./WorkspaceApp";
import CheckAccount from "../../components/CheckAccount";
import { createContext, useEffect, useState } from "react";
import { useAuth } from "../../features/AuthManager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";


export const WorkspaceContext = createContext();

function WorkspaceContextProvider({ children }) {
    const navigate = useNavigate();
	const [exportJobs, setExportJobs] = useState([]);
    const { authState, dispatch } = useAuth();
    const [ apiCallsRemaining, setApiCallsRemaining ] = useState(null);

    const monthlyAPICallLimit = 30;
    const applyApiUsage = () => {
        setApiCallsRemaining(
            (prevUsage) => prevUsage - 1
        );
    };

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

    let mounted = false;
    useEffect(() => {
        const fetchCurrentUsageData = async () => {
            mounted = true;
            const date = new Date();
            const currentYear = date.getFullYear();
            const currentMonth = date.getMonth() + 1;

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/accounts/usage/monthly/${authState.user.user_id}/${currentMonth}/${currentYear}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${authState.token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    const apiCallsUsed = response.data.length;
                    setApiCallsRemaining(monthlyAPICallLimit - apiCallsUsed);
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 404) {
                        setApiCallsRemaining(monthlyAPICallLimit);
                        return;
                    }

                    if (error.response.status === 401) {
                        dispatch({ type: "LOGOUT" });
                        navigate("/login");
                    }

                } else {
                    toast.error("An error occurred while fetching usage data.");
                }
            }
        };

        if (!mounted){
            fetchCurrentUsageData();
        }
    }, []);

	return (
		<WorkspaceContext.Provider value={{ exportJobs, addExportJob, removeExportJob, apiCallsRemaining, applyApiUsage }}>
			{children}
		</WorkspaceContext.Provider>
	);
}

function Workspace() {
	return (
		<CheckAccount>
			{({ setFreePlan }) => (
                <WorkspaceContextProvider>
                    <WorkspaceApp setFreePlan={setFreePlan} />
                </WorkspaceContextProvider>
            )}
		</CheckAccount>
	);
}

export default Workspace;
