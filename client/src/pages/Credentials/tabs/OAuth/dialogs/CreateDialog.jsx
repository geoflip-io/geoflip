import React, { useState } from "react";
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
	TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";

function CreateDialog({ open, handleClose, handleSave }) {
	const theme = useTheme();
	const [newOAuthName, setOAuthName] = useState("");

	const onSave = () => {
		if (!newOAuthName) {
			toast.error("OAuth credential name is required.");
			return;
		}

		handleSave(newOAuthName);
		setOAuthName("");
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
				mt: -40
			}}
		>
			<DialogTitle
				fontWeight={600}
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				Create OAuth Credentials
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				<DialogContentText>
					Set a name for your new OAuth credentials:
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					label="OAuth Credentials Name"
					type="text"
					fullWidth
					variant="standard"
					value={newOAuthName}
					onChange={(e) => setOAuthName(e.target.value)}
				/>
			</DialogContent>
			<DialogActions
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={onSave}>Save</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CreateDialog;
