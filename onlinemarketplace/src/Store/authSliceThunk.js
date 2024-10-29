import { creasteSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

export const validateLogin = createAsyncThunk(
    'auth/validateLogin', 
    async ({username, password}, { rejectWithValue }) => {
        //console.log('username', username, 'password', password)
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/findAll/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${process.env.REACT_APP_AUTH_TOKEN}`
                }
            });
            const data = response.data;
            console.log(data)
            if (data.status === 'success') {
                console.log(data.data)
                const user = data.data.find(user => user.user.username === username && user.user.password === password);
                if (user) {

                    return user;
                } else {
                    return rejectWithValue('Invalid username or password');
                }
            } else {
                return rejectWithValue('Failed to fetch users');
            }
        } catch (error) {
            console.error(error);
            return rejectWithValue('An error occurred during login');
        }
});