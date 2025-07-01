import { useState, useEffect } from "react";
import { useAuth } from "../../features/AuthManager";
import { useTheme } from "@mui/material/styles";
import { Typography, Box, Tabs, Tab, Paper, Divider } from "@mui/material";
import UpdateUserInfo from "./tabs/updateUserInfo";
import UpdateSubscription from "./tabs/updateSubscription";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import StarsIcon from "@mui/icons-material/Stars";

function Settings() {
    const theme = useTheme();
    const { authState } = useAuth();
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);
    const pageMaxWidth = 1400;
    
    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);

    };

    useEffect(() => {
        if (!authState.isAuthenticated) {
            navigate("/login");
        }
    }, [authState, navigate]);

    return (
        <Box sx={{ mt: 2, overflow: 'auto', height: '100vh', maxWidth: pageMaxWidth }}> 
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    maxWidth: pageMaxWidth,
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        component="p"
                        variant="h5"
                        align="left"
                        sx={{ fontWeight: 600, mb: 0 }}
                    >
                        Settings Page
                    </Typography>
                    <Typography
                        component="p"
                        variant="body1"
                        align="left"
                        sx={{ 
                            mb: 4, mt: 0, fontSize: '1.1rem', color: theme.palette.text.secondary
                        }}
                    >
                        Change your account settings here
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 4,
                        mr: 5,
                    }}
                >
                    {authState.isAuthenticated && authState.user.subscription_active ? (
						<Button
                            variant="outlined"
                            sx={{
                                borderRadius: 5,
                                padding: "8px 8px",
                                fontWeight: 400,
                                pointerEvents: "none", // Disable all pointer events
                                cursor: "default",
                                borderWidth: "2px",
                                '&:hover': {
                                    borderWidth: "2px",
                                },
                            }}
                        >
                            <StarsIcon
                                sx={{
                                    mr: 1,
                                }}
                            />
                            Pro Plan
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => {
                                navigate("/workspace")
                            }}
                            sx={{
                                borderRadius: 5,
                                padding: "8px 8px",
                                pl: 1,
                                pr: 1.5,
                                fontWeight: 600,
                            }}
                        >
                            <StarsIcon
                                sx={{
                                    mr: 1,
                                }}
                            />
                            Upgrade to Pro
                        </Button>
                    )}
                </Box>
            </Box>
            <Paper
                sx={{
                    padding: 4,
                    paddingTop: 1,
                    mr: 5,
                    borderRadius: 3,
                    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
                    // height: '100%', 
                    maxHeight: 'calc(100vh - 150px)',
                    overflowY: 'auto',
                    scrollbarWidth: 'none'
                }}
            >
                <Tabs
                    value={tabIndex}
                    onChange={handleTabChange}
                    aria-label="settings tabs"
                    TabIndicatorProps={{
                        style: {
                            height: 4,
                            borderRadius: '4px 4px 0 0'
                        }
                    }}
                >
                    <Tab label="Account settings" sx={{ textTransform: 'none', color: theme.palette.text.primary  }} />
                    <Tab label="Subscription" sx={{ textTransform: 'none', color: theme.palette.text.primary  }} />
                </Tabs>
                <Divider />
                <Box
                    sx={{
                        mb: 0,
                        mt: 4,
                        paddingRight: 3,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'flex-start',
                        width: '100%',
                        overflowY: 'auto',
                        paddingBottom: '20px',
                        scrollbarWidth: 'none'
                    }}
                >
                    <Box sx={{ flex: 1, pr: 3 }}>
                        <Typography
                            component="h6"
                            variant="h6"
                            align="left"
                            sx={{ fontWeight: 600, mb: 0 }}
                        >
                            {tabIndex === 0 && "Account Settings"}
                            {tabIndex === 1 && "Subscription"}
                        </Typography>
                        <Typography
                            component="p"
                            variant="body1"
                            align="left"
                            sx={{ mb: 2, fontSize: '1.0rem', color: theme.palette.text.secondary, 
                                fontWeight: 400
                            }}
                        >
                            {tabIndex === 0 && "Here you can change your account settings."}
                            {tabIndex === 1 && "Your current subscription plan"}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: 3 }}>
                        {tabIndex === 0 && <UpdateUserInfo />}
                        {tabIndex === 1 && <UpdateSubscription />}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}

export default Settings;
