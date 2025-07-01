import { 	
	MenuItem, 
	Box,
	FormControl
} from "@mui/material";
import { useState, useContext } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme } from "@mui/material/styles"
import {StyledTextField, StyledSelect, StyledButton, StyledInputLabel} from "../../../../../../utils/InputStyles";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { PipelineContext } from "../../PipelineContext";

const AddBufferTransform = ({setLoading}) => {
	const theme = useTheme();
    const {transformationsData, setTransformationsData} = useContext(PipelineContext);
	const [units, setUnits] = useState("meters");
	const [distance, setDistance] = useState(100);

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

	const handleAddBuffer = () => {
        const bufferData = {
            type: "buffer",
            distance: distance,
            units: units
        };
		setTransformationsData(prevData => [...prevData, bufferData]);
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
                    sx={{
                        mt: 3,
                        width: "100%"
                    }}
                    onClick={handleAddBuffer}
                >
                    Add Buffer <ArrowRightIcon />
                </StyledButton>
            </Box>
		</Box>
	);
}

export default AddBufferTransform;