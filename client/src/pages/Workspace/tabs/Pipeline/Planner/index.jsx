import {
	Typography,
	Box,
    Divider,
} from "@mui/material";
import { useAuth } from "../../../../../features/AuthManager";
import { useContext, useMemo, useState } from "react";
import { PipelineContext } from "../PipelineContext";
import { WorkspaceContext } from "../../../index";
import { useTheme } from "@mui/material/styles";
import { StyledButton, StyledLongButton } from "../../../../../utils/InputStyles";
import { BufferInfo, EraseInfo, ClipInfo, UnionInfo } from "./TransformationComponents";
import { handleAPIError } from "../../Transform/utils/MapOperations";
import { useNavigate } from 'react-router-dom';
import { ContainerizedLoadingBackdrop } from "../../../../../components/Loader";
import axios from "axios";

const Planner = ({handleExportTabChange}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { authState, dispatch } = useAuth();
    const [loading, setLoading] = useState(false);
    const { applyApiUsage, addExportJob } = useContext(WorkspaceContext);
    const {            
        inputData, 
        setInputData,
        transformationsData, 
        setTransformationsData,
        outputData, 
        setOutputData
    } = useContext(PipelineContext);

    const isEmpty = useMemo(() => {
        return !inputData.inputFile && transformationsData.length === 0 && !outputData.outputFormat;
    }, [inputData.inputFile, transformationsData, outputData.outputFormat]);

    const runPipelineAvailable = useMemo(() => {
        return !inputData.inputFile || !outputData.outputFormat;
    }, [inputData.inputFile, outputData.outputFormat]);

    const handleReset = () => {
        setInputData({
            inputFile: null,
            inputFormat: null,
            inputCRS: null,
        });
        setTransformationsData([]);
        setOutputData({
            outputFormat: null,
            outputCRS: null,
        });
    }

    const handleRunPipeline = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', inputData.inputFile);

            // Create a new array with "fileName" removed from each transformation
            const cleanedTransformations = transformationsData.map(transformation => {
                const { fileName, ...cleanTransformation } = transformation;
                return cleanTransformation;
            });

            let piplineConfig = {
                output_format: outputData.outputFormat,
                output_crs: `EPSG:${outputData.outputCRS}`,
                transformations: cleanedTransformations,
            };

            if (inputData.inputFormat === "dxf" && inputData.inputCRS) {
                piplineConfig.input_crs = `EPSG:${inputData.inputCRS}`;
            }

            formData.append('config', JSON.stringify(piplineConfig));

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/v1/transform/${inputData.inputFormat}?async=true`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${authState.token}`,
                    },
                }
            );

            if (response.status === 202) {
                try {
                    const task_id = response.data.task_id;
                    addExportJob(
                        `pipeline_${inputData.inputFormat}_${new Date().toISOString().replace(/[:.]/g, '-')}`, 
                        outputData.outputFormat,
                        task_id
                    );
        
                    applyApiUsage();
                    handleReset();
                    handleExportTabChange();
                } catch (error) {
                    await handleAPIError(error);
                }
            }
        } catch (error) {
            console.error('API call failed:', error);
            const loginExpired = await handleAPIError(error);
            if (loginExpired) {
                dispatch({ type: "LOGOUT" });
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                padding: "0 0 0 0",
                borderRadius: "5px",
                backgroundColor: theme.palette.secondary.light,
                flex: 1,
                height: "100%",
            }}        
        >
            <Box
                sx={{
                    display: "flex",
                    padding: "10px",
                    color: theme.palette.text.secondary,
                }}
            >
                Pipeline Transformation Details
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    width: "100%",
                    height  : "100%",
                    padding: "10px 20px 10px 20px",
                    border: "none",
                    borderRadius: "0px 0px 5px 5px",
                    outline: "none", 
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.text.primary,
                    resize: "none",
                    flexDirection: "column",
                    justifyContent: isEmpty ? "center" : "space-between",
                    alignItems: isEmpty ? "center" : "stretch",
                }}
            >
                <Box
                    sx={{ flexGrow: 1, overflowY: 'auto' }}
                >
                    {isEmpty ? (
                        <Typography
                            sx={{
                                fontSize: "1.0rem",
                                color: theme.palette.text.secondary,
                                textAlign: "center",
                                mt: 20,
                            }}
                        >
                            No pipeline data available. Start by selecting an input file, adding transformations, or setting an output format.
                        </Typography>
                    ) : (
                        <>
                            {/* if an inputfile has been selected */}
                            {inputData.inputFile && (
                                <>
                                    <Box>
                                        <Typography
                                            sx={{
                                                mt: 2,
                                                fontWeight: 600,
                                                fontSize: "1.1rem",
                                                color: theme.palette.text.primary,
                                            }}
                                        >
                                            Input Format:
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    ml: 2,
                                                    textTransform: 'uppercase', 
                                                    fontSize: "1.0rem",
                                                }}
                                            >
                                                {inputData.inputFormat}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: "1.0rem",
                                                }}                        
                                            >
                                                {inputData.inputFile.name}
                                            </Typography>
                                        </Box>
                                        {inputData.inputFormat === "dxf" && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        ml: 2,
                                                        fontSize: "1.0rem",
                                                    }}
                                                >
                                                    CRS
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: "1.0rem",
                                                    }} 
                                                >
                                                    EPSG: {inputData.inputCRS}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                    <Divider 
                                        sx={{
                                            mt: 3,
                                            borderBottomWidth: 3,
                                            borderBottomColor: theme.palette.secondary.light,
                                        }} 
                                    />
                                </>
                            )}

                            {/* if transformations have been added */}
                            {transformationsData.length > 0 && (
                                <>
                                    <Box>
                                        <Typography
                                            sx={{
                                                mt: 2,
                                                fontWeight: 600,
                                                fontSize: "1.1rem",
                                                color: theme.palette.text.primary,
                                            }}
                                        >
                                            Transformations:
                                        </Typography>
                                        {transformationsData.map((transform, index)=>(
                                            <Box key={index}>
                                                {(() => {
                                                    switch (transform.type) {
                                                        case 'buffer':
                                                            return <BufferInfo transformationData={transform} />;
                                                        case 'clip':
                                                            return <ClipInfo transformationData={transform} />;
                                                        case 'erase':
                                                            return <EraseInfo transformationData={transform} />;
                                                        case 'union':
                                                            return <UnionInfo transformationData={transform} />;
                                                        default:
                                                            return <Typography>No matching transform type.</Typography>;
                                                    }
                                                })()}
                                            </Box>
                                        ))}
                                    </Box>
                                    <Divider 
                                        sx={{
                                            mt: 3,
                                            borderBottomWidth: 3,
                                            borderBottomColor: theme.palette.secondary.light,
                                        }} 
                                    />
                                </>
                            )}

                            {/* if an inputfile has been selected */}
                            {outputData.outputFormat && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        mb: 2
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: "1.1rem",
                                            color: theme.palette.text.primary,
                                        }}
                                    >
                                        Output Format:
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                ml: 2,
                                                textTransform: 'uppercase', 
                                                fontSize: "1.0rem",
                                            }}
                                        >
                                            {outputData.outputFormat}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "1.0rem",
                                            }}                        
                                        >
                                            geoflip.{outputData.outputFormat}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                ml: 2,
                                                fontSize: "1.0rem",
                                            }}
                                        >
                                            CRS
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "1.0rem",
                                            }} 
                                        >
                                            EPSG: {outputData.outputCRS}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end', // Aligns the box to the right
                        width: '100%', // Ensures the box takes full width
                        mt: 2, // Adds some top margin
                    }}                
                >
                    <StyledButton
                        variant="contained"
                        onClick={handleRunPipeline}
                        disabled={runPipelineAvailable}
                        sx={{
                            height: "42px",
                        }}
                    >
                        Run Pipeline
                    </StyledButton>
                    <StyledLongButton
                        variant="outlined"
                        onClick={handleReset}
                        sx={{
                            height: "42px",
                            ml: 2
                        }}
                    >
                        Reset
                    </StyledLongButton>
                </Box>
                <ContainerizedLoadingBackdrop isOpen={loading} />
            </Box>
        </Box>
    );
};

export default Planner;