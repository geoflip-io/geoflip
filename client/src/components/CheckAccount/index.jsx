import Verification from "../../components/Verification";
import { useAuth } from "../../features/AuthManager";
import { useEffect, useState } from "react";
import ServicePlan from "../../components/ServicePlan";
import { toast } from "react-toastify";
import axios from "axios";
import { getItem, setItem } from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import { LoadingBackdrop } from "../../components/Loader";

function CheckAccount({ children }) {
	const { authState, isInitializing, dispatch } = useAuth();
	const [freePlan, setFreePlan] = useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUserData = async () => {
			if (authState.isAuthenticated && authState.user.is_verified && !authState.user.subscription_active) {
				const user_id = authState.user.user_id;
				setLoading(true);
				try {
					const response = await axios.get(
						`${import.meta.env.VITE_API_URL}/accounts/user/${user_id}`,
						{
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${authState.token}`,
							},
						}
					);
					if (response.status === 200) {
						setLoading(false);
                        const fresh_user_data = response.data;
						delete fresh_user_data.apikeys;

                        // check if the user has an active subscription now
                        // if they have an active subscription in the database but not in the client it means they just
                        // activated their subscription so we update the user data in the client
                        if (fresh_user_data.subscription_active) {
                            // update the user data in the auth state
                            dispatch({ type: "SET_USER", payload: fresh_user_data });

                            // update the user data in local storage
                            if (getItem("authState")) {
                                const stored_authState = JSON.parse(getItem("authState"));
                                const new_authState = {
                                    ...stored_authState,
                                    user: fresh_user_data
                                }
                                setItem("authState", JSON.stringify(new_authState));
                            }

                            toast.info("Subscription successfully activated.");
                        }
					} else {
						setLoading(false);
						toast.error("Failed to fetch user data");
					}
				} catch (error) {
					setLoading(false);
					if (error.response) {
						if (error.response.status === 401) {
							dispatch({ type: "LOGOUT" });
							navigate("/login");
						}
						toast.error(
							"Failed to create subscription url. Please try again later."
						);
					} else if (error.request) {
						toast.error(
							"No response received from the server. Please try again."
						);
					} else {
						toast.error(error.message);
					}
				}
			}
		};

		fetchUserData();
	}, []);

	// if the user is not verified then show them the verification page
	// if the user is verified but has not subscribed to a pro plan then show them the service plan page
	// if the user is verified and has subscribed the pro plan then show them the apikeys page
	return (
		<>
			{authState.isAuthenticated &&
				(authState.user.is_verified ? (
					authState.user.subscription_active || freePlan ? (
						children({ setFreePlan })
					) : (
						<ServicePlan setFreePlan={setFreePlan} />
					)
				) : (
					<Verification />
				))}
			<LoadingBackdrop isOpen={loading} />
		</>
	);
}

export default CheckAccount;
