import { createContext, useReducer, useContext, useEffect, useState } from "react";
import { authReducer, initialState } from "./reducers/authReducer";
import axios from "axios";
import { setItem, getItem } from "../../utils/storage";

const AuthContext = createContext();

const login = async (dispatch, email, password, storage = true) => {
	dispatch({ type: "LOGIN_REQUEST" });
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/accounts/user/login`,
			{
				email: email,
				password: password,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const data = response.data;
		if (response.status === 200) {
			dispatch({ type: "LOGIN_SUCCESS", payload: data });
			if (storage) {
				setItem("authState", JSON.stringify({
					isAuthenticated: true,
					user: data.user,
					token: data.access_token,
					expiry: data.expiry
				}));
			}
			return { status: 200, message: "success" };
		} else {
			dispatch({ type: "LOGIN_FAILURE" });
			return { status: response.status, message: data.message };
		}
	} catch (error) {
		if (error.response) {
			dispatch({
				type: "LOGIN_FAILURE",
			});
			return { status: error.response.status, message: `${error.response.data.message}` };
		} else if (error.request) {
			dispatch({
				type: "LOGIN_FAILURE",
			});
			return { status: error.response.status, message: "Network error, please try again later" };
		} else {
			dispatch({
				type: "LOGIN_FAILURE",
			});
			return { status: error.response.status, message: "An unexpected error occured while logging in, please try again later" };
		}
	}
};

const refreshToken = async (dispatch, token) => {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/accounts/user/refresh-token`,
			null,
			{
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			}
		);
		const data = response.data;
		if (response.status === 200) {
			dispatch({ type: "LOGIN_SUCCESS", payload: data });
			setItem("authState", JSON.stringify({
				isAuthenticated: true,
				user: data.user,
				token: data.access_token,
				expiry: data.expiry
			}));
			return { status: 200, message: "success" };
		} else {
			dispatch({ type: "LOGIN_FAILURE" });
			return { status: response.status, message: data.message };
		}
	} catch (error) {
		if (error.response) {
			dispatch({
				type: "LOGIN_FAILURE",
			});
			return { status: error.response.status, message: `${error.response.data.message}` };
		} else if (error.request) {
			dispatch({
				type: "LOGIN_FAILURE",
			});
			return { status: error.response.status, message: "Network error, please try again later" };
		} else {
			dispatch({
				type: "LOGIN_FAILURE",
			});
			return { status: error.response.status, message: "An unexpected error occured while logging in, please try again later" };
		}
	}
};

const logout = async (dispatch, token) => {
	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/accounts/user/logout`,
			null,
			{
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			}
		);
		const data = response.data;
		if (response.status === 200) {
			dispatch({ type: "LOGOUT" });
			return { status: response.status, message: "success" };
		}
	} catch (error) {
		if (error.response) {
			if (error.response.status === 401) {
				dispatch({ type: "LOGOUT" });
				return { status: error.response.status, message: "Unauthorized access, please login again" };
			}
			return { status: error.response.status, message: `${error.response.data.message}` };
		} else if (error.request) {
			return { status: error.response.status, message: "Network error, please try again later" };
		} else {
			return { status: error.response.status, message: "An unexpected error occured while verifying, please try again later" };
		}
	}
};

const verify = async (dispatch, code, token) => {
	dispatch({ type: "VERIFY_REQUEST" });

	try {
		const response = await axios.post(
			`${import.meta.env.VITE_API_URL}/accounts/user/verify`,
			{
				code: code
			},
			{
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			}
		);
		const data = response.data;
		if (response.status === 201) {
			dispatch({ type: "VERIFY_SUCCESS", payload: data });
			let storedAuthState = getItem("authState");

			if (storedAuthState) {
				storedAuthState = JSON.parse(storedAuthState);
				storedAuthState.user = data.data;
				setItem("authState", JSON.stringify(storedAuthState));
			}
			return { status: response.status, message: "success" };
		} else {
			dispatch({ type: "VERIFY_FAILURE", payload: data });
			return { status: response.status, message: data.message };
		}
	} catch (error) {
		if (error.response) {
			dispatch({
				type: "VERIFY_FAILURE",
				payload: `${error.response.data.message}`,
			});
			return { status: error.response.status, message: `${error.response.data.message}` };
		} else if (error.request) {
			dispatch({
				type: "VERIFY_FAILURE",
				payload: "Network error, please try again later",
			});
			return { status: error.response.status, message: "Network error, please try again later" };
		} else {
			dispatch({
				type: "VERIFY_FAILURE",
				payload: "An unexpected error occured while verifying, please try again later",
			});
			return { status: error.response.status, message: "An unexpected error occured while verifying, please try again later" };
		}
	}
};

const AuthProvider = ({ children }) => {
	const [authState, dispatch] = useReducer(authReducer, initialState);
	const [isInitializing, setIsInitializing] = useState(false);

	return (
		<AuthContext.Provider value={{ authState, dispatch, isInitializing }}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within a AuthProvider");
	}
	return context;
};

export { AuthProvider, useAuth, login, refreshToken, logout, verify };
