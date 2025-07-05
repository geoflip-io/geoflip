
import { Button, Box, Tooltip } from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';
import GitHubIcon from '@mui/icons-material/GitHub';

function Socials() {
    const handleGitHubClick = () => {
        window.open('https://github.com/geoflip-io/geoflip', '_blank');
    }

	return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            <Box>
                <Tooltip
                    title={
                        <>
                            Geoflip is still under development 🛠️<br />
                            follow our progress here
                        </>
                    }
                >
                    <Button
                        variant="outlined"
                        onClick={handleGitHubClick}
                        sx={{
                            borderRadius: 5,
                            padding: "8px 8px",
                            pl: 1,
                            pr: 1.5,
                            fontWeight: 600,
                            mr: 1,
                            height: 40
                        }}
                    >
                        <GitHubIcon
                            sx={{
                                mr: 1,
                            }}
                        />
                        GitHub
                    </Button>
                </Tooltip>
            </Box>
            <Tooltip
                title={
                    <>
                    help us keep the server online ❤️<br />
                    (not quite implemented yet though)
                    </>
                }
            >
                <Box>
                    <Button
                        variant="contained"
                        disabled
                        sx={{
                            borderRadius: 5,
                            padding: "8px 8px",
                            pl: 1,
                            pr: 1.5,
                            fontWeight: 600,
                            height: 40
                        }}
                    >
                        <StarsIcon
                            sx={{
                                mr: 1,
                            }}
                        />
                        Donations
                    </Button>
                </Box>
            </Tooltip>
        </Box>
	);
}

export default Socials;