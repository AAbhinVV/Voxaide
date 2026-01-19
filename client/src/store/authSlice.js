import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isAuthenticated: false,
	userInfo: {},
	accessToken: null,
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action) => {
			state.isAuthenticated = true;
			state.userInfo = action.payload.userInfo;
			state.accessToken = action.payload.accessToken;
		},

		signup: (state, action) => {
			state.isAuthenticated = true;
			state.userInfo = action.payload.userInfo;
			state.accessToken = action.payload.accessToken;
		}
	},
});

export const { login } = authSlice.actions;
export default authSlice.reducer;
