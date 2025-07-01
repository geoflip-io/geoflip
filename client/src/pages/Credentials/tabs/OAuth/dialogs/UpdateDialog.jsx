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

function UpdateDialog({ open, handleClose, oAuthData, updateOAuth }) {
    const theme = useTheme();
    const [name, setName] = useState("");
    const [clientId, setClientId] = useState("");

    useEffect(() => {
        if (oAuthData){
            setClientId(oAuthData.id || "");
            setName(oAuthData.name || "");
        }
    }, [oAuthData]);

	const handleUpdate = () => {

		if (!name) {
			toast.error("API Key Name is required.");
			return;
		}

		updateOAuth(oAuthData.id, name);
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
				Update OAuth Client: {clientId}
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				<DialogContentText>
					Update the name of for your OAuth client:
				</DialogContentText>
				<TextField
					autoFocus
					margin="dense"
					label="OAuth Client Name"
					type="text"
					fullWidth
					variant="standard"
					value={name}
					onChange={(e) => setName(e.target.value)}
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
