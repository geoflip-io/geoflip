import { useState, useEffect } from 'react';
import { useAuth } from "../../features/AuthManager";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { toast } from "react-toastify";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import HelpGeneral from './tabs/general';
import { Button, Divider } from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';
import { useNavigate } from 'react-router-dom';

function Help() {
    const { authState } = useAuth();
    const theme = useTheme();
    const [tabPage, setTabPage] = useState("general");
    const pageMaxWidth = 1400;
    const navigate = useNavigate();

    useEffect(() => {
		setTabPage("general");
	}, [setTabPage]);

    const handleTabChange = (event, newPageValue) => {
		setTabPage("general");
	};

    const renderContent = () => {
        switch (tabPage) {
            case "general":
                return <HelpGeneral />;
            default:
                return null
        }
    }

    return (
        <Box sx={{
            mt: 2,
            overflow: 'auto',
        }}>
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
                        sx={{ 
                            fontWeight: 600, 
                            mb: 0,
                        }}
                    >
                        Help/Support
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
                            ml: -0.2
                        }}
                    >
                        Having trouble with something? We're here to help
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
            <Box sx={{ 
                display: 'flex', 
                flex:1,
                flexDirection: "row",
                maxWidth: pageMaxWidth,
                minWidth: 300,
            }}>
                <Paper
					elevation={1}
					sx={{
						padding: 4,
						mr: 5,
						borderRadius: 3,
						boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
						display: "flex",
						flex: 1,
						flexDirection: "column",
						alignItems: "left",
                        paddingTop: 1,
                        height: '100%',
                        maxHeight: 'calc(100vh - 150px)',
                        overflow: 'auto',
                        scrollbarWidth: 'none'
					}}
				>
                    <Tabs value={tabPage} onChange={handleTabChange}
                        TabIndicatorProps={{
                            style: {
                                height: 4,
                                borderRadius: '4px 4px 0 0'
                            }
                        }}
                    >
                        <Tab 
                            label="General contact form" 
                            value="general" 
                            sx={{ textTransform: 'none', color: theme.palette.text.primary  }} 
                        />
                        <Tab 
                            label="Support request form" 
                            value="support" 
                            sx={{ textTransform: 'none', color: theme.palette.text.primary  }}
                            onClick={() => toast.info("the support ticket system is coming soon.")}
                        />
                        <Tab 
                            label="Existing support requests" 
                            value="requests" 
                            sx={{ textTransform: 'none', color: theme.palette.text.primary  }} 
                            onClick={() => toast.info("the support ticket system is coming soon.")}
                        />
				    </Tabs>
                    <Divider />
                    <Box>
                        {renderContent()}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default Help;