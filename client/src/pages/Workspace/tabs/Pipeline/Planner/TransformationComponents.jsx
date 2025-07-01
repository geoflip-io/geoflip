import {
	Typography,
	Box,
    Divider,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { PipelineContext } from "../PipelineContext";
import { useTheme } from "@mui/material/styles";

const BufferInfo = ({transformationData}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography
                sx={{
                    ml: 2,
                    textTransform: 'capitalize', 
                    fontSize: "1.0rem",
                }}
            >
                {transformationData.type}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    // width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    ml: 4,
                }}
            >
                <Typography >
                    Distance
                </Typography>
                <Typography >
                    {transformationData.distance}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    ml: 4,
                }}
            >
                <Typography >
                    Units
                </Typography>
                <Typography >
                    {transformationData.units}
                </Typography>
            </Box>
        </Box>
    );
}

const EraseInfo = ({transformationData}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography
                sx={{
                    ml: 2,
                    textTransform: 'capitalize', 
                    fontSize: "1.0rem",
                }}
            >
                {transformationData.type}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    ml: 4,
                }}
            >
                <Typography >
                    File
                </Typography>
                <Typography >
                    {transformationData.fileName}
                </Typography>
            </Box>
        </Box>
    );
}

const ClipInfo = ({transformationData}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography
                sx={{
                    ml: 2,
                    textTransform: 'capitalize', 
                    fontSize: "1.0rem",
                }}
            >
                {transformationData.type}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    ml: 4,
                }}
            >
                <Typography >
                    File
                </Typography>
                <Typography >
                    {transformationData.fileName}
                </Typography>
            </Box>
        </Box>
    );
}

const UnionInfo = ({transformationData}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography
                sx={{
                    ml: 2,
                    textTransform: 'capitalize', 
                    fontSize: "1.0rem",
                }}
            >
                {transformationData.type}
            </Typography>
        </Box>
    );
}

export {BufferInfo, EraseInfo, ClipInfo, UnionInfo};