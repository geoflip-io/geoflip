
import { Button } from '@mui/material';
import StarsIcon from '@mui/icons-material/Stars';

function Donations() {
	return (
		<Button
			variant="contained"
			disabled
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
			Donations
		</Button>
	);
}

export default Donations;