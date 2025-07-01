import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { setItem } from "../../utils/storage";
import { useAuth } from "../../features/AuthManager";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { LoadingBackdrop } from "../../components/Loader";

function ServicePlan({ setFreePlan }) {
    const theme = useTheme();
    const { authState } = useAuth();
    const [loading, setLoading] = useState(false);

    const freePlanFeatures = [
        "1 API Key with 5 days expiry",
        "30 free api call limit",
        "Limited access to output formats",
        "Limited access to transformations",
        "1 second rate limit",
    ];

    const proPlanFeatures = [
        "Unlimited requests and API keys",
        "Full access to ALL output formats",
        "Full access to ALL transformations",
        "No rate limits",
        "Only pay for usage (7 cents per GTU)"
    ]

    const handleFreePlan = () => {
        setFreePlan(true);
    };

    const handleSubscribePro = async (e) => {
        e.preventDefault();
        setLoading(true);

        // store auth state into local storage
        setItem("authState", JSON.stringify({
            ...authState
        }));

        // request stripe URL
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/accounts/subscribe/create-checkout-session`,
                null,
				{
					headers: {
						"Content-Type": "application/json",
                        "Authorization": `Bearer ${authState.token}`,
					},
				}
			);
			if (response.status === 201) {
                setLoading(false);
				toast.info(response.data.message);
                window.location.href = response.data.session_url;
			}
		} catch (error) {
			if (error.response) {
                setLoading(false);
                toast.error(`Failed to create subscription url. please try again later.`);
			} else if (error.request) {
                setLoading(false);
                toast.error("No response received from the server. Please try again.");
			} else {
                setLoading(false);
                toast.error(error.message);
			}
		}
    };

	return (
		<Box
			sx={{
				mt: 2,
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
				Account Selection
			</Typography>
			<Typography
				component="p"
				variant="body1"
				align="left"
				sx={{
					mb: 4,
					mt: 0,
					fontSize: "1.1rem",
                    color: theme.palette.text.secondary,
                    ml: -0.2
				}}
			>
				Choose a plan to get started
			</Typography>
			<Box sx={{ 
                    display: "flex", 
                    flex: 1, 
                    flexDirection: { xs: 'column', sm: 'row' },
                }}
            >
				<Paper
					elevation={1}
					sx={{
						padding: 4,
						mr: 5,
                        mb: { xs: 3, sm: 0 },
						borderRadius: 3,
						boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
						display: "flex",
						flex: 1,
						flexDirection: "column",
						alignItems: "left",
						minWidth: 320,
					}}
				>
					<Typography 
                        fontWeight={500}
                        sx={{ fontSize: '1.4rem' }} 
                        gutterBottom
                    >
						Basic
					</Typography>
					<Typography 
                        fontWeight={600}
                        sx={{ fontSize: '2.4rem' }} 
                        gutterBottom
                    >
						Free
					</Typography>
					<List
						sx={{
							listStyle: "none",
							padding: 0,
							textAlign: "left",
                            ml: -2,
						}}
					>
                        {freePlanFeatures.map((feature, index) => (
                            <ListItem
                                key={`free_feature_${index}`}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    mt: 0,
                                    py: 0.5,
                                }}
                            >
                                <CheckCircleOutlinedIcon 
                                    flex="1" 
                                    fontSize="small" 
                                    sx={{ color: theme.palette.text.secondary }}
                                /> 
                                <Typography flex="1" sx={{
                                    ml:1,
                                    fontWeight: 400,
                                }}>
                                    {feature}
                                </Typography>
                            </ListItem>
                        ))}
					</List>

                    <Button	
                        onClick={handleFreePlan}    					
                        sx={{
                            marginTop: 2,
                            padding: 1,
                            borderRadius: 1,
                            backgroundColor: theme.palette.secondary.main,
                            width: "100%",
                            textAlign: "center",
                            cursor: "pointer",
                            color: theme.palette.text.secondary,
                            fontWeight: 500,
                            fontSize: "1.0rem",
                        }}
                    >
                        Continue with Basic
                    </Button> 	

				</Paper>
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
						minWidth: 320,
                        background: `linear-gradient(to bottom, #3690EB, #233241)`,
                        color: "#FFF"
					}}
				>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography 
                            fontWeight={500}
                            sx={{ fontSize: '1.4rem' }} 
                            flex={1}
                            gutterBottom
                        >
                            Pro
                        </Typography>
                        <Box
                            sx={{
                                backgroundColor: 'white',
                                color: 'black', // Change text color to black
                                borderRadius: '16px', // Rounded borders
                                padding: '4px 12px', // Adjust padding as needed
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Typography 
                            fontWeight={600}
                            sx={{ fontSize: '0.8rem' }} 
                            >
                                Most Popular
                            </Typography>
                        </Box>
                    </Box>

					<Typography 
                        fontWeight={600}
                        sx={{ fontSize: '2.4rem' }} 
                        gutterBottom
                    >
						Pay-as-you-go
					</Typography>
					<List
						sx={{
							listStyle: "none",
							padding: 0,
							textAlign: "left",
                            ml: -2,
						}}
					>
                        {proPlanFeatures.map((feature, index) => (
                            <ListItem
                                key={`pro_feature_${index}`}
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    mt: 0,
                                    py: 0.5,
                                }}
                            >
                                <CheckCircleIcon 
                                    flex="1" 
                                    fontSize="small" 
                                    sx={{ color: "#FFF" }}
                                /> 
                                <Typography flex="1" sx={{
                                    ml:1,
                                    fontWeight: 400,
                                }}>
                                    {feature}
                                </Typography>
                            </ListItem>
                        ))}
					</List>

                    <Button
                        onClick={handleSubscribePro}
                        variant="contained"				
                        sx={{
                            marginTop: 2,
                            padding: 1,
                            borderRadius: 1,
                            width: "100%",
                            textAlign: "center",
                            cursor: "pointer",
                            fontWeight: 500,
                            fontSize: "1.0rem",
                        }}
                    >
                        Subscribe to Pro
                    </Button> 	

				</Paper>
			</Box>
            <LoadingBackdrop isOpen={loading} />
		</Box>
	);
}

export default ServicePlan;
