import { useState } from 'react';
import { useAuth } from "../../features/AuthManager";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';
import { useNavigate } from 'react-router-dom';
import CostsInfo from './Components/CostsInfo';
import Estimations from './Components/Estimation';
import InputBox from './Components/InputBox';
import { toast } from 'react-toastify';

function RequestCalculator() {
    const { authState } = useAuth();
    const theme = useTheme();
    const pageMaxWidth = 1400;
    const navigate = useNavigate();
    const [estimationData, setEstimationData] = useState({"transformations": [], "output_format": "", request_size: 0});

    const executeEstimate = (requestPayload) => {
        toast.info('Estimating costs.');

        let transformations = [];
        if (requestPayload.transformations) {
            for (let i = 0; i < requestPayload.transformations.length; i++) {
                transformations.push(requestPayload.transformations[i].type);
            }
        }

        const jsonString = JSON.stringify(requestPayload);
        const byteSize = new Blob([jsonString]).size; // Get size in bytes
        const requestSizeInMB = byteSize / (1024 * 1024); // Convert bytes to MB

        const data = {
            transformations: transformations,
            output_format: requestPayload.output_format,
            request_size: requestSizeInMB,
        }

        setEstimationData(data);
    }

    const clearEstimationData = () => {
        setEstimationData({"transformations": [], "output_format": "", request_size: 0});
    }

    return (
        <Box sx={{
            mt: 2,
            overflow: 'auto',
        }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    maxWidth: pageMaxWidth,
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        component="p"
                        variant="h5"
                        align="left"
                        sx={{ 
                            fontWeight: 600, 
                            mb: 0,
                        }}
                    >
                        Request Calculator
                    </Typography>
                    <Typography
                        component="p"
                        variant="body1"
                        align="left"
                        sx={{ 
                            mb: 4,
                            mt: 0,
                            fontSize: '1.1rem',
                            color: theme.palette.text.secondary,
                            ml: 0
                        }}
                    >
                        Calculate estimated request costs
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 4,
                        mr: 5,
                    }}
                >
                    {authState.isAuthenticated && authState.user.subscription_active ? (
						<Button
                            variant="outlined"
                            sx={{
                                borderRadius: 5,
                                padding: "8px 8px",
                                fontWeight: 400,
                                pointerEvents: "none", // Disable all pointer events
                                cursor: "default",
                                borderWidth: "2px",
                                '&:hover': {
                                    borderWidth: "2px",
                                },
                            }}
                        >
                            <StarsIcon
                                sx={{
                                    mr: 1,
                                }}
                            />
                            Pro Plan
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => {
                                navigate("/workspace")
                            }}
                            sx={{
                                borderRadius: 5,
                                padding: "8px 8px",
                                pl: 1,
                                pr: 1.5,
                                fontWeight: 600,
                            }}
                        >
                            <StarsIcon
                                sx={{
                                    mr: 1,
                                }}
                            />
                            Upgrade to Pro
                        </Button>
                    )}
                </Box>
            </Box>
            <Box sx={{ 
                display: 'flex', 
                flex: 1,
                flexDirection: "column",
                maxWidth: pageMaxWidth,
                minWidth: 300,
                maxHeight: 'calc(100vh - 150px)',
                overflow: 'auto',
                scrollbarWidth: 'none',
            }}>

                    <Paper
                        sx={{
                            position: 'relative', // Ensure the Paper is relative
                            display: "flex",
                            padding: 2,
                            paddingTop: 0,
                            flex: 1,
                            borderRadius: 3,
                            boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                            mr: 5,
                            mb: 0
                        }}
                    >
                        <CostsInfo />
                    </Paper>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column", // column for extra-small screens and up
                            sm: "column", // column for extra-small screens and up
                            md: "row",    // row for small screens and up
                        },
                        flex: 1,
                        maxWidth: "100%", // Adjusted to use 100% of the parent container's width
                        mr: 5,
                    }}
                >
                    <Paper
                        elevation={1}
                        sx={{
                            position: 'relative', // Ensure the Paper is relative
                            padding: 2,
                            paddingTop: 0,
                            mt: 1,
                            borderRadius: 3,
                            boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                            flex: 1,
                            minHeight: 300,
                            mr: {
                                xs: 0, // no margin-right for extra-small screens
                                sm: 0,
                                md: 1, // margin-right for small screens and up
                            },
                        }}
                    >
                        <InputBox 
                            executeEstimate={executeEstimate}
                        />
                    </Paper>
                    <Paper
                        elevation={1}
                        sx={{
                            position: 'relative', // Ensure the Paper is relative
                            padding: 2,
                            paddingTop: 0,
                            mt: 1,
                            borderRadius: 3,
                            boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                            flex: 1,
                            minHeight: 300,
                        }}
                    >
                        <Estimations 
                            estimationData={estimationData}
                            clearEstimationData={clearEstimationData}
                        />
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}

export default RequestCalculator;
