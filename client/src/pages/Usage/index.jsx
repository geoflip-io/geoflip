import { useAuth } from "../../features/AuthManager";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';
import { useNavigate } from 'react-router-dom';
import AnnualUsage from './DataDisplay/AnnualUsage';
import MonthlyUsage from './DataDisplay/MonthlyUsage';
import HistoricalUsage from './DataDisplay/HistoricalUsage';

function Usage() {
    const { authState } = useAuth();
    const theme = useTheme();
    const pageMaxWidth = 1400;
    const navigate = useNavigate();

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
                    maxWidth: {
                        xs: 600, // column for extra-small screens and up
                        sm: 600, // column for extra-small screens and up
                        md: pageMaxWidth,    // row for small screens and up
                    },
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
                        Usage Dashboard
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
                            ml: 0
                        }}
                    >
                        Your API usage statistics and history
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 4,
                        mr: {
                            xs: 0, // column for extra-small screens and up
                            sm: 0, // column for extra-small screens and up
                            md: 5,    // row for small screens and up
                        },
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
                flex: 1,
                flexDirection: "column",
                maxWidth: pageMaxWidth,
                minWidth: 300,
                maxHeight: 'calc(100vh - 150px)',
                overflow: 'auto',
                scrollbarWidth: 'none',
            }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: {
                            xs: "column", // column for extra-small screens and up
                            sm: "column", // column for extra-small screens and up
                            md: "row",    // row for small screens and up
                        },
                        flex: 1,
                        maxWidth: {
                            xs: 600, // column for extra-small screens and up
                            sm: 600, // column for extra-small screens and up
                            md: "100%",    // row for small screens and up
                        }, // Adjusted to use 100% of the parent container's width
                        mr: 5,
                    }}
                >
                    <Paper
                        sx={{
                            position: 'relative', // Ensure the Paper is relative
                            display: "flex",
                            padding: 0,
                            flex: 1,
                            borderRadius: 3,
                            boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                            mr: {
                                xs: 0, // no margin-right for extra-small screens
                                sm: 0,
                                md: 1, // margin-right for small screens and up
                            },
                            mb: {
                                xs: 1, // margin-bottom for extra-small screens
                                sm: 1, // margin-bottom for extra-small screens
                                md: 0, // no margin-bottom for small screens and up
                            },
                        }}
                    >
                        <MonthlyUsage />
                    </Paper>
                    <Paper
                        sx={{
                            position: 'relative', // Ensure the Paper is relative
                            display: "flex",
                            padding: 0,
                            flex: 1,
                            borderRadius: 3,
                            boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <AnnualUsage />
                    </Paper>
                </Box>
                <Paper
                    elevation={1}
                    sx={{
                        position: 'relative', // Ensure the Paper is relative
                        padding: 0,
                        mr: 5,
                        mt: 1,
                        borderRadius: 3,
                        boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                        flex: 3,
                        minHeight: 300,
                        maxHeight: 'calc(100vh - 150px)',
                        overflow: 'auto',
                        scrollbarWidth: 'none',
                        maxWidth: {
                            xs: 600, // column for extra-small screens and up
                            sm: 600, // column for extra-small screens and up
                            md: "100%",    // row for small screens and up
                        }
                    }}
                >
                    <HistoricalUsage />
                </Paper>
            </Box>
        </Box>
    );
}

export default Usage;
