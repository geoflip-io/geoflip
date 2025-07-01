const initialState = {
	loading: false,
	error: null,
	success: false,
};

const signupReducer = (state, action) => {
	switch (action.type) {
		case "SIGNUP_REQUEST":
			return { ...state, loading: true, error: null };
		case "SIGNUP_SUCCESS":
			return { ...state, loading: false, success: true };
		case "SIGNUP_FAILURE":
			return { ...state, loading: false, error: action.payload };
        case "TERMS_AGREEMENT_FAILURE":
            return { ...state, loading: false, error: "You must agree to the terms of service and privacy policy." };
        case "VALIDATION_FAILURE":
            return { ...state, error: action.payload };		
        default:
			return state;
	}
};

export { initialState, signupReducer };
