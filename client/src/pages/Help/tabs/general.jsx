import { useAuth } from "../../../features/AuthManager";
import { useTheme } from "@mui/material/styles";
import { Box, Typography, TextField, Button, Link, Grid } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { LoadingBackdrop } from "../../../components/Loader";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function HelpGeneral() {
	const theme = useTheme();
	const { authState, dispatch } = useAuth();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const mounted = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!mounted.current && authState) {
            setFirstName(authState.user.first_name);
            setLastName(authState.user.last_name);
            setEmail(authState.user.email);

            mounted.current = true;
        }
    }, [authState]);

    const convertLineBreaks = (text) => {
        return text.replace(/\n/g, '<br/>');
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!validateEmail(email)) {
            setEmailError(true);
            toast.error(`Please enter a valid email address: ${email}`);
            return;
        }

        if (firstName === "") {
            setFirstNameError(true);
            toast.error("Please enter your first name");
            return;
        }

        if (lastName === "") {
            setLastNameError(true);
            toast.error("Please enter your last name");
            return;
        }

        const payload = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            message: convertLineBreaks(message),
        };

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/accounts/help`,
				payload,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (response.status === 200) {
				toast.success("Support request has been sent, we'll get back to you soon.")
                setMessage("");
                setLoading(false);
			}
		} catch (error) {
			if (error.response) {
				const errorMessage = error.response.data.message;
				toast.error(errorMessage)
                setLoading(false);

                if (error.response.status === 401) {
                    dispatch({ type: "LOGOUT" });
                    navigate("/login");
                }

			} else if (error.request) {
				toast.error('No response received from the server. Please try again.')
                setLoading(false);
			} else {
				toast.error(error.message)
                setLoading(false);
			}
		}
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Typography
                        variant="h6"
                        align="left"
                        sx={{ 
                            fontWeight: 600, 
                            mb: 0,
                            mt: 0,
                            padding: 0,
                            verticalAlign: "top",
                        }}
                    >
                        Get in touch with us
                    </Typography>
                    <Typography
                        variant="body1"
                        align="left"
                        sx={{ 
                            mb: 4, 
                            color: theme.palette.text.secondary,
                            fontWeight: 400
                        }}
                    >
                        Send us a message using the form or email us at <Link href="mailto:support@geoflip.io">support@geoflip.io</Link>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={8}>
                    <form>
                        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                            <TextField
                                label="First Name"
                                variant="outlined"
                                sx={{ backgroundColor: theme.palette.secondary.main }}
                                value={firstName}
                                error={firstNameError}
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                    if (firstNameError) {
                                        setFirstNameError(false);
                                    }
                                }}
                                InputLabelProps={{
                                    className: "inputLabel",
                                    shrink: true,
                                }}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                value={lastName}
                                error={lastNameError}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                    if (lastNameError) {
                                        setLastNameError(false);
                                    }
                                }}
                                sx={{ backgroundColor: theme.palette.secondary.main }}
                                InputLabelProps={{
                                    className: "inputLabel",
                                    shrink: true,
                                }}
                                fullWidth
                                required
                            />
                        </Box>
                        <TextField
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) {
                                    setEmailError(false);
                                }
                            }}
                            error={emailError}
                            InputLabelProps={{
                                className: "inputLabel",
                                shrink: true,
                            }}
                            fullWidth
                            sx={{ 
                                mb: 2,
                                backgroundColor: theme.palette.secondary.main
                            }}
                            required
                        />
                        <TextField
                            label="Message"
                            variant="outlined"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            sx={{ 
                                mb: 2,
                                backgroundColor: theme.palette.secondary.main
                             }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ 
                                textTransform: 'none',
                                backgroundColor: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                                fontWeight: 600
                            }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </form>
                </Grid>
            </Grid>
            <LoadingBackdrop isOpen={loading} />
        </Box> 
    );
}

export default HelpGeneral;
