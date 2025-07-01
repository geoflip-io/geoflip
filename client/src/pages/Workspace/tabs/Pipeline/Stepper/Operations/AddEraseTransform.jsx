import { 
    Box,
    FormControl,
    MenuItem,
    InputAdornment,
    Typography
} from "@mui/material";
import { useState, useContext, useRef } from "react";
import { useAuth } from "../../../../../../features/AuthManager";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useTheme } from "@mui/material/styles";
import { StyledTextField, StyledSelect, StyledButton, StyledInputLabel, StyledUploadIcon, StyledLongButton } from "../../../../../../utils/InputStyles";
import axios from "axios";
import { handleAPIError } from "../../../Transform/utils/MapOperations";
import { WorkspaceContext } from "../../../../index";
import { useNavigate } from 'react-router-dom';
import { PipelineContext } from "../../PipelineContext";

const AddEraseTransform = ({ setLoading }) => {
    const navigate = useNavigate();
    const {setTransformationsData} = useContext(PipelineContext);
    const { applyApiUsage } = useContext(WorkspaceContext);
    const theme = useTheme();
    const { authState, dispatch } = useAuth();
    const [inputFormat, setInputFormat] = useState("shp");
    const [inputCRS, setInputCRS] = useState(4326);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [eraseFeatures, setEraseFeatures] = useState([]);
    const [addAvailable, setAddAvailable] = useState(false);
    const [uploadAvailable, setUploadAvailable] = useState(false);

    const handleInputFormatChange = (event) => {
        const value = event.target.value;
        if (value === "shp" || value === "dxf" || value === "gpkg") {
            setInputFormat(value);
            setAddAvailable(false);
            setSelectedFile(null);
            setUploadAvailable(false);
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
            setUploadAvailable(true);
        }
    };

    const handleAddErase = async () => {
        const eraseData = {
            type: "erase",
            fileName: selectedFile.name,
            erasing_geojson: eraseFeatures
        };
		setTransformationsData(prevData => [...prevData, eraseData]);
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
                setEraseFeatures(geojsonData);
                applyApiUsage();

                setAddAvailable(true);
                setUploadAvailable(false);
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
                    disabled={!uploadAvailable}
                    onClick={handleUpload}
                    sx={{
                        flex: 1
                    }}
                >
                    Upload
                </StyledButton>
                <StyledButton
                    variant="contained"
                    fullWidth
                    onClick={handleAddErase}
                    disabled={!addAvailable}
                    sx={{
                        ml: 1,
                        flex: 2
                    }}
                >
                    Add Erase <ArrowRightIcon />
                </StyledButton>
            </Box>
        </Box>
    );
};

export default AddEraseTransform;