import { 	
	Typography, 
	Box, 
	MenuItem, 
	FormControl
} from "@mui/material";
import { ContainerizedLoadingBackdrop } from "../../../../components/Loader";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BufferTransform from "./Operations/BufferTransform";
import EraseTransform from "./Operations/EraseTransform";
import ClipTransform from "./Operations/ClipTransform";
import UnionTransform from "./Operations/UnionTransform";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { StyledSelect, StyledInputLabel } from "../../../../utils/InputStyles";

const Transformations = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
	const [transformationType, setTransformationType] = useState("none");

    const handleTransformationTypeChange = (event) => {
		const value = event.target.value;
		if (value === "buffer" || value === "erase" || value === "clip" || value === "union" || value === "none") {
			setTransformationType(value);
		}
	}

    const transformComponent = () => {
		switch(transformationType) {
			case "buffer":
				return (
					<BufferTransform 
						setLoading={setLoading}
					/>
				);
            case "erase":
                return (
                    <EraseTransform 
                        setLoading={setLoading}
                    />
                );
            case "clip":
                return (
                    <ClipTransform 
                        setLoading={setLoading}
                    />
                );
            case "union":
                return (
                    <UnionTransform 
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