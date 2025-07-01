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

function CreateDialog({ open, handleClose, handleSave, subscription_active }) {
	const theme = useTheme();
	const [newKeyName, setNewKeyName] = useState("");
	const [expiryDate, setExpiryDate] = useState("");

	// Get today's date
	const today = new Date();
	const formattedToday = today.toISOString().split("T")[0];

	// Get the date 5 days ahead
	const maxDate = new Date();
	maxDate.setDate(today.getDate() + 4);
	const formattedMaxDate = maxDate.toISOString().split("T")[0];

	const onSave = () => {
		const today = new Date();
		const selectedDate = new Date(expiryDate);

		if (!newKeyName) {
			toast.error("API Key Name is required.");
			return;
		}

		if (!expiryDate) {
			toast.error("Expiry date is required.");
			return;
		}

		if (selectedDate <= today) {
			toast.error("Expiry date must be in the future.");
			return;
		}

		if (!subscription_active) {
			if (selectedDate > maxDate) {
				toast.error(
					"Free plan cannot create API keys with expiry date more than 5 days in the future."
				);
				return;
			}
		}

		handleSave(newKeyName, expiryDate);
		setNewKeyName("");
		setExpiryDate("");
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
				Create New API Key
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				<DialogContentText>
					Enter the name and expiry for your new API key:
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					label="API Key Name"
					type="text"
					fullWidth
					variant="standard"
					value={newKeyName}
					onChange={(e) => setNewKeyName(e.target.value)}
				/>
				<TextField
					margin="dense"
					label="Expiry Date"
					type="date"
					fullWidth
					variant="standard"
					value={expiryDate}
					onChange={(e) => setExpiryDate(e.target.value)}
					InputLabelProps={{
						shrink: true,
					}}
                    inputProps={
                        !subscription_active ? {
                            min: formattedToday,
                            max: formattedMaxDate,
                        } : {}
                    }
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
