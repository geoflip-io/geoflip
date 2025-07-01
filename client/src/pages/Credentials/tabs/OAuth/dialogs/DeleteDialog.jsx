import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
    Typography,
	Box
} from "@mui/material";
import { useTheme } from "@mui/material/styles";


function DeleteDialog({ open, handleClose, oAuthData, deleteOAuth }) {
	const theme = useTheme();

	return (
		<Box
			sx={{
				mt: 230,
			}}
		>
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
					Confirm Delete
				</DialogTitle>
				<DialogContent
					sx={{
						backgroundColor: theme.palette.background.default, // Adjust background color
					}}
				>
					<DialogContentText>
						Are you sure you want to delete OAuth client:
					</DialogContentText>
					<Typography
						sx={{ 
							mt: 2,
						}}
					>
                        <Typography
                            component="span"
                            sx={{
                                fontSize: "1rem",
                                color: theme.palette.text.secondary,
                                mr: 1
                            }}
                        >
                            Name: 
                        </Typography>
						{oAuthData.name}
					</Typography>
                    <Typography
						sx={{ 
							mt: 0,
						}}
					>
                        <Typography
                            component="span"
                            sx={{
                                fontSize: "1rem",
                                color: theme.palette.text.secondary,
                                mr: 1
                            }}
                        >
                            Client ID:
                        </Typography>
						{oAuthData.id}
					</Typography>
				</DialogContent>
				<DialogActions
					sx={{
						backgroundColor: theme.palette.background.default, // Adjust background color
						pr: 2,
						pb: 2
					}}
				>
					<Button 
						onClick={handleClose}
						variant="outlined"
					>
						Cancel
					</Button>
					<Button 
						onClick={() => deleteOAuth(oAuthData.id)}
						variant="outlined"
						color="error"
					>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

export default DeleteDialog;
