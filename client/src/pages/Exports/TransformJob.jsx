import { 
    Box,
    Button,
    Typography,
} from "@mui/material";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { useState, useEffect } from 'react';
import { useContext } from "react";
import { ExportsContext } from "../../components/ExportsContext";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { toast } from "react-toastify";
import { setItem, getItem, removeItem } from "../../utils/storage";
import { ContainerizedLoadingBackdrop } from "../../components/Loader";
import { StyledDeleteButton } from "../../utils/InputStyles";


const TransformJob = ({name, taskId, outputFormat, handleUpdateRows}) => {
    const theme = useTheme();
    const { exportJobs, removeExportJob } = useContext(ExportsContext);
    const [ downloadUrl, setDownloadUrl ] = useState(null);
    const [ processingMessage, setProcessingMessage ] = useState("Processing...");
    const [loading, setLoading] = useState(false);
    const [timeoutId, setTimeoutId] = useState(null);

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const clearJob = () => {
        const jobId = exportJobs.findIndex(job => job.task_id === taskId);
        removeExportJob(jobId);
    }

    const checkProcessingStatus = async (taskId) => {
        const currentState = JSON.parse(getItem(taskId));
        
        if (currentState != null && currentState.state == "FAILURE") {
            setProcessingMessage("Task failed during processing");
            return;
        }

        if (currentState != null && currentState.state == "SUCCESS") {
            setDownloadUrl(currentState.output_url);
            return;
        } 

        try {
            const taskState = {
                "state": "PROCESSING",
                "output_url": null,
                "name": name,
                "outputFormat": outputFormat
            };
            setItem(taskId, JSON.stringify(taskState));

            // add taskId to exportJobs
            let exportJobs = getItem("exportJobs");
            if (exportJobs === null) {
                setItem("exportJobs", JSON.stringify([taskId]));
            } else {
                exportJobs = JSON.parse(exportJobs);
                if (!exportJobs.includes(taskId)) {
                    exportJobs.push(taskId);
                    setItem("exportJobs", JSON.stringify(exportJobs));
                }
            }

            // sleep for a second before checking to avoid rate limiting
            await sleep(1000);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/result/status/${taskId}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                const data = response.data;
                setProcessingMessage(data.message);
                if (data.status === "SUCCESS") {
                    setDownloadUrl(data.output_url);
                    const taskState = {
                        "state": "SUCCESS",
                        "output_url": data.output_url,
                        "name": name,
                        "outputFormat": outputFormat
                    };
                    setItem(taskId, JSON.stringify(taskState));
                } else if (data.status === "FAILURE") {
                    const taskState = {
                        "state": "FAILURE",
                        "output_url": null,
                        "name": name,
                        "outputFormat": outputFormat
                    };
                    setItem(taskId, JSON.stringify(taskState));
                }
            }

        } catch (error) {
            toast.error("error checking job status");
        } finally {
            const id = setTimeout(() => {
                checkProcessingStatus(taskId);
            }, 4000);
            setTimeoutId(id); // Store the timeout ID
        }
    };

    let mounted = false;
    useEffect(() => {
        if (!mounted) {
            checkProcessingStatus(taskId);
            mounted = true;
        }
    }, [taskId]);

    const handleDownload = async(name, url, format) => {
        setLoading(true);
        let fileExtension;
        switch (format) {
            case 'shp':
                fileExtension = 'zip';
                break;
            case 'gpkg':
                fileExtension = 'gpkg';
                break;
            case 'dxf':
                fileExtension = 'dxf';
                break;
            default:
                fileExtension = outputFormat;
        }
        
        const fileName = `geoflip_${name}.${fileExtension}`;

        try {
            const response = await axios({
                url: url,
                method: 'GET',
                responseType: 'blob', // Still important for handling file data
            });

            // Create a URL for the blob
            const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
            
            // Create a link element and trigger the download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            link.remove();
            window.URL.revokeObjectURL(blobUrl);

            clearJob();
        } catch (error) {
            toast.error("download has expired.");
            clearJob();
        } finally {
            setLoading(false);
            removeItem(taskId);

            // Clear the timeout
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            // remove taskId from exportJobs
            const localStorageExportJobs = JSON.parse(getItem("exportJobs"));
            setItem("exportJobs", JSON.stringify(localStorageExportJobs.filter(job => job !== taskId)));
        }
	};

    const handleRemove = () => {
        // Clear the timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // remove taskId from exportJobs context
        const jobId = exportJobs.findIndex(job => job.task_id === taskId);
        removeExportJob(jobId);

        // remove taskId from local storage
        removeItem(taskId);

        // remove taskId from exportJobs list in local storage
        const localStorageExportJobs = JSON.parse(getItem("exportJobs"));
        setItem("exportJobs", JSON.stringify(localStorageExportJobs.filter(job => job !== taskId)));

        // update data in the table
        handleUpdateRows();
    }

    return (
        <Box
            sx={{
                right: 0,
            }}
        >
            {
                downloadUrl ? (
                    <Button 
                        variant="outlined" 
                        onClick={() => 
                            handleDownload(
                                name,
                                downloadUrl, 
                                outputFormat
                            )
                        }
                        sx={{
                            color: theme.palette.text.primary,
                            borderColor: theme.palette.text.primary,
                            borderWidth: "2px",
                            '&:hover': {
                                borderColor: theme.palette.text.primary,
                                backgroundColor: theme.palette.grey[1],
                                borderWidth: "2px"
                            },
                            borderRadius: 5,
                            width: "100%"
                        }}
                    >
                        Download
                    </Button>
                ) : (
                    processingMessage == "Task failed during processing" ? (
                        <Box sx={{ 
                            width: '100%', 
                            mt: 1,
                            display: "flex",
                            flexDirection: "row",
                        }}> 
                            <Typography
                                sx={{
                                    textAlign: "left",
                                    verticalAlign: "middle",
                                    mr: 2,
                                    fontWeight: 300,
                                    fontSize: "0.9rem",
                                    color: theme.palette.text.primary,
                                }}
                            >
                                Task failed during processing,<br /> api usage has not been recorded.
                            </Typography>
                            <StyledDeleteButton 
                                variant="outlined" 
                                onClick={() => 
                                    handleRemove(
                                        name,
                                        downloadUrl, 
                                        outputFormat
                                    )
                                }
                            >
                                Remove
                            </StyledDeleteButton>
                        </Box>
                    ) : (
                        <Box sx={{ width: '100%', mt:1 }}>
                            <Typography
                                sx={{
                                    textAlign: "center",
                                    fontWeight: 400,
                                    fontSize: "0.8rem",
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {`${processingMessage}...`}
                            </Typography>
                            <LinearProgress 
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    [`& .${linearProgressClasses.bar}`]: {
                                        borderRadius: 5,
                                        backgroundColor: '#1a90ff',
                                        ...theme.applyStyles('dark', {
                                        backgroundColor: '#308fe8',
                                        }),
                                    }
                                }}
                            />
                        </Box>
                    )
                )
            }
            <ContainerizedLoadingBackdrop isOpen={loading} />
        </Box>
    )
}

export default TransformJob;