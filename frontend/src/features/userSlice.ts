import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { 
    UserData, 
    UserInfo, 
    AuthState, 
    LoginData,
    UserProfile,
    AuthResponse
} from "../types/userTypes";

export const registerUser = createAsyncThunk<AuthResponse, UserData, { rejectValue: string }>(
  "user/create",
  async (userData, { rejectWithValue }) => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" }
      };

      const { data } = await axios.post<AuthResponse>("/api/v1/signup", userData, config);
      return data;
    } catch (err) {
      console.error(err);
      return rejectWithValue("Registration failed");
    }
  }
);

export const LoginUser = createAsyncThunk<UserInfo, LoginData, {rejectValue: string}>(
    "user/login",
    async (LoginData, { rejectWithValue }) => {
        try {
            const config = {
                headers: {"Content-Type": "application/json"}
            }

            const { data } = await axios.post<UserInfo>('/login', LoginData, config)
            return data
        } catch (err) {
            console.log('error while login...', err)
            return rejectWithValue("Login Failed")
        }
    }
)

export const LogoutUser = createAsyncThunk<UserInfo, void, {rejectValue: string}>(
    "user/logout",
    async (_, { rejectWithValue }) => {
        try {
            const config = {
                headers: {"Content-Type": "application/json"}
            }

            const { data } = await axios.post<UserInfo>('/logout', config)
            return data
        } catch (err) {
            console.log('error while login...', err)
            return rejectWithValue("Logout Failed")
        }
    }
)

export const ProfileSetUp = createAsyncThunk<UserInfo, UserProfile, { rejectValue: string }>(
    "user/create-profile",
    async (UserProfile, { rejectWithValue }) => {
        try {
            const config = {
                headers: {'Content-Type': 'application/json'}
            }

            const { data } = await axios.post<UserInfo>('/profile/create', UserProfile, config)
            return data
        } catch (error) {
            console.log("Profile Creation failed", error)
            return rejectWithValue('Error occured while creating Profile')
        }
    }
)

export const GetProfile = createAsyncThunk<UserInfo, void, { rejectValue: string }>(
    "user/get-profile",
    async (_, { rejectWithValue }) => {
        try {
            const config = {
                headers: {'Content-Type': 'application/json'}
            }

            const { data } = await axios.get<UserInfo>('/profile/get', config)
            return data
        } catch (error) {
            console.log("Failed to read profile", error)
            return rejectWithValue('Error occured while reading Profile')
        }
    }
)

const initialState: AuthState =  {
    success: false,
    error: null,
    isAuthenticated: false,
    message: '',
    userInfo: null,
    loading: false
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.isAuthenticated = true;
        state.userInfo = action.payload.userInfo ?? null;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
        state.success = false;
      });

      builder.addCase(LoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Login Successfully";
        state.error = null;
        state.userInfo = action.payload
        state.isAuthenticated = Boolean(action.payload)

        localStorage.setItem('user', JSON.stringify(state.userInfo))
        localStorage.setItem('isAuthenticated', JSON.stringify(Boolean(state.userInfo)))  
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = "Error Occured while login";
        state.success = false;
        state.userInfo = null;
        state.isAuthenticated = false;
      })

      builder.addCase(LogoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LogoutUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.message = "Logout successfully";
        state.isAuthenticated = false;
        state.userInfo = null
        state.error = null

        localStorage.removeItem('user')
        localStorage.removeItem('isAuthenticated')
      })

      builder.addCase(ProfileSetUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ProfileSetUp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = "Profile completed Successfully";
        state.userInfo = action.payload
        state.isAuthenticated = Boolean(action.payload)
      })
      .addCase(ProfileSetUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.message = "Failed to create Profile"
      })

      builder.addCase(GetProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetProfile.fulfilled, (state, action) => {
         state.loading = false;
         state.error = null;
         state.success = true;
         state.userInfo = action.payload;
      })
      .addCase(GetProfile.rejected, (state) => {
        state.loading = true;
        state.error = "error occured while Loading profile";
      })
  }
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;