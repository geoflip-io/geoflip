import { useState, useCallback, useRef, useEffect } from "react";
import { useAuth, login } from "../../features/AuthManager";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import ForgotPasswordDialog from "./Dialogs/ForgotPasswordDialog";
import { LoadingBackdrop } from "../../components/Loader";
import geoflipLogoLight from "/Geoflip_Logo_white.png";
import geoflipLogoDark from "/Geoflip_Logo_black.png";
import { toast } from "react-toastify";
import _ from "lodash";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const { authState, dispatch } = useAuth();
	const navigate = useNavigate();
	const theme = useTheme();
	const [loading, setLoading] = useState(false);
	const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
		useState(false);

	const geoflipLogo = geoflipLogoLight;
	const backgroundURL =
		theme.palette.mode === "light"
			? "url(/usgs-nF1FvXdJL7o-unsplash.jpg)"
			: "url(usgs-JiuVoQd-ZLk-unsplash.jpg)";

	const handleSubmit = useCallback(async () => {
		setLoading(true);
		const result = await login(dispatch, email, password, remember);
		if (result) {
			setLoading(false);
			if (result.message === "success") {
				navigate("/");
			} else {
				toast.error(result.message);
			}
		}
	}, [dispatch, email, password, remember, navigate]);

	// Use useRef to store the debounced function
	const debouncedHandleSubmit = useRef(_.debounce(handleSubmit, 300));

	// Update the debounced function when handleSubmit changes
	useEffect(() => {
		debouncedHandleSubmit.current = _.debounce(handleSubmit, 300);
		return () => {
			debouncedHandleSubmit.current.cancel();
		};
	}, [handleSubmit]);

	const handleSignUpClick = () => {
		navigate("/signup");
	};

	const handleForgotPasswordClick = () => {
		setForgotPasswordDialogOpen(true);
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
					backgroundPosition: "center"
				}}
			/>
			<img
				src={geoflipLogo}
				alt="Geoflip Logo"
				style={{
					position: "absolute",
					top: "32px",
					left: "42px",
					height: "30px",
				}}
			/>
			<Typography
				sx={{
					position: "absolute",
					bottom: "24px",
					left: "42px",
					height: "30px",
					color: "white",
					fontSize: "0.9rem",
					fontWeight: 400,
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
						Log In
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
									WebkitBoxShadow: `0 0 0 100px ${theme.palette.secondary.main} inset !important`,
									WebkitTextFillColor: `${theme.palette.text.primary} !important`,
									caretColor: `${theme.palette.text.primary} !important`,
								},
								backgroundColor: theme.palette.secondary.main,
							}}
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
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
									WebkitBoxShadow: `0 0 0 100px ${theme.palette.secondary.main} inset !important`,
									WebkitTextFillColor: `${theme.palette.text.primary} !important`,
								},
								backgroundColor: theme.palette.secondary.main,
							}}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Grid container>
							<Grid item xs>
								<FormControlLabel
									control={
										<Checkbox
											checked={remember}
											onChange={(e) =>
												setRemember(e.target.checked)
											}
											color="primary"
										/>
									}
									label="Remember me"
									sx={{
										"& .MuiTypography-root": {
											fontSize: "0.9rem",
										},
									}}
								/>
							</Grid>
							<Grid item sx={{ mt: 1 }}>
								<Link
									onClick={handleForgotPasswordClick}
									variant="body2"
									color={theme.palette.text.primary}
									sx={{ alignSelf: "center" }}
								>
									Forgot password?
								</Link>
							</Grid>
						</Grid>
						{/* if there is an error display it */}
						{authState.error && (
							<Typography
								color={theme.palette.error.main}
								variant="body2"
								sx={{ mt: 2 }}
							>
								{authState.error}
							</Typography>
						)}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 1, mb: 2 }}
						>
							Log In
						</Button>

						<Divider sx={{ my: 2, mt: 5 }} />
						<Typography variant="body2" align="left" sx={{ mt: 4 }}>
							No account yet?{" "}
							<Link
								onClick={handleSignUpClick}
								sx={{
									color: theme.palette.text.primary,
									cursor: "pointer",
								}}
							>
								Sign Up
							</Link>
						</Typography>
					</Box>
				</Box>
			</Grid>
			<ForgotPasswordDialog
				open={forgotPasswordDialogOpen}
				handleClose={() => setForgotPasswordDialogOpen(false)}
				setLoading={setLoading}
			/>
			<LoadingBackdrop isOpen={loading} />
		</Grid>
	);
}

export default Login;
