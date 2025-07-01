import {
	Typography,
	Box,
    MenuItem,
    FormControl,
    InputAdornment,
    Button,
    Tooltip,
    Divider
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useAuth } from "../../../features/AuthManager";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useContext, useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { ContainerizedLoadingBackdrop } from "../../../components/Loader";
import {StyledTextField, StyledSelect, StyledButton, StyledLongButton, StyledInputLabel, StyledUploadIcon, StyledExportIcon} from "../../../utils/InputStyles";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { handleAPIError } from "./Transform/utils/MapOperations";

const Merge = ({handleExportTabChange}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [outputCRS, setOutputCRS] = useState(4326);
    const [outputFormat, setOutputFormat] = useState("gpkg");
    const [loading, setLoading] = useState(false);
    const { authState, dispatch } = useAuth();
    const [inputFileFormat, setInputFileFormat] = useState("gpkg");
    const [inputCRS, setInputCRS] = useState(4326);
    const currentFileRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileAddAvailable, setFileAddAvailable] = useState(false);
    const [mergeFiles, setMergeFiles] = useState([]);
    const disabledMessage = "Please upgrade to PRO to enable this export.";

    const handleInputCRSChange = (event) => {
		const newInput = event.target.value;
		const numValue = parseInt(newInput);

		if (!isNaN(numValue) && numValue > 0) {
			setInputCRS(numValue);
		} else {
			setInputCRS(null);
		}
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

    const handleOutputFormatChange = (event) => {
		setOutputFormat(event.target.value);
	}

    const handleinputFileFormatChange = (event) => {
		setInputFileFormat(event.target.value);
	}

    const handleFileSelect = (event) => {
		if (event.target.files && event.target.files.length > 0) {
            setSelectedFiles(Array.from(event.target.files));
            setFileAddAvailable(true);
		}
	};

    const handleFileAdd = (event) => {
        let fileCRS = null;
        if (inputFileFormat === "dxf") {
            fileCRS = inputCRS;
        }

        if (selectedFiles.length > 0) {
            const newMergeFiles = selectedFiles.map((file, index) => ({
                id: mergeFiles.length + index,
                filename: file.name,
                file: new File([file], file.name, {
                    type: file.type,
                    lastModified: file.lastModified,
                }),
                format: inputFileFormat,
                crs: fileCRS
            }));
    
            setMergeFiles(prevFiles => [...prevFiles, ...newMergeFiles]);
            setFileAddAvailable(false);
            setSelectedFiles([]);
        }
    };

    const handleApplyMerge = async (event) => {
        setLoading(true);
        try {
            const formData = new FormData();

            mergeFiles.forEach((fileObj, index) => {
                formData.append('files', fileObj.file, fileObj.filename);
            });

			const config = {
                output_format: outputFormat,
				output_crs: `EPSG:${outputCRS}`
            };

            if (inputFileFormat === "dxf" && inputCRS) {
                let dxf_crs_mapping = [];
                
                mergeFiles.forEach(fileObj => {
                    dxf_crs_mapping.push(
                        `EPSG:${fileObj.crs}`
                    );
                });

                config.input_crs_mapping = dxf_crs_mapping;
            }

            formData.append('config', JSON.stringify(config));

			const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/v1/transform/${inputFileFormat}/merge?async=true`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": `Bearer ${authState.token}`,
                    },
                }
            );

            if (response.status === 202) {
                try {
                    const task_id = response.data.task_id;
                    setSelectedFiles([]);
                    setMergeFiles([]);

                    handleExportTabChange();
                } catch (error) {
                    await handleAPIError(error);
                }
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

    const handleRemoveMergeFile = (id) => {
        setMergeFiles(mergeFiles.filter(file => file.id !== id));
    };

    const handleResetFiles = (event) => {
        setMergeFiles([]);
    };

    const columns = [
        { field: 'filename', headerName: 'File name', flex: 3 },
        { field: 'format', headerName: 'Format', flex: 1 },
        { 
            field: 'crs', 
            headerName: inputFileFormat === "dxf" ? 'CRS' : '',
            flex: 1 
        },
        { field: 'remove', headerName: '', flex: 2, 
            renderCell: (params) => (
                <Box
                    sx={{
                        right: 0,
                    }}
                >
                    <Button 
                        variant="outlined" 
                        onClick={() => 
                            handleRemoveMergeFile(
                                params.row.id
                            )
                        }
                        sx={{
                            color: theme.palette.text.primary,
                            borderColor: theme.palette.text.primary,
                            borderWidth: "2px",
                            fontWeight: 600,
                            '&:hover': {
								borderColor: theme.palette.text.primary,
								backgroundColor: theme.palette.grey[1],
                                borderWidth: "2px"
                            },
                            borderRadius: 5,
                            width: "100%"
                        }}
                    >
                        Remove
                    </Button>
                </Box>
            )
        },
    ];

	return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                mt: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 400,
                        fontSize: "1.0rem",
                        color: theme.palette.text.primary,
                    }}
                >
                    Upload your files to merge here, all files must be in the same format to merge
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    height: "100%",
                    flex: 1,
                    mt: 2,
                    mb: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        overflow: "auto",
                        minWidth: 340,
                        maxWidth: 340,
                        mr: 2,
                        order: 1,
                        width: "auto",
                        backgroundColor: theme.palette.secondary.main,
                        borderRadius: 2,
                        boxShadow: "-2px 2px 4px rgba(0,0,0,0.1)",
                        p: 4,
                    }}
                >
                    <Typography
                        sx={{
                            color: theme.palette.text.Primary,
                            fontWeight: 600,
                            fontSize: "1.0rem",
                        }}
                    >
                        Add Merge Files
                    </Typography>
                    <FormControl 
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            mt: 4
                        }}
                    >
                        <StyledInputLabel>File Format</StyledInputLabel>
                        <Tooltip
                            title={
                                mergeFiles.length < 1 ? "" : "All files must be the same format to merge, remove files to change format"
                            }
                            placement="top"
                            disabled={mergeFiles.length < 1}
                        >
                            <StyledSelect
                                value={inputFileFormat}
                                label="File Format"
                                disabled={mergeFiles.length > 0}
                                onChange={handleinputFileFormatChange}
                                variant="outlined"
                                IconComponent={ArrowDropDownIcon}
                                sx={{
                                    flex: 1,
                                }}
                            >
                                <MenuItem value={"shp"}>Shapefile</MenuItem>
                                <MenuItem value={"gpkg"}>Geopackage</MenuItem>
                                <MenuItem value={"dxf"}>DXF</MenuItem>
                            </StyledSelect> 
                        </Tooltip>
                        {inputFileFormat == "dxf" && (
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
                                    flex: 1,
                                    ml: 1
                                }}
                            />
                        )}
                    </FormControl>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection:"row",
                            mt: 3,
                        }}
                    >
                        <input
                            type="file"
                            accept={inputFileFormat == "shp" ? ".zip" : `.${inputFileFormat}`}
                            style={{ display: 'none' }}
                            ref={currentFileRef}
                            onChange={handleFileSelect}
                            onClick={(event) => {
                                event.target.value = null;
                            }}
                            multiple 
                        />
                        <StyledLongButton
                            variant="text"
                            fullWidth
                            onClick={() => currentFileRef.current?.click()}
                            sx={{
                                height: "48px",
                                justifyContent: "flex-start",
                                flex: 2
                            }}
                            startIcon={
                                <StyledUploadIcon />
                            }
                        >
                            {selectedFiles.length > 0 
                                ? `${selectedFiles.length} file(s) selected` 
                                : "Browse Files"}
                        </StyledLongButton>
                        <StyledButton
                            variant="contained"
                            disabled={!fileAddAvailable}
                            onClick={handleFileAdd}
                            sx={{
                                flex: 1,
                                height: "48px",
                                ml: 1
                            }}
                        >
                            Add <ArrowRightIcon />
                        </StyledButton>
                    </Box>
                    <Divider 
                        sx = {{
                            mt: 5,
                            mb: 4  
                        }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1
                        }}
                    >
                        <Typography
                            sx={{
                                color: theme.palette.text.Primary,
                                fontWeight: 600,
                                fontSize: "1.0rem",
                            }}
                        >
                            Configure Output
                        </Typography>
                        <FormControl 
                            sx={{
                                mt: 3,
                                flexDirection: "row",
                            }}
                        >
                            <StyledInputLabel>Output Format</StyledInputLabel>
                            <StyledSelect
                                value={outputFormat}
                                label="Output Format"
                                onChange={handleOutputFormatChange}
                                variant="outlined"
                                IconComponent={ArrowDropDownIcon}
                                sx={{
                                    flex: 1
                                }}
                            >
                                <MenuItem value={"shp"}>Shapefile</MenuItem>
                                <MenuItem value={"gpkg"}>Geopackage</MenuItem>
                                <MenuItem value={"dxf"}>DXF</MenuItem>
                                <MenuItem value={"csv"}>CSV</MenuItem>
                            </StyledSelect> 

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
                                    flex: 1,
                                    ml: 1
                                }}
                            />
                        </FormControl >

                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flex: 1,
                        order: 2,
                        flexDirection: "column",
                    }}
                >
                    <DataGrid
                        rows={mergeFiles}
                        columns={columns}
                        localeText={{
                            noRowsLabel: "Files to be merged will appear here",
                        }}
                        autoHeight
                        autoWidth
                        disableRowSelectionOnClick
                        disableSelectionOnClick
                        disableColumnMenu
                        hideFooter
                        className="custom-header"
                        sx={{
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 600,
                            },
                            border: "none",
                            "& .MuiDataGrid-cell:focus": {
                                outline: "none",
                            },
                            "& .MuiDataGrid-cell": {
                                "&:focus": {
                                    outline: "none",
                                },
                            },
                            "& .MuiDataGrid-cell--textCenter": {
                                "&:focus-within": {
                                    outline: "none",
                                },
                            },
                            borderRadius: 6,
                            mt: 0,
                        }} 
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                            mt: 2,
                        }}
                    >
                        <Box sx={{ display: "flex" }}>
                            <StyledButton
                                variant="contained"
                                disabled={mergeFiles.length <= 1}
                                onClick={handleApplyMerge}
                                sx={{
                                    bottom: 0,
                                    height: "48px",
                                    width: "140px",
                                }}
                            >
                                Apply Merge
                            </StyledButton>
                        </Box>
                        <StyledLongButton
                            variant="text"
                            onClick={handleResetFiles}
                            disabled={mergeFiles.length <= 0}
                            sx={{
                                height: "48px",
                                width: "100px",
                                ml: 1
                            }}
                        >
                            Reset
                        </StyledLongButton>
                    </Box>
                </Box>
                <ContainerizedLoadingBackdrop isOpen={loading} />
            </Box>
        </Box>
	);
}

export default Merge;
