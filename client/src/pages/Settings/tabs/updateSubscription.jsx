import { useState } from 'react';
import { 
    Box,
    Button, 
    Typography,
    Paper,
    List,
    ListItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/system';
import axios from 'axios';
import { useAuth } from '../../../features/AuthManager';
import _, { set } from 'lodash';
import { toast } from 'react-toastify';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { setItem } from '../../../utils/storage';
import StarsIcon from '@mui/icons-material/Stars';
import { useNavigate } from "react-router-dom";
import { LoadingBackdrop } from "../../../components/Loader";

function ConfirmCancelDialog({ open, handleClose, handleCancelSubscription }) {
	const theme = useTheme();

	return (
		<Box
			sx={{
				mt: 230,
			}}
		>
			<Dialog
				open={open}
				onClose={handleClose}
                PaperProps={{
                    style: {
                      borderRadius: 12,
                    },
                }}
				sx={{
					mt: -40,
				}}
			>
				<DialogTitle
					fontWeight={600}
					sx={{
						backgroundColor: theme.palette.background.default, // Adjust background color
					}}
				>
					Confirm Unsubscribe
				</DialogTitle>
				<DialogContent
					sx={{
						backgroundColor: theme.palette.background.default, // Adjust background color
					}}
				>
					<DialogContentText>
						Are you sure you want cancel your subscription?
					</DialogContentText>
					<Typography
						variant="body1"
						sx={{ 
							mt: 1,
                            color: theme.palette.text.secondary
						}}
					>
						You will be downgraded to the free plan.
					</Typography>
				</DialogContent>
				<DialogActions
					sx={{
						backgroundColor: theme.palette.background.default, // Adjust background color
						pr: 2,
						pb: 2
					}}
				>
					<Button 
						onClick={handleClose}
						variant="outlined"
					>
						Close
					</Button>
					<Button 
						onClick={handleCancelSubscription}
						variant="outlined"
						color="error"
					>
						Cancel Subscription
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

function UpdateSubscription() {
    const { authState, dispatch } = useAuth();
    const [loading, setLoading] = useState(false);
    const [openConfirmCancelDialog, setOpenConfirmCancelDialog] = useState(false);
    const theme = useTheme();
	const navigate = useNavigate();

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

    const handleCancelSubscription = async (e) => {
        e.preventDefault();
        setLoading(true);
        setOpenConfirmCancelDialog(false);

        // request stripe URL
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/accounts/subscribe/cancel`,
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
                
                // update the user data in the auth state
                const new_authState = {
                    ...authState,
                    user: {
                        ...authState.user,
                        subscription_active: false
                    }
                }
                dispatch({ type: "SET_USER", payload: new_authState });
                setItem("authState", JSON.stringify(new_authState));
				toast.info("subscription cancelled, downgraded to the free plan");
			} else {
                setLoading(false);
				toast.error(`Failed to cancel subscription. ${response.data.message}`);
			}
		} catch (error) {
			if (error.response) {
                setLoading(false);
                toast.error(`Failed to cancel subscription. please try again later.`);
			} else if (error.request) {
                setLoading(false);
                toast.error("No response received from the server. Please try again.");
			} else {
                setLoading(false);
                toast.error(error.message);
			}
		}
    };

    const handleCancelClick = (e) => {
        e.preventDefault();
        setOpenConfirmCancelDialog(true);
    };

    const handleSubscribePro = async (e) => {
        e.preventDefault();
        navigate("/workspace");
    };

    return (
        <Box
            sx={{   
                height: 360,
            }}
        >
            {authState.isAuthenticated && (
                authState.user.subscription_active ? (
                    <Paper
                        elevation={1}
                        sx={{
                            padding: 4,
                            pt: 2,
                            borderRadius: 3,
                            boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.1)",
                            display: "flex",
                            flex: 1,
                            flexDirection: "column",
                            alignItems: "left",
                            minWidth: 320,
                            background: `linear-gradient(to bottom, #3690EB, #233241)`,
                            color: "#FFF",
                            maxWidth: 600,
                        }}
                    >
                        <Typography 
                            fontWeight={600}
                            sx={{ fontSize: '2.4rem' }} 
                            gutterBottom
                        >
                            Pro Plan
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
                                    <Typography flex="1" fontWeight={300} sx={{
                                        ml:1,
                                        fontWeight: 400
                                    }}>
                                        {feature}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>

                        <Button
                            onClick={handleCancelClick}
                            variant="outlined"
                            color='primary'
                            sx={{
                                marginTop: 2,
                                padding: 1,
                                borderRadius: 1,
                                width: "100%",
                                textAlign: "center",
                                cursor: "pointer",
                                fontWeight: 500,
                                fontSize: "1.0rem",
                                color: theme.palette.grey[400], // Text color
                                borderColor: theme.palette.grey[400]
                            }}
                        >
                            Cancel Subscription
                        </Button> 	
                    </Paper>
                ):(
                    <Paper
                        elevation={1}
                        sx={{
                            padding: 4,
                            pt: 2,
                            borderRadius: 3,
                            borderWidth: 2,
                            display: "flex",
                            flex: 1,
                            flexDirection: "column",
                            alignItems: "left",
                            minWidth: 320,
                            background: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.background.paper,
                            maxWidth: 600,
                        }}
                    >
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
                                <Typography 
                                    flex="1" 
                                    fontWeight={400} 
                                    sx={{ml:1}}>
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
                            // backgroundColor: theme.palette.secondary.main,
                            width: "100%",
                            textAlign: "center",
                            cursor: "pointer",
                            // color: theme.palette.text.secondary,
                            fontWeight: 500,
                            fontSize: "1.0rem",
                        }}
                    >
                        <StarsIcon
                            sx={{
                                mr: 1,
                            }}
                        />
                        Uprade to Pro
                    </Button> 	
                    </Paper>
                )
            )}
            <ConfirmCancelDialog 
                open={openConfirmCancelDialog}
                handleClose={() => setOpenConfirmCancelDialog(false)}
                handleCancelSubscription={handleCancelSubscription}
            />
            <LoadingBackdrop isOpen={loading} />
        </Box>
    );
}

export default UpdateSubscription;
