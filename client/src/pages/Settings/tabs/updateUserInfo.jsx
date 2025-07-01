import { useState, useEffect, useCallback } from 'react';
import { Box, Grid, TextField, Button, Backdrop, CircularProgress, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/system';
import axios from 'axios';
import { useAuth } from '../../../features/AuthManager';
import { toast } from 'react-toastify';
import { getItem, setItem } from '../../../utils/storage';
import _ from 'lodash';
import Input from '@mui/material/Input';
import { LoadingBackdrop } from "../../../components/Loader";

function UpdateUserInfo() {
    const { authState, dispatch } = useAuth();
    const [loading, setLoading] = useState(false);

    const theme = useTheme();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [passwordErrors, setPasswordErrors] = useState({});

    // Set initial values from authState
    useEffect(() => {
        if (authState.user) {
            setFirstName(authState.user.first_name || "");
            setLastName(authState.user.last_name || "");
            setEmail(authState.user.email || "");
        }
    }, [authState.user]);

    const validateFields = () => {
        const newErrors = {};
        if (!firstName || firstName.length < 2) {
            newErrors.firstName = "First name must be at least 2 characters long.";
        }
        if (!lastName || lastName.length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters long.";
        }
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!email || !emailPattern.test(email)) {
            newErrors.email = "Invalid email address.";
        }
        setFieldErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};
        if (!currentPassword || currentPassword.length < 8) {
            newErrors.currentPassword = "Please type in a valid password";
        }
        if (!newPassword || newPassword.length < 8) {
            newErrors.newPassword = "New password must be at least 8 characters long.";
        }
        if (newPassword !== confirmNewPassword) {
            newErrors.confirmNewPassword = "New passwords do not match.";
        }
        setPasswordErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateFields()) {
            return;
        }

        setLoading(true);

        const fields_payload = {
            first_name: firstName,
            last_name: lastName,
            email: email,
        };

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/accounts/user/${authState.user.user_id}`,
                fields_payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authState.token}`,
                    },
                }
            );
            if (response.status === 201) {
                const updatedUser = {
                    email: response.data.data.email,
                    first_name: response.data.data.first_name,
                    is_verified: response.data.data.is_verified,
                    last_name: response.data.data.last_name,
                    subscription_active: response.data.data.subscription_active,
                    user_id: response.data.data.user_id,
                };
                
                dispatch({ type: 'SET_USER', payload: updatedUser }); // Update user info in auth state
                if (getItem("authState")) {
                    const stored_authState = JSON.parse(getItem("authState"));
                    const new_authState = {
                        ...stored_authState,
                        user: updatedUser
                    }
                    setItem("authState", JSON.stringify(new_authState));
                }
                toast.success("User information updated successfully.");
            } else {
                toast.error("Failed to update user information.");
            }
        } catch (error) {
            if (error.response) {
                const { errors } = error.response.data;
                if (errors) {
                    toast.error(errors);
                } else {
                    toast.error(error.response.data.message);
                }
            } else if (error.request) {
                toast.error("No response received from the server. Please try again.");
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!validatePassword()) {
            return;
        }

        setLoading(true);

        const password_payload = {
            old_password: currentPassword,
            new_password: newPassword,
        };

        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/accounts/user/${authState.user.user_id}/update-password`,
                password_payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authState.token}`,
                    },
                }
            );
            if (response.status === 201) {
                toast.success("Password changed successfully.");
            } else {
                toast.error("Failed to change password.");
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else if (error.request) {
                toast.error("No response received from the server. Please try again.");
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const debouncedHandleSubmit = useCallback(_.debounce(handleSubmit, 300), [firstName, lastName, email]);
    const debouncedHandleChangePassword = useCallback(_.debounce(handleChangePassword, 300), [currentPassword, newPassword, confirmNewPassword]);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                General Information
            </Typography>
            <Box
                component="form"
                noValidate
                onSubmit={(e) => { e.preventDefault(); debouncedHandleSubmit(); }}
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
                            error={Boolean(fieldErrors.firstName)}
                            helperText={fieldErrors.firstName}
                            autoFocus
                            sx={{ backgroundColor: theme.palette.secondary.main }}
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
                            error={Boolean(fieldErrors.lastName)}
                            helperText={fieldErrors.lastName}
                            sx={{ backgroundColor: theme.palette.secondary.main }}
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
                    error={Boolean(fieldErrors.email)}
                    helperText={fieldErrors.email}
                    sx={{ backgroundColor: theme.palette.secondary.main }}
                />
                {fieldErrors.form && (
                    <Box sx={{ color: 'error.main', mb: 2 }}>
                        {fieldErrors.form}
                    </Box>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 1, mb: 2, fontWeight: 600, height: 42, width: 100 }}
                >
                    Save
                </Button>
            </Box>

            <Divider sx={{ my: 2, mt: 5, mb: 5 }} />

            <Typography variant="h6" gutterBottom>
                Change Password
            </Typography>
            <Box
                component="form"
                noValidate
                onSubmit={(e) => { e.preventDefault(); debouncedHandleChangePassword(); }}
                sx={{ mt: 1 }}
            >
                <Input
                    type="text"
                    name="email"
                    value={email}
                    autoComplete='email'
                    sx={{ display: 'none' }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="currentPassword"
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    error={Boolean(passwordErrors.currentPassword)}
                    helperText={passwordErrors.currentPassword}
                    autoComplete='current-password'
                    sx={{ 
                        backgroundColor: theme.palette.secondary.main,
                        "& input:-webkit-autofill": {
                            WebkitBoxShadow: `0 0 0 100px ${theme.palette.secondary.main} inset !important`, // Change the color as needed
                            WebkitTextFillColor: `${theme.palette.text.primary} !important`, // Change the text color as needed
                        },
                    }}
                    InputLabelProps={{
                        className: "inputLabel",
                        shrink: true,
                    }}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="newPassword"
                    label="New Password"
                    name="newPassword"
                    type="password"
                    autoComplete='new-password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={Boolean(passwordErrors.newPassword)}
                    helperText={passwordErrors.newPassword}
                    sx={{ backgroundColor: theme.palette.secondary.main }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="confirmNewPassword"
                    label="Confirm New Password"
                    name="confirmNewPassword"
                    type="password"
                    autoComplete='new-password'
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    error={Boolean(passwordErrors.confirmNewPassword)}
                    helperText={passwordErrors.confirmNewPassword}
                    sx={{ backgroundColor: theme.palette.secondary.main }}
                />
                {passwordErrors.form && (
                    <Box sx={{ color: 'error.main', mb: 2 }}>
                        {passwordErrors.form}
                    </Box>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 1, mb: 0, fontWeight: 600, height: 42, width: 100}}
                >
                    Change
                </Button>
            </Box>

            <LoadingBackdrop isOpen={loading} />
        </Box>
    );
}

export default UpdateUserInfo;
