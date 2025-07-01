import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";


function NewKeyDialog({ open, handleClose, newKeyData }) {
	const theme = useTheme();

    const handleCopy = () => {
        navigator.clipboard.writeText(newKeyData.key).then(() => {
            toast.success('Copied to clipboard!');
        }).catch((err) => {
            toast.error('Failed to copy.');
        });
    };

	return (
		<Dialog
			open={open}
			onClose={handleClose}
            PaperProps={{
                style: {
                  borderRadius: 12,
                },
            }}
			sx={{
				mt: -40,
			}}
		>
			<DialogTitle
				fontWeight={600}
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				API Key: {newKeyData.name} ({newKeyData.expiryDate})
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				<DialogContentText>
					Copy the following API key and store it in a safe place. You will not be able to see it again.
                    (click to copy)
				</DialogContentText>

                    <Typography
                        sx={{ 
                            mt: 3,
                            mr: 1,
                            color: theme.palette.text.secondary,
                        }}
                    >
                        API Key:
                        <Typography
                            variant="span"
                            sx={{ 
                                mt: 2,
                                ml: 1,
                                cursor: 'pointer' ,
                                ":hover": {
                                    color: theme.palette.primary.main,
                                },
                                color: theme.palette.text.primary,
                            }}
                            onClick={handleCopy}
                        >
                            {newKeyData.key}
                        </Typography>
                    </Typography>
			</DialogContent>
			<DialogActions
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				<Button onClick={handleClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}

export default NewKeyDialog;
