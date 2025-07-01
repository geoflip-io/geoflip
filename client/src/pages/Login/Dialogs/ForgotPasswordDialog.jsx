import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
    Typography,
    TextField
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";


function ForgotPasswordDialog({ open, handleClose, setLoading}) {
	const theme = useTheme();
    const [email, setEmail] = useState("");

    const handleSendForgotPassword = async () => {
        // check for valid email
        setLoading(true);
        handleClose();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Invalid email address");
            setLoading(false);
            return;
        }

        const payload = {
            email: email
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/accounts/user/forgot-password`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                setLoading(false);
                toast.success("Reset code has been sent to your email. Please check your inbox.");
                
            }
        } catch (error) {
            if (error.response) {
                setLoading(false);
                const data = error.response.data;
                toast.error(`Error sending reset code: ${data.message}`);
            } else if (error.request) {
                setLoading(false);
                toast.error("No response received from the server. Please try again.");
            } else {
                setLoading(false);
                toast.error(error.message);
            }
        }
    }

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
				Forgot Password
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				<DialogContentText>
					Enter your email address below to receive a password reset code.
				</DialogContentText>
                <TextField
					autoFocus
                    required
					margin="dense"
					label="email"
					type="text"
					fullWidth
					variant="standard"
                    autoComplete="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
                    InputLabelProps={{
                        className: "inputLabel",
                        shrink: true,
                    }}
                    sx={{
                        mt: 1,
                        "& input:-webkit-autofill": {
                            WebkitBoxShadow: `0 0 0 100px ${theme.palette.secondary.main} inset !important`, // Change the color as needed
                            WebkitTextFillColor: `${theme.palette.text.primary} !important`, // Change the text color as needed
                            caretColor: `${theme.palette.text.primary} !important`, // Change the caret color as needed
                        },
                    }}
				/>
			</DialogContent>
			<DialogActions
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
                <Button 
                    onClick={handleSendForgotPassword}
                >
                    Request Reset
                </Button>
				<Button onClick={handleClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ForgotPasswordDialog;
