import { 
	Typography, 
	Box,
	MenuItem, 
	FormControl,
	InputAdornment,
} from "@mui/material";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {useState, useRef, useContext} from "react";
import { useTheme } from "@mui/material/styles";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {StyledTextField, StyledInputLabel, StyledSelect, StyledButton, StyledLongButton, StyledUploadIcon} from "../../../../../utils/InputStyles";
import { PipelineContext } from "../PipelineContext";

const Input = () => {
    const theme = useTheme();
    const {inputData, setInputData} = useContext(PipelineContext);
    const [selectedFile, setSelectedFile] = useState(null);
	const [inputFormat, setInputFormat] = useState("shp");
    const [uploadAvailable, setUploadAvailable] = useState(false);
	const [inputCRS, setInputCRS] = useState(4326);
	const fileInputRef = useRef(null);

	const handleInputCRSChange = (event) => {
		const newInput = event.target.value;
		const numValue = parseInt(newInput);

		if (!isNaN(numValue) && numValue > 0) {
			setInputCRS(numValue);
		} else {
			setInputCRS(null);
		}
	}

	const handleInputFormatChange = (event) => {
		const value = event.target.value;
		if (value === "shp" || value === "dxf" || value === "gpkg") {
			setInputFormat(value);
            setSelectedFile(null);
            setUploadAvailable(false);
		}
	}

	const handleFileSelect = (event) => {
		if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
            setUploadAvailable(true);
		}
	};

	const handleUpload = () => {
        setInputData(prevData => ({
            ...prevData,
            inputFormat: inputFormat,
            inputCRS: inputCRS,
            inputFile: selectedFile
        }));
    };

	return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative", // Add this
                height: "100%", 
                width: "100%",
                p: 2,
            }}
        >
            <Box
                sx={{
                    flex: 3,
                    top: 1
                }}
            >
                <FormControl 
                    sx={{
                        flexDirection: "row",
                        display: "flex",
                    }}
                >
                    <StyledInputLabel>Input Format</StyledInputLabel>
                    <StyledSelect
                        value={inputFormat}
                        label="Input Format"
                        onChange={handleInputFormatChange}
                        variant="outlined"
                        IconComponent={ArrowDropDownIcon}
                    >
                        <MenuItem value={"shp"}>Shapefile</MenuItem>
                        <MenuItem value={"gpkg"}>Geopackage</MenuItem>
                        <MenuItem value={"dxf"}>DXF</MenuItem>
                    </StyledSelect>
                    {inputFormat == "dxf" && (
                        <StyledTextField
                            value={inputCRS}
                            label="Input CRS"
                            onChange={handleInputCRSChange}
                            variant="outlined"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography 
                                            sx={{
                                                color: theme.palette.text.primary
                                            }}
                                        >EPSG:</Typography>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                ml: 1
                            }}
                        />
                    )}
                </FormControl >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection:"row",
                        mt: 3
                    }}
                >
                    <input
                        type="file"
                        accept={inputFormat == "shp" ? ".zip" : `.${inputFormat}`}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        onClick={(event) => {
                            event.target.value = null;
                        }}
                    />
                    <StyledLongButton
                        variant="text"
                        fullWidth
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                            height: "48px",
                            justifyContent: "flex-start",
                        }}
                        startIcon={
                            <StyledUploadIcon />
                        }
                    >
                        {selectedFile ? selectedFile.name : "Browse Files"}
                    </StyledLongButton>
                </Box>                
            </Box>
            <Box
                sx={{
                    flex: 1,
                    flexDirection: "row",
                    display: "flex",
                    mt: 3
                }}
            >
                <StyledButton
                    variant="contained"
                    disabled={!uploadAvailable}
                    onClick={handleUpload}
                    sx={{
                        flex: 2
                    }}
                >
                    Add Input File <ArrowRightIcon />
                </StyledButton>
            </Box>
        </Box>
	);
}

export default Input;