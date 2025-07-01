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


function NewOAuthDialog({ open, handleClose, newOAuthData }) {
	const theme = useTheme();

    const handleCopySecret = () => {
        navigator.clipboard.writeText(newOAuthData.secret).then(() => {
            toast.success('Copied client secret to clipboard!');
        }).catch((err) => {
            toast.error('Failed to copy.');
        });
    };

    const handleCopyClientID = () => {
        navigator.clipboard.writeText(newOAuthData.id).then(() => {
            toast.success('Copied client id to clipboard!');
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
            {newOAuthData && (
                <DialogTitle
                    fontWeight={600}
                    sx={{
                        backgroundColor: theme.palette.background.default, // Adjust background color
                    }}
                >
                    OAuth Client: {newOAuthData.name}
                </DialogTitle>
            )}
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				<DialogContentText>
					Copy the following client secret and store it in a safe place. You will not be able to see it again.
                    (click to copy)
				</DialogContentText>
                {newOAuthData && (
                    <>
                        <Typography
                            sx={{ 
                                mt: 3,
                                mr: 1,
                                color: theme.palette.text.secondary,
                            }}
                        >
                            Client ID:
                            <Typography
                                variant="span"
                                sx={{ 
                                    cursor: 'pointer',
                                    ":hover": {
                                        color: theme.palette.primary.main,
                                    },
                                    color: theme.palette.text.primary,
                                    ml: 1
                                }}
                                onClick={handleCopyClientID}
                            >
                                {newOAuthData.id}
                            </Typography>
                        </Typography>

                        <Typography
                            sx={{ 
                                mr: 1,
                                color: theme.palette.text.secondary,
                            }}
                        >
                            Client Secret:
                            <Typography
                                variant="span"
                                sx={{ 
                                    cursor: 'pointer',
                                    ":hover": {
                                        color: theme.palette.primary.main,
                                    },
                                    color: theme.palette.text.primary,
                                    ml: 1
                                }}
                                onClick={handleCopySecret}
                            >
                                {newOAuthData.secret}
                            </Typography>
                        </Typography>
                    </>
                )}
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

export default NewOAuthDialog;
