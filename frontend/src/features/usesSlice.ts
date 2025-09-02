import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { AuthResponse } from "../types/userTypes";

export const registerUser = createAsyncThunk('user/create', async (userData, {rejectedWithValue: { error: string }}) => {
    try {
        const config = {
            header: {
                'Content-Type': 'application/json'
            }
        }

        const data = await axios.post('/api/v1/signup', userData, config)
        return data
    } catch (e) {
        console.log(e)
        return rejectedWithValue({error: 'Registration failed'})
    }
})


const initialState: AuthResponse =  {
    success: false,
    error: null,
    isAuthenticated: false,
    message: '',
    user: null,
    loading: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        removeErrors: (state) => state.error = null,
        removeSuccess: (state) => state.success = false
    },
    
    extraReducers: (builder) => {
        builder.addCase()
    }
})