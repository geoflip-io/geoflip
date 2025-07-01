import { 
	Typography, 
	Box,
	MenuItem, 
	FormControl,
	InputAdornment,
} from "@mui/material";
import {useState, useRef, useContext} from "react";
import { TransformContext } from "./TransformContext";
import { useAuth } from "../../../../features/AuthManager";
import { useTheme } from "@mui/material/styles";
import { ContainerizedLoadingBackdrop } from "../../../../components/Loader";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import axios from "axios";
import { toast } from "react-toastify";
import { zoomToBounds, handleAPIError } from "./utils/MapOperations";
import { WorkspaceContext } from "../../../Workspace/index";
import { useNavigate } from 'react-router-dom';
import {StyledTextField, StyledInputLabel, StyledSelect, StyledButton, StyledLongButton, StyledUploadIcon} from "../../../../utils/InputStyles";

const Upload = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { applyApiUsage } = useContext(WorkspaceContext);
    const { authState, dispatch } = useAuth();
    const { mapRef, drawRef, stopRotationRef, activeFeatures, setActiveFeatures } = useContext(TransformContext);
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

    const handleResetFeatures = () => {
        drawRef.current.deleteAll();
        setActiveFeatures([]);
    }

	const handleUpload = async () => {
        if (!selectedFile) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

			const config = {
                output_format: "geojson",
				output_crs: "EPSG:4326"
            };

            if (inputFormat === "dxf" && inputCRS) {
                config.input_crs = `EPSG:${inputCRS}`;
            }

            formData.append('config', JSON.stringify(config));

			const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/v1/transform/${inputFormat}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": `Bearer ${authState.token}`,
                    }
                }
            );

            if (response.status === 200) {
                const geojsonData = response.data;
                drawRef.current.set(geojsonData);

				const features = drawRef.current.getAll().features
                setActiveFeatures(features);

				stopRotationRef.current();
				zoomToBounds(mapRef.current, features);

                toast.info(`${inputFormat} uploaded successfully`);
                applyApiUsage();
            }

            setSelectedFile(null);
            setUploadAvailable(false);

        } catch (error) {
            const loginExpired = await handleAPIError(error);
            if (loginExpired) {
                dispatch({ type: "LOGOUT" });
                navigate('/login');
            }
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