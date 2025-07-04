import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Typography, Box, Tabs, Tab, Paper, Divider } from "@mui/material";
import Socials from "../../components/Socials";
import TabTwo from "./tabs/tabTwo";
import TabOne from "./tabs/tabOne";

function Exports() {
    const theme = useTheme();
    const [tabIndex, setTabIndex] = useState(0);
    
    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <Box sx={{ mt: 2, overflow: 'auto', height: '100vh'}}> 
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
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
                        Exports
                    </Typography>
                    <Typography
                        component="p"
                        variant="body1"
                        align="left"
                        sx={{ 
                            mb: 4, mt: 0, fontSize: '1.1rem', color: theme.palette.text.secondary
                        }}
                    >
                        Keep track of your data export jobs here
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
                    <Socials />
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
                    <Tab label="Tab One" sx={{ textTransform: 'none', color: theme.palette.text.primary  }} />
                    <Tab label="Tab Two" sx={{ textTransform: 'none', color: theme.palette.text.primary  }} />
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
                    <Box>
                        {tabIndex === 0 && <TabOne />}
                        {tabIndex === 1 && <TabTwo />}
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}

export default Exports;
