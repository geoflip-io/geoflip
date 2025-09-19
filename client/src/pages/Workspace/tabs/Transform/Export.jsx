import { 
	Box, 
	MenuItem, 
	FormControl, 
	InputAdornment } from "@mui/material";
import { TransformContext } from "../Transform/TransformContext";
import { ExportsContext } from "../../../../components/ExportsContext";
import { ContainerizedLoadingBackdrop } from "../../../../components/Loader";
import { useContext, useState } from "react";
import { useTheme } from "@mui/material/styles"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {StyledTextField, StyledSelect, StyledLongButton, StyledInputLabel } from "../../../../utils/InputStyles";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Export = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { activeFeatures } = useContext(TransformContext);
    const { addExportJob } = useContext(ExportsContext);
	const [outputFormat, setOutputFormat] = useState("shp");
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

	const handleExport = async () => {
        const formData = new FormData();
        
        // clean out the hidden geoflip_id field before export
        const cleanedFeatures = activeFeatures.map((feature) => {
            const cleaned = JSON.parse(JSON.stringify(feature)); 

            if (cleaned?.properties?.geoflip_id) {
                delete cleaned.properties.geoflip_id;
            }

            return cleaned;
        });

        const featureCollection = {
            type: "FeatureCollection",
            features: cleanedFeatures,
        };

        const blob = new Blob(
            [JSON.stringify(featureCollection)],
            { type: "application/geo+json" }
        );
        formData.append("input_file", blob, "input.geojson"); 

        const config = {
            input: {
                format: "geojson",
            },
            output: {
                format: outputFormat,
                epsg: outputCRS
            }
        };
        formData.append('config', JSON.stringify(config));

		const fetchData = async () => {
			setLoading(true);
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/transform`,
					formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    }
                );

                if (response.status === 200) {
                    const task_id = response.data.job_id;
                    addExportJob(
                        `transform_output_${new Date().toISOString().replace(/[:.]/g, '-')}`,
                        outputFormat,
                        task_id
                    );

                    navigate('/exports');
                } 
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

		await fetchData();
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
                    <MenuItem disabled value={"gpkg"}>Geopackage</MenuItem>
                    <MenuItem value={"dxf"}>DXF</MenuItem>
                    <MenuItem value={"csv"}>CSV (WKT)</MenuItem>
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
                    flex: 1,
				}}
			>
                    <StyledLongButton
                        variant="outlined"
                        fullWidth
                        disabled={activeFeatures.length <= 0 ? true : false}
                        onClick={handleExport}
                        sx={{
                            maxWidth: "100%",
                            height: 45
                        }}
                    >
                        Export (.{outputFormat})
                    </StyledLongButton>
			</Box>
			<ContainerizedLoadingBackdrop isOpen={loading} />
		</Box>
	);
}

export default Export;