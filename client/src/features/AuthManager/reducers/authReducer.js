import { removeItem } from "../../../utils/storage";

export const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    expiry: null,
};

export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_REQUEST":

            return {
                ...state,
            };
        case "LOGIN_SUCCESS":
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.access_token,
                expiry: action.payload.expiry
            };
        case "LOGIN_FAILURE":
            return {
                ...state,
            };
        case "LOGOUT":
            removeItem("authState");
            return initialState;
        case "SET_AUTH_STATE":
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                user: action.payload.user,
                token: action.payload.token,
                expiry: action.payload.expiry,
            };
        
        case "SET_USER":
            return {
                ...state,
                user: action.payload
            };
        case "VERIFY_REQUEST":
            return { ...state };
        case "VERIFY_SUCCESS":
            return {
                ...state,
                user: action.payload.data
            };
        case "VERIFY_FAILURE":
            return {
                ...state
            };
        default:
            return state;
    }
};
