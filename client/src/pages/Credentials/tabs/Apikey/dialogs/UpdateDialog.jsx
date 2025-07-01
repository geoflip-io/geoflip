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
import { useState, useEffect } from "react";

function UpdateDialog({ open, handleClose, keyData, updateKey, subscription_active }) {
    const theme = useTheme();
    const [name, setName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");

    useEffect(() => {
        if (keyData){
            setName(keyData.name || "");
            setExpiryDate(keyData.expiryDate || "");
        }
    }, [keyData]);
	
    // Get today's date
	const today = new Date();
	const formattedToday = today.toISOString().split("T")[0];

	// Get the date 5 days ahead
	const maxDate = new Date();
	maxDate.setDate(today.getDate() + 5);
	const formattedMaxDate = maxDate.toISOString().split("T")[0];

	const handleUpdate = () => {
		const today = new Date();
		const selectedDate = new Date(expiryDate);

		if (!name) {
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

		updateKey(keyData.id, name, expiryDate);
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
				Update API Key
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				<DialogContentText>
					Update the name and expiry for your API key:
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					label="API Key Name"
					type="text"
					fullWidth
					variant="standard"
					value={name}
					onChange={(e) => setName(e.target.value)}
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
                <Button 
                    onClick={handleClose}
                    variant="outlined"
                >
                    Cancel
                </Button>
				<Button 
                    onClick={handleUpdate}
                    variant="contained"
                >
                    Update
                </Button>
			</DialogActions>
		</Dialog>
	);
}

export default UpdateDialog;
