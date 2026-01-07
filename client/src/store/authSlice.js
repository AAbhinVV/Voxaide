import { createSlice } from "@reduxjs/toolkit";

const insitialState = {
    isAuthenticated: false,
    userInfo: {},
    accessToken: null,
    error: null,
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.userInfo = action.payload.userInfo;
            state.accessToken = action.
        }
    }
})

export const {} = authSlice.actions;
export defautl authSlice.reducer;