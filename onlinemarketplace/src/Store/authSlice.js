import { createSlice } from '@reduxjs/toolkit';
import { validateLogin } from './authSliceThunk';

const initialState = {
    isAuthenticated: false,
    isAdmin: false,
    username: '',
    userid: '',
    loading: false,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.isAdmin = false;
            state.username = '';
            state.userid = '';
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(validateLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(validateLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.username = action.payload.username;
                state.userid = action.payload._id;
                state.role = action.payload.user.role;
                if (action.payload.user.role === 'admin') {
                    state.isAdmin = true;
                } else {
                    state.isAdmin = false;
                }
                state.error = null;
            })
            .addCase(validateLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
    