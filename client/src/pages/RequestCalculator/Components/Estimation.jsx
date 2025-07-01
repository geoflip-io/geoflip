import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Divider, Typography, Tooltip } from "@mui/material";
import CodeOffIcon from '@mui/icons-material/CodeOff';


function Estimation({estimationData, clearEstimationData}) {
	const theme = useTheme();
    const [lastExecuted, setLastExecuted] = useState("");

    useEffect(() => {
        if (estimationData.request_size === 0) {
            setLastExecuted("Estimated Cost");
        } else {
            const date = new Date();
            setLastExecuted(`Requested: ${date.toLocaleString()}`);
        }
    }, [estimationData]);

    function getGTUFromFormat(outputFormat) {
        switch (outputFormat) {
            case "shp":
                return 3;
            case "dxf":
                return 2;
            case "gpkg":
                return 2;
            case "geojson":
                return 1;
            default:
                return 0;
        }
    }
    
    function getTransformationsString(transformations) {
        let transformationsString = "";
        if (transformations.length === 0) {
            return "none";
        }

        for (let i = 0; i < transformations.length; i++) {
            transformationsString += transformations[i] + "/";
        }
        // Remove the trailing "/"
        if (transformationsString.endsWith("/")) {
            transformationsString = transformationsString.slice(0, -1);
        }
        return transformationsString;
    }

    // request size is given in MB
    function calculateRequestSizeGTU(requestSize) {
        if (requestSize === 0) {
            return 0;
        }
        if (requestSize <= 5) {
            return 1;
        } else {
            const remainder = requestSize - 5;
            const roundedRemainder = Math.ceil(remainder);
            return 1 + roundedRemainder;
        }
    }

    function getTotalCostString(totalGTU) {
        const costPerGTU = 0.07;
        const totalCost = totalGTU * costPerGTU;
        return `$${totalCost.toFixed(2)}`;
    }
    
	return (
		<Box
			sx={{
				position: "relative", // Ensure the container is relative
				display: "flex",
				flexDirection: "column",
				padding: 1,
				borderRadius: 3,
				height: "100%",
				width: "100%",
			}}
		>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Typography
                    variant="h7"
                    sx={{
                        flex: 1,
                        mt: 2,
                        fontWeight: 600,
                    }}
                >
                    Estimated Cost Breakdown
                </Typography>
                
                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        flex: 1,
                    }}
                >
                    Estimations are only an approximation, actual costs may vary.
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
					padding: "0 0 0 0",
					borderRadius: "10px 10px 10px 10px",
					mt: 2,
					backgroundColor: theme.palette.secondary.light,
                }}
            >
				<Box
					sx={{
						display: "flex",
                        padding: "10px",
					}}
				>
                    <Typography
                        variant="body2"
                        sx={{
                            flex: 1,
                            color: theme.palette.text.secondary,
                        }}
                    >
                        {lastExecuted}
                    </Typography>
                    <Tooltip title="Clear estimation">
                        <CodeOffIcon 
                            onClick={clearEstimationData}
                            sx={{
                                marginLeft: "auto",
                                cursor: "pointer",
                                ":hover": {
                                    color: theme.palette.text.primary,
                                },
                                color: theme.palette.text.secondary,
                            }}
                        />
                    </Tooltip>
				</Box>
				<Box
					sx={{
						width: "100%",
						padding: "10px 20px 10px 20px",
						border: "none",
						borderRadius: "0px 0px 10px 10px",
						outline: "none", 
						backgroundColor: theme.palette.secondary.main,
						color: theme.palette.text.primary,
						resize: "none",
					}}
				>
                    {/* output format breakdown */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            mt: 1,
                            mb: 1
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.primary,
                                }}
                            >
                                Output Format 
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    ml: 2,
                                }}
                            >
                                {estimationData.output_format} 
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary,
                            }}
                        >
                            {getGTUFromFormat(estimationData.output_format)} GTU
                        </Typography>
                    </Box>

                    {/* Transoformations breakdown */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            mb: 1
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.primary,
                                }}
                            >
                                Transformations 
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    ml: 2,
                                }}
                            >
                                {getTransformationsString(estimationData.transformations)}
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary,
                            }}
                        >
                            {estimationData.transformations.length} GTU
                        </Typography>
                    </Box>

                    {/* Request Size Breakdown */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.primary,
                                }}
                            >
                                Request Size 
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    ml: 2,
                                }}
                            >
                                {estimationData.request_size} MB
                            </Typography>
                        </Box>
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary,
                            }}
                        >
                            {calculateRequestSizeGTU(estimationData.request_size)} GTU
                        </Typography>
                    </Box>

                    <Divider 
                        sx={{
                            mt: 4,
                            mb: 4,
                            borderBottomWidth: 3,
                            borderBottomColor: theme.palette.secondary.light,
                        }}
                    />

                    {/* Total units*/}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
 
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary,
                            }}
                        >
                            Total GTU
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary,
                            }}
                        >
                            {
                                calculateRequestSizeGTU(estimationData.request_size) + 
                                estimationData.transformations.length +
                                getGTUFromFormat(estimationData.output_format)
                            }{" "}GTU
                        </Typography>
                    </Box>
                    {/* Total units*/}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            mt: 1
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                            }}
                        >
                            Total Cost (USD)
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                            }}
                        >
                            {getTotalCostString(
                                calculateRequestSizeGTU(estimationData.request_size) + 
                                estimationData.transformations.length +
                                getGTUFromFormat(estimationData.output_format)
                            )}
                        </Typography>
                    </Box>
                </Box>
            </Box>
		</Box>
	);
}

export default Estimation;
