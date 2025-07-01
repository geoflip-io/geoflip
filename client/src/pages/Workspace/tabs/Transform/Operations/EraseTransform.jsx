import { 
    Box,
    FormControl,
    MenuItem,
    InputAdornment,
    Typography
} from "@mui/material";
import { useState, useContext, useRef } from "react";
import { useAuth } from "../../../../../features/AuthManager";
import { TransformContext } from "../TransformContext";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { zoomToBounds } from "../utils/MapOperations";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { StyledTextField, StyledSelect, StyledButton, StyledInputLabel, StyledUploadIcon, StyledLongButton } from "../../../../../utils/InputStyles";
import axios from "axios";
import { handleAPIError } from "../utils/MapOperations";
import { useNavigate } from 'react-router-dom';


const EraseTransform = ({ setLoading }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { authState, dispatch } = useAuth();
    const { mapRef, drawRef, stopRotationRef, activeFeatures, setActiveFeatures, eraseFeatures, setEraseFeatures } = useContext(TransformContext);
    const [inputFormat, setInputFormat] = useState("shp");
    const [inputCRS, setInputCRS] = useState(4326);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleInputFormatChange = (event) => {
        const value = event.target.value;
        if (value === "shp" || value === "dxf" || value === "gpkg") {
            setInputFormat(value);
        }
    };

    const handleInputCRSChange = (event) => {
        const newInput = event.target.value;
        const numValue = parseInt(newInput);

        if (!isNaN(numValue) && numValue > 0) {
            setInputCRS(numValue);
        } else {
            setInputCRS(null);
        }
    };

    const handleFileSelect = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleApplyErase = async () => {
        const payload = {
            "input_geojson": {
                "type": "FeatureCollection",
                "features": activeFeatures
            },
            "output_format": "geojson",
            "transformations": [
                {
                    "type": "erase",
                    "erasing_geojson": {
                        "type": "FeatureCollection",
                        "features": eraseFeatures
                    }
                }
            ]
        };
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
                            "Authorization": `Bearer ${authState.token}`,
                        }
                    }
                );
                if (response.status === 200) {
                    const geojsonData = response.data;
                    drawRef.current.set(geojsonData);

                    const features = drawRef.current.getAll().features;
                    setActiveFeatures(features);

                    setEraseFeatures([]);

                    const source = mapRef.current.getSource('combined-features');
                    source.setData(geojsonData);

                    stopRotationRef.current();
                    zoomToBounds(mapRef.current, features);

                    toast.info("Erase operation applied successfully");
                }
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

        await fetchData();
    };

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
                const responseEraseFeatures = geojsonData.features;
                setEraseFeatures(geojsonData.features);

                const maxId = activeFeatures.reduce((max, feature) => {
                    const id = feature.id ? parseInt(feature.id.toString(), 10) : 0;
                    return id > max ? id : max;
                }, 0);

                responseEraseFeatures.forEach((feature, index) => {
                    feature.id = (maxId + index + 1).toString();

                    if (!feature.properties) {
                        feature.properties = {};
                    }
                    feature.properties.style = "red";
                });

                const combinedFeatures = {
                    type: "FeatureCollection",
                    features: [...activeFeatures, ...responseEraseFeatures]
                };

                const source = mapRef.current.getSource('combined-features')
                source.setData(combinedFeatures);

                setSelectedFile(null);
                stopRotationRef.current();
                zoomToBounds(mapRef.current, combinedFeatures.features);

                toast.info("File uploaded and features added successfully");
            }
        } catch (error) {
            const loginExpired = await handleAPIError(error);
            if (loginExpired) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                mt: 3,
                display: "flex",
                flexDirection: "column"
            }}
        >
            <FormControl 
                sx={{
                    flexDirection: "row",
                    display: "flex"
                }}
            >
                <StyledInputLabel>Input Format</StyledInputLabel>
                <StyledSelect
                    value={inputFormat}
                    label="Input Format"
                    onChange={handleInputFormatChange}
                    IconComponent={ArrowDropDownIcon}
                    sx={{
                        flex: 1,
                    }}
                >
                    <MenuItem value={"shp"}>Shapefile</MenuItem>
                    <MenuItem value={"gpkg"}>Geopackage</MenuItem>
                    <MenuItem value={"dxf"}>DXF</MenuItem>
                </StyledSelect>
                {inputFormat === "dxf" && (
                    <StyledTextField
                        value={inputCRS}
                        onChange={handleInputCRSChange}
                        label="Input CRS"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Typography 
                                        sx={{
                                            color: theme.palette.text.primary
                                        }}
                                    >EPSG:</Typography>
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            flex: 1,
                            ml: 1,
                        }}
                    />
                )}
                <input
                    type="file"
                    accept={inputFormat === "shp" ? ".zip" : `.${inputFormat}`}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    onClick={(event) => {
                        event.target.value = null;
                    }}
                />
            </FormControl>
            <Box>
                <StyledLongButton
                        variant="text"
                        fullWidth
                        onClick={() => fileInputRef.current?.click()}
                        startIcon={<StyledUploadIcon />}
                        sx={{
                            height: "48px",
                            flex: 2,
                            mt: 3,
                            justifyContent: "flex-start",
                        }}
                    >
                        {selectedFile ? selectedFile.name : "Browse Files"}
                </StyledLongButton>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    mt: 3
                }}
            >
                <StyledButton
                    variant="contained"
                    disabled={!selectedFile}
                    onClick={handleUpload}
                    sx={{
                        flex: 1
                    }}
                >
                    Upload
                </StyledButton>
                <StyledButton
                    variant="contained"
                    disabled={activeFeatures.length > 0 && eraseFeatures.length > 0 ? false : true}
                    fullWidth
                    onClick={handleApplyErase}
                    sx={{
                        ml: 1,
                        flex: 2
                    }}
                >
                    Apply Erase <ArrowRightIcon />
                </StyledButton>
            </Box>
        </Box>
    );
};

export default EraseTransform;