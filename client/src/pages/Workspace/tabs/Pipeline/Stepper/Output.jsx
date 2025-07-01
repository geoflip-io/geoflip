import { 
	Box, 
	MenuItem, 
	FormControl, 
    Tooltip,
	InputAdornment } from "@mui/material";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useAuth } from "../../../../../features/AuthManager";
import { ContainerizedLoadingBackdrop } from "../../../../../components/Loader";
import { useState, useContext } from "react";
import { useTheme } from "@mui/material/styles"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {StyledTextField, StyledSelect, StyledButton, StyledInputLabel, StyledExportIcon} from "../../../../../utils/InputStyles";
import { PipelineContext } from "../PipelineContext";

const Output = () => {
    const theme = useTheme();
    const { authState, dispatch } = useAuth();
    const {outputData, setOutputData} = useContext(PipelineContext);
	const [outputFormat, setOutputFormat] = useState("gpkg");
	const [outputCRS, setOutputCRS] = useState(4326);
	const [loading, setLoading] = useState(false);

	const handleOutputFormatChange = (event) => {
		setOutputFormat(event.target.value);
	}

	const handleOutputCRSChange = (event) => {
		const newInput = event.target.value;
		const numValue = parseInt(newInput);

		if (!isNaN(numValue) && numValue > 0) {
			setOutputCRS(numValue);
		} else {
			setOutputCRS(null);
		}
	}

	const handleAddOutput = () => {
        setOutputData(prevData => ({
            ...prevData,
            outputFormat: outputFormat,
            outputCRS: outputCRS
        }));
	};

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
                    flex: 1
                }}
            >
                <StyledInputLabel>Output Format</StyledInputLabel>
                <StyledSelect
                    value={outputFormat}
                    label="Output Format"
                    onChange={handleOutputFormatChange}
                    variant="outlined"
                    IconComponent={ArrowDropDownIcon}
                >
                    <MenuItem value={"shp"}>Shapefile</MenuItem>
                    <MenuItem value={"gpkg"}>Geopackage</MenuItem>
                    <MenuItem value={"dxf"}>DXF</MenuItem>
                    <MenuItem value={"csv"}>CSV</MenuItem>
                </StyledSelect> 
            </FormControl >
            <Box
                sx={{
                    flex: 1
                }}
            >
                <StyledTextField
                    value={outputCRS}
                    label="Output CRS"
                    onChange={handleOutputCRSChange}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                EPSG:
                            </InputAdornment>
                        )
                    }}
                    InputLabelProps={{
                        sx: {
                            color: theme.palette.text.secondary,
                            '&.Mui-focused': {
                                color: theme.palette.text.secondary,
                            },
                        }
                    }}
                    sx={{
                        mt: 3,
                    }}
                />
            </Box>
			<Box 
				sx={{
					mt: 3,
					flexDirection: "row",
					display: "flex",
                    flex: 1
				}}
			>
                    <StyledButton
                        variant="contained"
                        onClick={handleAddOutput}
                        fullWidth
                    >
                        Add Output <ArrowRightIcon />
                    </StyledButton>
			</Box>
			<ContainerizedLoadingBackdrop isOpen={loading} />
		</Box>
	);
}

export default Output;