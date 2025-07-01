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


function DeleteDialog({ open, handleClose, keyData, deleteKey }) {
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
						Are you sure you want to delete API Key:
					</DialogContentText>
					<Typography
						variant="h6"
						sx={{ 
							mt: 2,
						}}
					>
						{keyData.name}
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
						onClick={() => deleteKey(keyData.id)}
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
