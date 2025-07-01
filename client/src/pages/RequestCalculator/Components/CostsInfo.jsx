import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Box from "@mui/material/Box";
import { Typography, Tooltip } from "@mui/material";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import RepeatIcon from '@mui/icons-material/Repeat';
import CropFreeIcon from '@mui/icons-material/CropFree';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CostInfoDialog from "../Dialogs/CostInfoDialog";

function CostsInfo() {
	const theme = useTheme();
    const [costInfoDialogOpen, setCostInfoDialogOpen] = useState(false);

    const handleInfoClick = () => {
        setCostInfoDialogOpen(true);
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
                    justifyContent: "space-between",
                    flexDirection: "row",
                }}
            >
                <Typography
                    variant="h7"
                    sx={{
                        mt: 2,
                        mb: 2,
                        fontWeight: 600,
                    }}
                >
                    How Usage Calculation Works:
                </Typography>
                
                <Tooltip title="tiered GTU pricing">
                    <InfoOutlinedIcon
                        onClick={handleInfoClick}

                        sx={{
                            color: theme.palette.text.secondary,
                            fontSize: 24,
                            mt: 2,
                            cursor: "pointer",
                            ":hover": {
                                color: theme.palette.primary.main,
                            }
                        }}
                    />
                </Tooltip>
            </Box>
            <Box
                sx={{
                    mt: 0,
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        sm: "column",
                        md: "row"
                    },
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        mb: {
                            xs: 2,
                            sm: 2,
                            md: 0,
                        }
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            backgroundColor: theme.palette.secondary.main,
                            borderRadius: 3,
                            mr: 2,
                            p: 2
                        }}
                    >
                        <SyncAltIcon
                            sx={{
                                color: theme.palette.primary.main,
                                fontSize: 36,
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                            }}
                        >
                            Request size
                        </Typography>
                        <Typography
                            fontSize={12}
                            sx={{
                                color: theme.palette.primary.main,
                                mt: 1
                            }}
                        >
                            1 GTU for first 5mb.<br /> 1 GTU for every mb thereafter.
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            backgroundColor: theme.palette.secondary.main,
                            borderRadius: 3,
                            mr: {
                                xs: 0,
                                sm: 0,
                                md: 2,
                            },
                            p: 2,
                        }}
                    >
                        <RepeatIcon
                            sx={{
                                color: theme.palette.accent1.main,
                                fontSize: 36,
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                            }}
                        >
                            Transformation
                        </Typography>
                        <Typography
                            fontSize={12}
                            sx={{
                                color: theme.palette.accent1.main,
                                mt: 1
                            }}
                        >
                            1 GTU per dissolve <br/>
                            2 GTU per buffer/clip/erase <br/>
                            3 GTU per union
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            backgroundColor: theme.palette.secondary.main,
                            borderRadius: 3,
                            p: 2,
                        }}
                    >
                        <CropFreeIcon
                            sx={{ color: theme.palette.accent2.main, fontSize: 36 }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: 600,
                            }}
                        >
                            Reprojection
                        </Typography>
                        <Typography
                            fontSize={12}
                            sx={{
                                color: theme.palette.accent2.main,
                                mt: 1
                            }}
                        >
                            0 GTU charged for reprojections
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            flex: 1,
                            backgroundColor: theme.palette.secondary.main,
                            borderRadius: 3,
                            ml: 2,
                            p: 2
                        }}
                    >
                        <SyncAltIcon
                            sx={{
                                color: theme.palette.primary.main,
                                fontSize: 36,
                            }}
                        />
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.main,
                                fontWeight: 600,
                            }}
                        >
                            Output Format
                        </Typography>
                        <Box 
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                mt: 1
                            }}
                        >
                            <Typography
                                fontSize={12}
                                sx={{
                                    color: theme.palette.primary.main,
                                    flex: 1
                                }}
                            >
                                GPKG = 2 GTU <br/>
                                GeoJSON = 1 GTU
                            </Typography>
                            <Typography
                                fontSize={12}
                                sx={{
                                    color: theme.palette.primary.main,
                                    flex: 1
                                }}
                            >
                                SHP = 3 GTU <br/>
                                DXF = 2 GTU
                            </Typography>
                        </Box>

                    </Box>
                </Box>
            </Box>
            <CostInfoDialog 
				open={costInfoDialogOpen} 
				handleClose={() => setCostInfoDialogOpen(false)} 
			/>
		</Box>
	);
}

export default CostsInfo;
