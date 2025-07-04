import { useState, useEffect } from "react";
import { Modal, Box, Typography, Button, Tabs, Tab, Divider } from "@mui/material";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import { useTheme } from "@mui/material/styles";


const TermsModal = ({ open, handleClose, initialPage=0 }) => {
	const [pageIndex, setPageIndex] = useState(initialPage);
	const theme = useTheme();

	useEffect(() => {
		setPageIndex(initialPage);
	}, [initialPage]);

	const handleChange = (event, newValue) => {
		setPageIndex(newValue);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="terms-modal-title"
			aria-describedby="terms-modal-description"
		>
			<Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                minWidth: 400,
				maxWidth: "70vw",
				maxHeight: "90vh",
				overflowY: "auto", // Enables vertical scrolling
				overflowX: "hidden", // Prevents horizontal scrolling
                bgcolor: theme.palette.background.default,
				color: theme.palette.text.primary,
				borderRadius: 3,
                boxShadow: 10,
                p: 4,
				"&::-webkit-scrollbar": {
					display: "none"
				},
				"-ms-overflow-style": "none",
				"scrollbar-width": "none"
            }}>
				<Tabs 
                    value={pageIndex} 
                    onChange={handleChange}
                    TabIndicatorProps={{
                        style: {
                            height: 4,
                            borderRadius: '4px 4px 0 0'
                        }
                    }}
                >
					<Tab 
                        label="Terms of service" 
                        sx={{ textTransform: 'none', color: theme.palette.text.primary  }} 
                    />
					<Tab 
                        label="Privacy policy" 
                        sx={{ textTransform: 'none', color: theme.palette.text.primary  }} 
                    />
				</Tabs>
                <Divider />
				<Typography id="terms-modal-updated" sx={{
					textAlign: "center",
					mt: 4,
					color: theme.palette.text.secondary
				}}>
					Updated: June 13, 2024
				</Typography>
				<Typography id="terms-modal-title" variant="h3" component="h2" sx={{
					textAlign: "center",
					fontWeight: 600,
					mt: 1
				}}>
					{pageIndex === 0 ? "Terms of Service" : "Privacy Policy"}
				</Typography>
				<Typography id="terms-modal-description" sx={{ mt: 2 }}>
					{pageIndex === 0
						? <TermsOfService />
						: <PrivacyPolicy />}
				</Typography>
				<Box mt={2} textAlign="right">
					<Button onClick={handleClose}>Close</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default TermsModal;
