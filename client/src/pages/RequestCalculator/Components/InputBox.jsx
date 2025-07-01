import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography, Tooltip } from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Button from "@mui/material/Button";
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import CodeOffIcon from '@mui/icons-material/CodeOff';
import { toast } from "react-toastify";


function InputBox({executeEstimate}) {
	const theme = useTheme();
	const [jsonInput, setJsonInput] = useState('');
	const validTransformations = ["buffer", "clip", "erase", "dissolve", "union"];

	useEffect(() => {
		setJsonInput(`{
	"input_geojson":{
	"type": "FeatureCollection",
	"features": [
		{
		"type": "Feature",
		"properties": {},
		"geometry": {
			"coordinates": [
			115.85665777200404,
			-31.958263013666972
			],
			"type": "Point"
		}
		}
	]
	},
	"output_format": "shp",
	"output_crs": "EPSG:4326",
	"transformations":[
		{
			"type":"buffer",
			"distance": 100,
			"units": "meters"
		}
	]
}`);
	}, []);

	const handleCopy = () => {
		navigator.clipboard.writeText(jsonInput).then(() => {
            toast.success('Copied to clipboard!');
        }).catch((err) => {
            toast.error('Failed to copy.');
        });
	};

	const handleClearJSON = () => {
		setJsonInput('');
	}

	const validateJSON = () => {
		// Check if the JSON is valid
		try {
			JSON.parse(jsonInput)
		} catch (e) {
			toast.error('Invalid JSON input. Please check your input and try again.');
			return false;
		}

		const data = JSON.parse(jsonInput);

		if (data.input_geojson === undefined || data.output_format === undefined) {
			toast.error('input_geojson or output_format is missing. Please check your input and try again.');
			return false;
		}

		switch (data.output_format) {
			case 'shp':
				if (!data.output_crs) {
					toast.error('output_crs is required for shp output');
					return false;
				}
				break;
			case 'geojson':
				break;
			case 'dxf':
				if (!data.output_crs) {
					toast.error('output_crs is required for dxf output');
					return false;
				}
				break;
			case 'gpkg':
				if (!data.output_crs) {
					toast.error('output_crs is required for gpkg output');
					return false;
				}
				break;
			default:
				toast.error('Invalid output_format. Please check your input and try again.');
				return false;
		}

		if (data.transformations) {
			for (let i = 0; i < data.transformations.length; i++) {
				if (!validTransformations.includes(data.transformations[i].type)) {
					toast.error(`Invalid transformation type '${data.transformations[i].type}'. Please check your input and try again.`);
					return false;
				}
			}
		}

		return true;
	}

	const handleEstimate = () => {
		if (!validateJSON()) {
			return;
		}

		executeEstimate(JSON.parse(jsonInput));
	};

	return (
		<Box
			sx={{
				position: "relative", // Ensure the container is relative
				display: "flex",
				flexDirection: "column",
				padding: 1,
				borderRadius: 3,
				height: "100%",
				width: "100%",
			}}
		>
			<Typography
				variant="h7"
				sx={{
					mt: 2,
					fontWeight: 600,
				}}
			>
				JSON Request Box
			</Typography>
            <Typography
				variant="body2"
				sx={{
					color: theme.palette.text.secondary,
				}}
			>
				Request calculator only supports the GeoJSON input format.
			</Typography>
            
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
					padding: "0 0 0 0",
					borderRadius: "10px 10px 10px 10px",
					mt: 2,
					backgroundColor: theme.palette.secondary.light,
                }}
            >
				<Box
					sx={{
						display: "flex",
						padding: "10px",
					}}
				>
					<Tooltip title="Clear JSON">
						<CodeOffIcon 
							onClick={handleClearJSON}
							sx={{
								marginLeft: "auto",
								cursor: "pointer",
								":hover": {
									color: theme.palette.text.primary,
								},
								color: theme.palette.text.secondary,
							}}
						/>
					</Tooltip>
					<Tooltip title="Copy to clipboard">
						<ContentPasteIcon 
							onClick={handleCopy}
							sx={{
								ml: 1,
								cursor: "pointer",
								":hover": {
									color: theme.palette.text.primary,
								},
								color: theme.palette.text.secondary,
							}}
						/>
					</Tooltip>
				</Box>
				<TextareaAutosize
					minRows={10}
					placeholder="Paste your JSON here"
					style={{
						width: "100%",
						padding: "10px",
						border: "none",
						borderRadius: "0px 0px 10px 10px",
						outline: "none", 
						fontFamily: "monospace",
						backgroundColor: theme.palette.secondary.main,
						color: theme.palette.text.primary,
						resize: "none",
					}}
					value={jsonInput}
					onChange={(e) => setJsonInput(e.target.value)}
				/>
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						mt: 1,
						position: "absolute",
						bottom: 20,
						right: 20,
					}}
				>
					<Button
						variant="contained"
						color="primary"
						onClick={handleEstimate}
					>
						<Typography
							variant="body2"
                            sx={{
                                fontWeight: 600,
                            }}
						>
							Estimate
						</Typography>
						<ArrowCircleUpIcon
						 	sx={{
								ml: 1,
								transform: 'rotate(90deg)', // Rotate 90 degrees
							}}
						/>
					</Button>
				</Box>
            </Box>
		</Box>
	);
}

export default InputBox;
