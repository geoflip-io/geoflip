import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useReducer } from "react";
import { initialState, signupReducer } from "./signupReducer";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { LoadingBackdrop } from "../../components/Loader";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import TermsModal from "../../components/TermsModal";

import geoflipLogoLight from "/Geoflip_Logo_white.png";
import geoflipLogoDark from "/Geoflip_Logo_black.png";

import { toast } from "react-toastify";
import _ from "lodash";

function SignUp() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [agreeTerms, setAgreeTerms] = useState(false);
	const [state, dispatch] = useReducer(signupReducer, initialState);
	const [termsModalOpen, setTermsModalOpen] = useState(false);
	const [termsPage, setTermsPage] = useState(0);
	const navigate = useNavigate();
	const theme = useTheme();

	const geoflipLogo = geoflipLogoLight;
	const backgroundURL =
		theme.palette.mode === "light"
			? "url(/nasa-i9w4Uy1pU-s-unsplash.jpg)"
			: "url(/nasa-CpHNKNRwXps-unsplash.jpg)";

	// Wrap handleSubmit with useCallback
	const handleSubmit = useCallback(async () => {
		if (!firstName) {
			dispatch({
				type: "VALIDATION_FAILURE",
				payload: "First name is required.",
			});
			return;
		} else {
			if (firstName.length < 2) {
				dispatch({
					type: "VALIDATION_FAILURE",
					payload: "First name must be at least 2 characters long.",
				});
				return;
			}
		}

		if (!lastName) {
			dispatch({
				type: "VALIDATION_FAILURE",
				payload: "Last name is required.",
			});
			return;
		} else {
			if (lastName.length < 2) {
				dispatch({
					type: "VALIDATION_FAILURE",
					payload: "Last name must be at least 2 characters long.",
				});
				return;
			}
		}

		if (!email) {
			dispatch({
				type: "VALIDATION_FAILURE",
				payload: "Email is required.",
			});
			return;
		} else {
			const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
			if (!emailPattern.test(email)) {
				dispatch({
					type: "VALIDATION_FAILURE",
					payload: "Invalid email address.",
				});
				return;
			}
		}

		if (!password) {
			dispatch({
				type: "VALIDATION_FAILURE",
				payload: "Password is required.",
			});
			return;
		} else {
			if (password.length < 8) {
				dispatch({
					type: "VALIDATION_FAILURE",
					payload: "Password must be at least 8 characters long.",
				});
				return;
			}
		}

		if (!confirmPassword) {
			dispatch({
				type: "VALIDATION_FAILURE",
				payload: "Please confirm your password.",
			});
			return;
		} else {
			if (confirmPassword !== password) {
				dispatch({
					type: "VALIDATION_FAILURE",
					payload: "Passwords do not match.",
				});
				return;
			}
		}

		if (!agreeTerms) {
			dispatch({ type: "TERMS_AGREEMENT_FAILURE" });
			return;
		}

		dispatch({ type: "SIGNUP_REQUEST" });

		const payload = {
			first_name: firstName,
			last_name: lastName,
			email: email,
			password: password,
		};

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/accounts/user/register`,
				payload,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.status === 201) {
				toast.success("Account created successfully! Log in to get started.");
				dispatch({ type: "SIGNUP_SUCCESS" });
				navigate("/login");
			} else {
				dispatch({
					type: "SIGNUP_FAILURE",
				});
			}
		} catch (error) {
			if (error.response) {
				const errorMessage = error.response.data.message;
				toast.error(errorMessage);
				dispatch({
					type: "SIGNUP_FAILURE",
				});
			} else if (error.request) {
				toast.error(
					"No response received from the server. Please try again."
				);
				dispatch({
					type: "SIGNUP_FAILURE",
				});
			} else {
				toast.error(error.message);
				dispatch({
					type: "SIGNUP_FAILURE",
				});
			}
		}
	}, [
		firstName,
		lastName,
		email,
		password,
		confirmPassword,
		agreeTerms,
		dispatch,
		navigate,
	]);

	// Use useRef to store the debounced function
	const debouncedHandleSubmit = useRef(_.debounce(handleSubmit, 300));

	// Update the debounced function when handleSubmit changes
	useEffect(() => {
		debouncedHandleSubmit.current = _.debounce(handleSubmit, 300);
		return () => {
			debouncedHandleSubmit.current.cancel();
		};
	}, [handleSubmit]);

	const handleLoginClick = () => {
		navigate("/login");
	};

	const handleTermsModalClose = () => {
		setTermsModalOpen(false);
	};

	const privacyPageIndex = 1;
	const tosPageIndex = 0;

	const handleTOSClick = () => {
		setTermsPage(tosPageIndex);
		setTermsModalOpen(true);
	};

	const handlePrivacyPolicyClick = () => {
		setTermsPage(privacyPageIndex);
		setTermsModalOpen(true);
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
					color: "white",
					fontSize: "0.9rem",
					forntWeight: 600,
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
						sx={{ fontWeight: "bold", mb: 2, mt: 1 }}
					>
						Sign Up
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={(e) => {
							e.preventDefault();
							debouncedHandleSubmit.current();
						}}
						sx={{ mt: 1 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									margin="normal"
									required
									fullWidth
									id="firstName"
									label="First Name"
									name="firstName"
									autoComplete="fname"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									autoFocus
									sx={{
										"& input:-webkit-autofill": {
											WebkitBoxShadow: `0 0 0 100px ${theme.palette.secondary.main} inset !important`, // Change the color as needed
											WebkitTextFillColor: `${theme.palette.text.primary} !important`, // Change the text color as needed
											caretColor: `${theme.palette.text.primary} !important`, // Change the caret color as needed
										},
										backgroundColor: theme.palette.secondary.main,
									}}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									margin="normal"
									required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="lname"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									sx={{
										"& input:-webkit-autofill": {
											WebkitBoxShadow: `0 0 0 100px ${theme.palette.secondary.main} inset !important`, // Change the color as needed
											WebkitTextFillColor: `${theme.palette.text.primary} !important`, // Change the text color as needed
											caretColor: `${theme.palette.text.primary} !important`, // Change the caret color as needed
										},
										backgroundColor: theme.palette.secondary.main,
									}}
								/>
							</Grid>
						</Grid>
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
							sx={{
								"& input:-webkit-autofill": {
									WebkitBoxShadow: `0 0 0 100px ${theme.palette.secondary.main} inset !important`, // Change the color as needed
									WebkitTextFillColor: `${theme.palette.text.primary} !important`, // Change the text color as needed
									caretColor: `${theme.palette.text.primary} !important`, // Change the caret color as needed
								},
								backgroundColor: theme.palette.secondary.main,
							}}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="new-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							sx={{
								"& input:-webkit-autofill": {
									WebkitBoxShadow: `0 0 0 100px ${theme.palette.secondary.main} inset !important`, // Change the color as needed
									WebkitTextFillColor: `${theme.palette.text.primary} !important`, // Change the text color as needed
									caretColor: `${theme.palette.text.primary} !important`, // Change the caret color as needed
								},
								backgroundColor: theme.palette.secondary.main,
							}}
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="confirmPassword"
							label="Confirm Password"
							type="password"
							id="confirmPassword"
							autoComplete="new-password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							sx={{
								"& input:-webkit-autofill": {
									WebkitBoxShadow: `0 0 0 100px ${theme.palette.secondary.main} inset !important`, // Change the color as needed
									WebkitTextFillColor: `${theme.palette.text.primary} !important`, // Change the text color as needed
									caretColor: `${theme.palette.text.primary} !important`, // Change the caret color as needed
								},
								backgroundColor: theme.palette.secondary.main,
							}}
						/>
						<FormControlLabel
							control={
								<Checkbox
									checked={agreeTerms}
									onChange={(e) => setAgreeTerms(e.target.checked)}
									color="primary"
								/>
							}
							label={
								<Typography
									variant="body2"
									sx={{
										cursor: "default",
									}}
								>
									By signing up I agree to the{" "}
									<Link
										onClick={handleTOSClick}
										href="#"
										sx={{
											color: theme.palette.text.primary,
											cursor: "pointer",
										}}
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										onClick={handlePrivacyPolicyClick}
										href="#"
										sx={{
											color: theme.palette.text.primary,
											cursor: "pointer",
										}}
									>
										Privacy Policy
									</Link>
								</Typography>
							}
							sx={{
								"& .MuiTypography-root": {
									fontSize: "0.9rem",
								},
							}}
						/>
						{/* if there is an error display it */}
						{state.error && (
							<Typography
								color={theme.palette.error.main}
								variant="body2"
								sx={{ mt: 2 }}
							>
								{state.error}
							</Typography>
						)}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 1, mb: 2 }}
						>
							Sign Up
						</Button>
						<Divider sx={{ my: 2, mt: 5 }} />
						<Typography variant="body2" align="left" sx={{ mt: 4 }}>
							Already have an account?{" "}
							<Link
								onClick={handleLoginClick}
								sx={{
									color: theme.palette.text.primary,
									cursor: "pointer",
								}}
							>
								Log In
							</Link>
						</Typography>
					</Box>
				</Box>
			</Grid>
			<LoadingBackdrop isOpen={state.loading} />

			<TermsModal
				open={termsModalOpen}
				handleClose={handleTermsModalClose}
				initialPage={termsPage}
			/>
		</Grid>
	);
}

export default SignUp;
