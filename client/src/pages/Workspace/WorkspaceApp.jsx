import { useState, useEffect, useContext } from 'react';
import { WorkspaceContext } from "./index";
import { useAuth, refreshToken } from "../../features/AuthManager";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Transform from './tabs/Transform';
import Append from './tabs/Append';
import Merge from './tabs/Merge';
import Exports from './tabs/Exports';
import Pipeline from './tabs/Pipeline';
import { Button, Divider, Tooltip } from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';

function WorkspaceApp({setFreePlan}) {
    const { apiCallsRemaining } = useContext(WorkspaceContext);
    const { authState, dispatch } = useAuth();
    const theme = useTheme();
    const [tabPage, setTabPage] = useState("transform");
    const pageMaxWidth = 1400;

    useEffect(() => {
		setTabPage("transform");
	}, [setTabPage]);

    const handleTabChange = (event, newPageValue) => {
		setTabPage(newPageValue);
        refreshToken(dispatch, authState.token);
	};

    const handleExportTabChange = () => {
        setTabPage("exports");
    }

    const renderContent = () => {
        switch (tabPage) {
            case "transform":
                return <Transform />;
			case "append":
				return <Append handleExportTabChange={handleExportTabChange} />;
			case "merge":
				return <Merge handleExportTabChange={handleExportTabChange} />;
            case "pipeline":
                return <Pipeline handleExportTabChange={handleExportTabChange} />;
            case "exports":
                return <Exports />;
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
                        Workspace
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
                        Upload/Draw, Transform and Export your data here
                    </Typography>
                </Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						mb: 4,
						mr: 2,
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
								setFreePlan(false);
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
                height: '100vh',
            }}>
                <Paper
					elevation={1}
					sx={{
						padding: 3,
						mr: 2,
						borderRadius: 3,
						boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
						display: "flex",
						flex: 1,
						flexDirection: "column",
						alignItems: "left",
                        paddingTop: 1,
                        paddingRight: 3,
                        height: '100%',
                        maxHeight: 'calc(100vh - 130px)',
                        overflow: 'auto',
                        scrollbarWidth: 'none'
					}}
				>
                    <Box
                        sx={{
                            display:"flex",
                            flexDirection: "row",
                        }}
                    >
                        <Tabs 
                            value={tabPage} 
                            onChange={handleTabChange}
                            sx={{
                                flex: 1,
                            }}
                            TabIndicatorProps={{
                                style: {
                                    height: 4,
                                    borderRadius: '4px 4px 0 0'
                                }
                            }}
                        >
                            <Tab 
                                label="Transform" 
                                value="transform" 
                                sx={{ textTransform: 'none', color: theme.palette.text.primary }} 
                            />
                            <Tab 
                                label="Append" 
                                value="append" 
                                sx={{ textTransform: 'none', color: theme.palette.text.primary }}
                            />
                            <Tab 
                                label="Merge" 
                                value="merge" 
                                sx={{ textTransform: 'none', color: theme.palette.text.primary }} 
                            />
                            <Tab 
                                label="Pipeline" 
                                value="pipeline" 
                                sx={{ textTransform: 'none', color: theme.palette.text.primary }} 
                            />
                            <Tab 
                                label="Exports" 
                                value="exports" 
                                sx={{ textTransform: 'none', color: theme.palette.text.primary }} 
                            />
                        </Tabs>
                        
                        <Box
                            sx={{
                                flex: 1,
                                textAlign: "right",
                                justifyItems: "right",
                                alignItems: "center",
                                mt: 2,
                            }}
                        >
                                <Box
                                    sx={{
                                        color: theme.palette.text.secondary,
                                        cursor: "default"
                                    }}
                                >
                                    <Tooltip
                                        title={
                                            authState.user.subscription_active ? (
                                                <span style={{ whiteSpace: 'pre-line' }}>
                                                    {"Pro Plan: Unlimited API calls"}
                                                </span>
                                            ) : (
                                                <span style={{ whiteSpace: 'pre-line' }}>
                                                    {"Free tier API calls remaining\n on your account."}
                                                </span>
                                            )
                                        }
                                        placement="top"
                                    >
                                        <Typography component="span"
                                            sx={{
                                                fontSize: '0.9rem',
                                                fontWeight: 400,
                                            }}
                                        >
                                            API Calls Remaining: {
                                                authState.user.subscription_active ? 
                                                    <Typography component="span" sx={{fontWeight: 800, color: theme.palette.primary.main, fontSize: '0.9rem'}}>
                                                        Unlimited
                                                    </Typography> : 
                                                    <Typography component="span" sx={{fontWeight: 800, color: theme.palette.primary.main, fontSize: '0.9rem'}}>
                                                        {apiCallsRemaining}
                                                    </Typography>
                                            }
                                        </Typography>
                                    </Tooltip>
                                </Box>
                        </Box>
                    </Box>
                    <Divider />

                    <Box
                        sx={{
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        {renderContent()}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}

export default WorkspaceApp;