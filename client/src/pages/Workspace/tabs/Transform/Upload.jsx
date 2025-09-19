import { 
	Typography, 
	Box,
	MenuItem, 
	FormControl,
	InputAdornment,
} from "@mui/material";
import {useState, useRef, useContext} from "react";
import { TransformContext } from "./TransformContext";
import { useTheme } from "@mui/material/styles";
import { ContainerizedLoadingBackdrop } from "../../../../components/Loader";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { toast } from "react-toastify";
import { runGeoflipJob } from "../../../../utils/geoflip-helper";
import { useUpdateActiveLayer, useClearActiveLayer } from "./utils/MapOperations";
import {StyledTextField, StyledInputLabel, StyledSelect, StyledButton, StyledLongButton, StyledUploadIcon} from "../../../../utils/InputStyles";

const Upload = () => {
    const theme = useTheme();
    const updateActiveLayer = useUpdateActiveLayer();
    const clearActiveLayer = useClearActiveLayer();
    const { activeFeatures } = useContext(TransformContext);
    const [loading, setLoading] = useState(false);
	const [inputFormat, setInputFormat] = useState("shp");
	const [selectedFile, setSelectedFile] = useState(null);
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
		if (value === "shp" || value === "dxf" || value === "gpkg" || value === "csv") {
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

    const handleResetFeatures = () => {
        clearActiveLayer();
    }

	const handleUpload = async () => {
        if (!selectedFile) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('input_file', selectedFile);

			const config = {
                input: {
                    format: inputFormat
                },
                output: {
                    format: "geojson"
                }
            };

            if ((inputFormat === "dxf" ||  inputFormat === "csv") && inputCRS) {
                config.input.epsg = inputCRS;
            }

            formData.append('config', JSON.stringify(config));

            const geojsonData = await runGeoflipJob(
                import.meta.env.VITE_API_URL,
                formData
            );
            handleResetFeatures();
            updateActiveLayer(geojsonData);

            toast.info(`${inputFormat} uploaded successfully`);

            setSelectedFile(null);
            setUploadAvailable(false);

        } catch (error) {
            console.error(error);
            toast.error("there was an error uploading your file");
        } finally {
            setLoading(false);
        }
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
                        <MenuItem disabled value={"gpkg"}>Geopackage</MenuItem>
                        <MenuItem value={"dxf"}>DXF</MenuItem>
                        <MenuItem value={"csv"}>CSV (WKT)</MenuItem>
                    </StyledSelect>
                    {(inputFormat === "dxf" ||  inputFormat === "csv") && (
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
                    Upload
                </StyledButton>
                <StyledLongButton
                    variant="outlined"
                    disabled={activeFeatures.length === 0}
                    onClick={handleResetFeatures}
                    sx={{
                        ml: 1,
                        flex: 1,
                        color: theme.palette.text.main,
                        justifyContent: "flex-centre",
                    }}
                >
                    Reset
                </StyledLongButton>
            </Box>
            <ContainerizedLoadingBackdrop isOpen={loading} />
        </Box>
	);
}

export default Upload;