import { 	
	MenuItem, 
	Box,
	FormControl
} from "@mui/material";
import {useState, useContext } from "react";
import { TransformContext } from "../TransformContext";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { zoomToBounds } from "../utils/MapOperations";
import { useTheme } from "@mui/material/styles"
import { toast } from "react-toastify";
import {StyledTextField, StyledSelect, StyledButton, StyledInputLabel} from "../../../../../utils/InputStyles";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { runGeoflipJob } from "../../../../../utils/geoflip-helper";

const BufferTransform = ({setLoading}) => {
	const theme = useTheme();
	const [units, setUnits] = useState("meters");
	const [distance, setDistance] = useState(100);
    const { mapRef, drawRef, stopRotationRef, activeFeatures, setActiveFeatures } = useContext(TransformContext);

	const handleUnitChange = (event) => {
		const value = event.target.value;
		if (value === "meters" || value === "kilometers" || value === "miles" || value === "feet") {
			setUnits(value);
		}
	}

	const handleDistanceChange = (event) => {
		const newInput = event.target.value;
		const numValue = parseInt(newInput);

		if (!isNaN(numValue)) {
			setDistance(numValue);
		} else {
			setDistance(null);
		}
	}

	const handleApplyBuffer = async () => {


		const fetchData = async () => {
			setLoading(true);
            try {
                const formData = new FormData();

                const config = {
                    input: {
                        format: "geojson",
                        data: {
                            type: "FeatureCollection",
                            features: drawRef.current.getAll().features
                        }
                    },
                    transformations:[
                        {
                            type:"buffer",
                            params: {
                                distance: distance,
                                units: units
                            }
                        }
                    ],
                    output: {
                        format: "geojson"
                    }
                };

                formData.append('config', JSON.stringify(config));

                const geojsonData = await runGeoflipJob(
                    import.meta.env.VITE_API_URL,
                    formData
                );

                drawRef.current.set(geojsonData);

                const features = drawRef.current.getAll().features
                setActiveFeatures(features);

                stopRotationRef.current();
                zoomToBounds(mapRef.current, features);

                toast.info(`applied a buffer of ${distance} ${units}`);
                
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

		await fetchData();
	}
	
	return (
		<Box
			sx={{
				mt:3,
				display: "flex",
				flexDirection: "column",
                position: "relative", // Add this
                height: "100%", 
			}}
		>
			<Box 
				sx={{
					flexDirection: "row",
					display: "flex",
                    position: "relative", // Add this
                    height: "100%",
				}}
			>
                <StyledTextField
                    value={distance}
                    label="Distance"
                    onChange={handleDistanceChange}
                    variant="outlined"
                    InputLabelProps={{
                        sx: {
                            color: theme.palette.text.secondary,
                            '&.Mui-focused': {
                                color: theme.palette.text.secondary,
                            }
                        }
                    }}
                    sx={{
                        flex: 1
                    }}
                />
				<FormControl
                    sx={{
                        flex: 1
                    }}
                >
                    <StyledInputLabel
                        sx={{
                            ml: 1
                        }}
                    >
                        Units
                    </StyledInputLabel>
                    <StyledSelect
                        value={units}
                        label="Units"
                        onChange={handleUnitChange}
                        variant="outlined"
                        IconComponent={ArrowDropDownIcon}
                        sx={{
                            ml: 1,
                            flex: 1
                        }}
                    >
                        <MenuItem value={"meters"}>Meters</MenuItem>
                        <MenuItem value={"kilometers"}>Kilometers</MenuItem>
                        <MenuItem value={"miles"}>Miles</MenuItem>
                        <MenuItem value={"feet"}>Feet</MenuItem>
                    </StyledSelect>
				</FormControl>
			</Box>
            <Box
                sx={{
                    flex: 1,
                    alignContent: "flex-end",
                    textAlign: "left",
                    flexDirection: "row"
                }}
            >
                <StyledButton
                    variant="contained"
                    disabled={activeFeatures.length <= 0 ? true : false}
                    sx={{
                        mt: 3,
                        width: "100%"
                    }}
                    onClick={handleApplyBuffer}
                >
                    Apply Buffer <ArrowRightIcon />
                </StyledButton>
            </Box>
		</Box>
	);
}

export default BufferTransform;