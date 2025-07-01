import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import { LoadingBackdrop } from "../../components/Loader";
import geoflipLogoLight from "/Geoflip_Logo_white.png";
import geoflipLogoDark from "/Geoflip_Logo_black.png";
import { toast } from "react-toastify";
import { MuiOtpInput } from 'mui-one-time-password-input'

import axios from "axios";

function ResetPassword() {
    const [otp, setOtp] = useState('');
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const navigate = useNavigate();
	const theme = useTheme();
	const [loading, setLoading] = useState(false);

    const handleChange = (value) => {
        setOtp(value);
    };

	const geoflipLogo = theme.palette.mode === "light" ?  geoflipLogoDark : geoflipLogoLight;
	const backgroundURL = theme.palette.mode === "light" ? 
		"url(usgs-9af4Yi_zx7U-unsplash.jpg)" 
		: 
		"url(usgs-IHdQVLwEIdk-unsplash.jpg)";

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setLoading(false);
            return;
        }

        if (otp.length !== 6) {
            toast.error("Invalid OTP");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }

        // check for valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Invalid email address");
            setLoading(false);
            return;
        }

        const payload = {
            email: email,
            new_password: password,
            code: otp,
        };

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/accounts/user/reset-password`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                setLoading(false);
                toast.success("password has been reset. Please login to continue.");
                navigate("/login");
            }
        } catch (error) {
            if (error.response) {
                setLoading(false);
                const data = error.response.data;
                toast.error(`Error resetting password: ${data.message}`);
            } else if (error.request) {
                setLoading(false);
                toast.error("No response received from the server. Please try again.");
            } else {
                setLoading(false);
                toast.error(error.message);
            }
        }
	};

	const handleLoginClick = () => {
		navigate("/login");
	};

	return (
		<Grid container component="main" sx={{ height: "100vh" }}>
			<Grid
				item
				xs={false}
				sm={4}
				md={7}
				sx={{
					backgroundImage: backgroundURL,
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			/>
			<img
				src={geoflipLogo}
				alt="Geoflip Logo"
				style={{
					position: "absolute",
					top: "32px", // Adjust this value to position the logo vertically
					left: "42px", // Adjust this value to position the logo horizontally
					height: "30px", // Adjust the size of the logo as needed
				}}
			/>
			<Typography
				sx={{
					position: "absolute",
					bottom: "24px", // Adjust this value to position the logo vertically
					left: "42px", // Adjust this value to position the logo horizontally
					height: "30px", // Adjust the size of the logo as needed
					color: theme.palette.text.primary,
					fontSize: "0.9rem",
					forntWeight: 600
				}}
			>
				Image by USGS
			</Typography>
			<Grid
				item
				xs={12}
				sm={8}
				md={5}
				elevation={6}
				sx={{
					backgroundColor: theme.palette.background.default,
					color: theme.palette.text.primary,
					transition:
						"box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
					boxShadow:
						"0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)",
					backgroundImage: "none", // Override the background image
				}}
			>
				<Box
					sx={{
						my: 12,
						mx: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "left",
					}}
				>
					<Typography
						component="h1"
						variant="h4"
						align="left"
						sx={{ fontWeight: "bold", mb: 2, mt: 1}}
					>
						Reset Password
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 1 }}
					>
                        <Typography
                            component="p"
                            variant="body1"
                            align="left"
                            sx={{
                                mt: 0,
                                fontSize: '1.1rem',
                                mb: 3
                            }}
                        >
                            Please enter the 6-digit code sent to your email:
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'left', mb: 2 }}>
                            <MuiOtpInput
                                value={otp}
                                onChange={handleChange}
                                length={6}
                                display="flex"
                                gap={2}
                                width={600}
                                height={50}
                            />
                        </Box>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							InputLabelProps={{
								className: "inputLabel",
								shrink: true,
							}}
							sx={{
								"& input:-webkit-autofill": {
									WebkitBoxShadow: `0 0 0 100px ${theme.palette.secondary.main} inset !important`, // Change the color as needed
									WebkitTextFillColor: `${theme.palette.text.primary} !important`, // Change the text color as needed
									caretColor: `${theme.palette.text.primary} !important`, // Change the caret color as needed
								},
								backgroundColor: theme.palette.secondary.main 
							}}
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="New Password"
							type="password"
							id="password"
							autoComplete="current-password"
							value={password}
							InputLabelProps={{
								className: "inputLabel",
								shrink: true,
							}}
							sx={{
								"& input:-webkit-autofill": {
									WebkitBoxShadow: `0 0 0 100px ${theme.palette.secondary.main} inset !important`, // Change the color as needed
									WebkitTextFillColor: `${theme.palette.text.primary} !important`, // Change the text color as needed
									// caretColor: `${theme.palette.text.primary} !important`, // Change the caret color as needed
								},
								backgroundColor: theme.palette.secondary.main 
							}}
							onChange={(e) => setPassword(e.target.value)}
						/>
                        <TextField
							margin="normal"
							required
							fullWidth
							name="confirmPassword"
							label="Confirm Password"
							type="password"
							id="confirmPassword"
							autoComplete="current-password"
							value={confirmPassword}
							InputLabelProps={{
								className: "inputLabel",
								shrink: true,
							}}
							sx={{
								"& input:-webkit-autofill": {
									WebkitBoxShadow: `0 0 0 100px ${theme.palette.secondary.main} inset !important`, // Change the color as needed
									WebkitTextFillColor: `${theme.palette.text.primary} !important`, // Change the text color as needed
									// caretColor: `${theme.palette.text.primary} !important`, // Change the caret color as needed
								},
								backgroundColor: theme.palette.secondary.main 
							}}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 1, mb: 2 }}
						>
							Reset Password
						</Button>

						<Divider sx={{ my: 2, mt: 5 }} />
						<Typography variant="body2" align="left" sx={{ mt: 4 }}>
							Remember your password?{" "}
							<Link
								onClick={handleLoginClick}
								sx={{ 
									color: theme.palette.text.primary,
									cursor: 'pointer'
								 }}
							>
								Login
							</Link>
						</Typography>
					</Box>
				</Box>
			</Grid>
			<LoadingBackdrop isOpen={loading} />
		</Grid>
	);
}

export default ResetPassword;
