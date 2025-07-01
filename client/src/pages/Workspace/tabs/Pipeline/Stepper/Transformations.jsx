import { 	
	Typography, 
	Box, 
	MenuItem, 
	FormControl
} from "@mui/material";
import { useAuth, refreshToken } from "../../../../../features/AuthManager";
import { ContainerizedLoadingBackdrop } from "../../../../../components/Loader";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddBufferTransform from "./Operations/AddBufferTransform";
import AddEraseTransform from "./Operations/AddEraseTransform";
import AddClipTransform from "./Operations/AddClipTransform";
import AddUnionTransform from "./Operations/AddUnionTransform";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { StyledSelect, StyledInputLabel } from "../../../../../utils/InputStyles";

const Transformations = () => {
    const theme = useTheme();
    const { authState, dispatch } = useAuth();
    const [loading, setLoading] = useState(false);
	const [transformationType, setTransformationType] = useState("none");

    const handleTransformationTypeChange = (event) => {
		const value = event.target.value;
		if (value === "buffer" || value === "erase" || value === "clip" || value === "union" || value === "none") {
			setTransformationType(value);
            refreshToken(dispatch, authState.token);
		}
	}

    const transformComponent = () => {
		switch(transformationType) {
			case "buffer":
				return (
					<AddBufferTransform 
						setLoading={setLoading}
					/>
				);
            case "erase":
                return (
                    <AddEraseTransform 
                        setLoading={setLoading}
                    />
                );
            case "clip":
                return (
                    <AddClipTransform 
                        setLoading={setLoading}
                    />
                );
            case "union":
                return (
                    <AddUnionTransform 
                        setLoading={setLoading}
                    />
                );
			case "none":
				return (
					null
				);
			default:
				return (
					<Typography
						sx={{
							fontSize: 14,
							fontWeight: 400,
							color: theme.palette.text.secondary,
							mt: 1
						}}
					>
						Transform type not supported yet
					</Typography>
				); 
		}
	}

	return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative", // Add this
                height: "100%", 
                p: 2,
            }}
        >
			<FormControl 
				sx={{
					flexDirection: "row",
					display: "flex"
				}}
			>
				<StyledInputLabel>Type</StyledInputLabel>
				<StyledSelect
					value={transformationType}
					label="Type"
					onChange={handleTransformationTypeChange}
					variant="outlined"
					IconComponent={ArrowDropDownIcon}
				>
					<MenuItem value={"none"}>None</MenuItem>
					<MenuItem value={"buffer"}>Buffer</MenuItem>
					<MenuItem value={"erase"}>Erase</MenuItem>
					<MenuItem value={"clip"}>Clip</MenuItem>
					<MenuItem value={"union"}>Union</MenuItem>
				</StyledSelect>
			</FormControl>

			{transformComponent()}

			<ContainerizedLoadingBackdrop isOpen={loading} />
        </Box>
	);
}

export default Transformations;