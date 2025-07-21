import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import InputLabel from "@mui/material/InputLabel";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const StyledTextField = styled(TextField)(({ theme }) => ({
	flex: 1,
	gap: 1,
	"& .MuiOutlinedInput-root": {
		height: "48px",
		borderRadius: "8px",
		"& fieldset": {
			border: `1px solid ${theme.palette.text.primary}`,
		},
		"&:hover fieldset": {
			border: `2px solid ${theme.palette.primary.main}`,
		},
		"&:hover input": {
			color: theme.palette.primary.main,
		},
		"&:hover .MuiInputAdornment-root .MuiSvgIcon-root": {
			color: theme.palette.primary.main,
		},
	},
	"& .MuiInputAdornment-root": {
		marginRight: "1px",
	},
	"& input": {
		padding: "8px",
	},
	"& .MuiInputLabel-root": {
		color: theme.palette.text.primary,
		fontWeight: 600,
	},
	"& .MuiInputLabel-root.Mui-focused": {
		color: theme.palette.primary.main,
	},
}));

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
	color: theme.palette.text.primary,
	fontWeight: 600,
}));

const StyledSelect = styled(Select)(({ theme }) => ({
	flex: 1,
	maxHeight: "48px",
	height: "48px",
    minHeight: "48px",
	color: theme.palette.text.primary,
	"& .MuiOutlinedInput-notchedOutline": {
		border: `1px solid ${theme.palette.text.primary}`,
	},
	"& .MuiSelect-select": {
		paddingTop: "8px",
		paddingBottom: "8px",
	},
	"& .MuiSvgIcon-root": {
		color: theme.palette.text.primary,
	},
	"&:hover .MuiOutlinedInput-notchedOutline": {
		border: `2px solid ${theme.palette.primary.main}`,
	},
	"&:hover": {
		color: theme.palette.primary.main,
	},
	"&:hover .MuiSvgIcon-root": {
		color: theme.palette.primary.main,
	},
	borderRadius: "8px",
}));

const StyledButton = styled(Button)(({ theme }) => ({
	height: "40px",
	fontSize: "1rem",
    borderRadius: "6px",
}));

const StyledDeleteButton = styled(Button)(({ theme }) => ({
	color: theme.palette.text.primary ,
	borderColor: theme.palette.text.primary,
	borderWidth: "1px",
	fontWeight: 400,
	'&:hover': {
		borderColor: theme.palette.error.main,
		color: theme.palette.error.main,
		// backgroundColor: theme.palette.grey[1],
		borderWidth: "2px"
	},
	borderRadius: 8,
	width: "100%",
	height: 40,
}));

const StyledUploadIcon = styled(FileUploadOutlinedIcon)(({ theme }) => ({
	color: theme.palette.text.primary,
	fontSize: 20,
	transition: "color 0.3s",
	".MuiButton-root:hover &": {
		color: theme.palette.primary.main,
	},
	".MuiButton-root.Mui-disabled &": {
		color: theme.palette.action.disabled,
	},
}));

const StyledExportIcon = styled(FileDownloadOutlinedIcon)(({ theme }) => ({
	color: theme.palette.text.primary,
	fontSize: 20,
	transition: "color 0.3s",
	".MuiButton-root:hover &": {
		color: theme.palette.primary.main,
	},
	".MuiButton-root.Mui-disabled &": {
		color: theme.palette.action.disabled,
	},
}));

const StyledLongButton = styled(Button)(({ theme }) => ({
	textTransform: "none",
	color: theme.palette.text.primary,
	borderRadius: "8px",
	border: `1px solid ${theme.palette.text.primary}`,
	"&:hover": {
		border: `2px solid ${theme.palette.primary.main}`,
		color: theme.palette.primary.main,
	},
	paddingLeft: "12px",
	fontWeight: 400,
	fontSize: "1rem",
	"&.Mui-disabled": {
		border: `2px solid ${theme.palette.action.disabledBackground}`,
		color: theme.palette.action.disabled,
	},
	"&.Mui-disabled:hover": {
		border: `2px solid ${theme.palette.action.disabledBackground}`,
		color: theme.palette.action.disabled,
	},
}));

const StyledStepLabel = styled(StepLabel)(({ theme }) => ({
	"& .MuiStepLabel-label": {
		fontSize: "1.1rem", // Adjust this value as needed
		fontWeight: 500,
		paddingLeft: 16,
		cursor: "pointer",
		"&:hover": { fontWeight: 600 },
	},
	"& .MuiStepLabel-label.Mui-active": {
		fontSize: "1.1rem", // Ensure active step has the same font size
		fontWeight: 500,
        cursor: "auto"
	},
	"& .MuiStepLabel-label.Mui-completed": {
		fontSize: "1.1rem", // Ensure completed step has the same font size
		fontWeight: 500,
        "&:hover": { fontWeight: 600 },
	},
	"& .MuiStepIcon-root": {
		color:
			theme.palette.mode == "dark"
				? `rgba(255, 255, 255, 0.22)`
				: `rgba(100, 100, 100, 0.22)`,
		cursor: "pointer",
		"&.Mui-active": {
			color: theme.palette.primary.main,
			boxShadow: "-2px 2px 3px rgba(0,0,0,0.4)",
			borderRadius: "60%",
		},
		"&.Mui-completed": {
			color: theme.palette.primary.main,
			boxShadow: "-2px 2px 3px rgba(0,0,0,0.4)",
			borderRadius: "60%",
            background: "radial-gradient(circle, white 50%, transparent 0%)",
		},
		"& .MuiStepIcon-text": {
			fill: theme.palette.mode == "dark"
					? "rgba(255, 255, 255, 0.3)"
					: "rgba(0, 0, 0, 0.3)", // Change this to your desired color
            fontWeight: 500,
            fontSize: "0.9rem",
		},
	},
	"& .Mui-active .MuiStepIcon-text": {
		fill: "#FFFFFF", // Color for the number in the active step
	},
}));

const StyledStepContent = styled(StepContent)(({ theme }) => ({
	borderLeft:
		theme.palette.mode == "dark"
			? `1px solid rgba(255, 255, 255, 0.22)`
			: `1px solid rgba(0, 0, 0, 0.22)`,
}));

export {
	StyledTextField,
	StyledSelect,
	StyledButton,
	StyledLongButton,
	StyledInputLabel,
	StyledUploadIcon,
	StyledExportIcon,
	StyledStepLabel,
	StyledStepContent,
	StyledDeleteButton
};
