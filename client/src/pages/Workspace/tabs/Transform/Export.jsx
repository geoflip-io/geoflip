import { 
	Box, 
	MenuItem, 
	FormControl, 
	InputAdornment } from "@mui/material";
import { TransformContext } from "../Transform/TransformContext";
import { ContainerizedLoadingBackdrop } from "../../../../components/Loader";
import { useContext, useState } from "react";
import { useTheme } from "@mui/material/styles"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {StyledTextField, StyledSelect, StyledButton, StyledLongButton, StyledInputLabel, StyledExportIcon} from "../../../../utils/InputStyles";
import { toast } from "react-toastify";
import axios from "axios";

const Export = () => {
    const theme = useTheme();
    const { drawRef, activeFeatures } = useContext(TransformContext);
	const [outputFormat, setOutputFormat] = useState("gpkg");
	const [outputCRS, setOutputCRS] = useState(4326);
	const [loading, setLoading] = useState(false);
	const [downloadUrl, setDownloadUrl] = useState(null);

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

	const handleExport = async () => {
		const payload = {
			"input_geojson":{
				"type": "FeatureCollection",
				"features": drawRef.current.getAll().features
			},
			"output_format": outputFormat,
			"output_crs": `EPSG:${outputCRS}`
		}
		const payloadString = JSON.stringify(payload);

		const fetchData = async () => {
			setLoading(true);
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/v1/transform/geojson`,
					payloadString,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
						responseType: "blob"
                    }
                );
                if (response.status === 200) {
                    const url = window.URL.createObjectURL(response.data);
					setDownloadUrl(url);
                    toast.info(`${outputFormat} download ready`);
                } 
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

		await fetchData();
	}

	const handleDownload = () => {
		if (downloadUrl) {
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			let fileExtension;
			switch (outputFormat) {
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
			
			const fileName = `geoflip_${timestamp}.${fileExtension}`;
	
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

            window.URL.revokeObjectURL(downloadUrl);

			setDownloadUrl(null);
		}
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

                    <StyledLongButton
                        variant="outlined"
                        fullWidth
                        disabled={activeFeatures.length <= 0 ? true : false}
                        onClick={handleExport}
                        sx={{
                            maxWidth: "30%"
                        }}
                    >
                        Export
                    </StyledLongButton>
                    <StyledButton
                        variant="contained"
                        onClick={handleDownload}
                        fullWidth
                        disabled={!downloadUrl}
                        endIcon={<StyledExportIcon 
                            sx={{
                                color: "#FFF",
                            }}
                        />}
                        sx={{
                            ml: 1
                        }}
                    >
                        Download
                    </StyledButton>

			</Box>
			<ContainerizedLoadingBackdrop isOpen={loading} />
		</Box>
	);
}

export default Export;