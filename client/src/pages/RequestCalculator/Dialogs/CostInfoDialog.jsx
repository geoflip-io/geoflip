import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function CostInfoDialog({ open, handleClose }) {
	const theme = useTheme();

	return (
		<Dialog
			open={open}
			onClose={handleClose}
            PaperProps={{
                style: {
                  borderRadius: 12,
                },
            }}
			sx={{
				mt: -20,
			}}
		>
			<DialogTitle
				fontWeight={600}
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				Tiered unit pricing (monthly)
			</DialogTitle>
			<DialogContent
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				<Typography
                    variant="body1"
                    sx={{  
                        mt: 0,
                        mb: 2
                    }}
                >
                GTU = Geoflip Transformation Unit <br/>
                </Typography>

				<DialogContentText>
					Unit pricing is based on the number of units consumed (GTU) in a month:<br />
				</DialogContentText>

				<Typography
                    variant="body1"
                    sx={{  
                        mt: 1,
                    }}
                >

                    {"< 500 GTU consumed = $0.07 per GTU"} <br/>
                    {"< 2500 GTU consumed = $0.05 per GTU"} <br/>
                    {"> 2500 GTU consumed = $0.03 per GTU"}
                </Typography>
			</DialogContent>
			<DialogActions
				sx={{
					backgroundColor: theme.palette.background.default, // Adjust background color
				}}
			>
				<Button onClick={handleClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CostInfoDialog;
