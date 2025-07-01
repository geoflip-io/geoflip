import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { MuiOtpInput } from 'mui-one-time-password-input'
import Button from '@mui/material/Button';
import { useAuth, verify } from '../../features/AuthManager';
import { useTheme } from '@mui/material/styles';
import { LoadingBackdrop } from "../../components/Loader";
import { toast } from "react-toastify";
import axios from 'axios';

function Verification() {
    const [otp, setOtp] = useState('');
    const { authState, dispatch } = useAuth()
    const theme = useTheme();
    const [loading, setLoading] = useState(false);

    const handleChange = (value) => {
        setOtp(value);
    };

    const handleConfirmVerification = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await verify(dispatch, otp, authState.token);
        if (result.message === "success") {
            setLoading(false);
            toast.success("Email successfully verified");
        } else {
            setLoading(false);
            toast.error(result.message);
        }
    };

    const handleResendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/accounts/user/resend-verification`,
                null,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${authState.token}`,
                    },
                }
            );
            if (response.status === 200) {
                setLoading(false);
                toast.success("A new verification code has been sent to your email.");
            } else {
                setLoading(false);
                toast.error(`Failed to resend verification code. ${response.data.message}`);
            }
        } catch (error) {
            if (error.response) {
                setLoading(false);
                const data = error.response.data.errors.json;
                const first_error_key = Object.keys(data)[0];
                const first_error_message = data[first_error_key][0];
                toast.error(`${first_error_key} - ${first_error_message}`);
            } else if (error.request) {
                setLoading(false);
                toast.error("No response received from the server. Please try again.");
            } else {
                setLoading(false);
                toast.error(error.message);
            }
        }
    };

    return (
        <Box sx={{
            mt: 2,
        }}>
            <Typography
                component="p"
                variant="h5"
                align="left"
                sx={{
                    fontWeight: 600,
                    mb: 0,
                }}
            >
                Email Verification
            </Typography>
            <Typography
                component="p"
                variant="body1"
                align="left"
                sx={{
                    mb: 4,
                    mt: 0,
                    fontSize: '1.1rem',
                    color: theme.palette.text.secondary,
                    ml: -0.2,
                }}
            >
                Verify your account to access api keys
            </Typography>
            <Box sx={{ display: 'flex', flex: 1 }}>
                <Paper
                    elevation={1}
                    sx={{
                        padding: 4,
                        mr: 5,
                        borderRadius: 3,
                        boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            component="h3"
                            variant="h4"
                            align="left"
                            sx={{ fontWeight: 600, mb: 0.5, mt: 1 }}
                        >
                            Confirm Account
                        </Typography>
                        <Typography
                            component="p"
                            variant="body1"
                            align="left"
                            sx={{
                                mt: 0,
                                fontSize: '1.1rem',
                            }}
                        >
                            Please enter the 6-digit code sent to your email:
                        </Typography>
                        {authState.isAuthenticated && (
                            <Typography
                                sx={{
                                    mb: 4,
                                    mt: 1,
                                    fontSize: '1.1rem',
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {authState.user.email}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                            <MuiOtpInput
                                value={otp}
                                onChange={handleChange}
                                length={6}
                                display="flex"
                                gap={2}
                                width={400}
                                height={50}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                            <Button
                                onClick={handleConfirmVerification}
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: 'none' }}
                            >
                                Confirm
                            </Button>
                            <Button
                                onClick={handleResendCode}
                                variant="text"
                                sx={{ textTransform: 'none' }}
                            >
                                Resend code
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <LoadingBackdrop isOpen={loading} />
        </Box>
    );
}

export default Verification;
