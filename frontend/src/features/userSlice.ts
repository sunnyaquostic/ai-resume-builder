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

      const { data } = await axios.post<AuthResponse>(`/api/v1/signup`, userData, config);
      return data;
    } catch (err) {
      return rejectWithValue(`Registration Failed: ${JSON.stringify(err)}`);
    }
  }
);

export const LoginUser = createAsyncThunk<UserInfo, LoginData, {rejectValue: string}>(
  "user/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const config = { headers: {"Content-Type": "application/json"} };
      const { data } = await axios.post<UserInfo>('/api/v1/login', loginData, config);
      return data;
    } catch (err) {
      console.error("Error while login...", err);
      return rejectWithValue("Login failed");
    }
  }
);

export const LogoutUser = createAsyncThunk<UserInfo, void, {rejectValue: string}>(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const config = { headers: {"Content-Type": "application/json"} };
      const { data } = await axios.post<UserInfo>('/api/v1/logout', config);
      return data;
    } catch (err) {
      console.error("Error while logout...", err);
      return rejectWithValue("Logout failed");
    }
  }
);

export const ProfileSetUp = createAsyncThunk<UserInfo, UserProfile, { rejectValue: string }>(
  "user/create-profile",
  async (userProfile, { rejectWithValue }) => {
    try {
      const config = { headers: {'Content-Type': 'application/json'} };
      const { data } = await axios.post<UserInfo>('/api/v1/profile/create', userProfile, config);
      return data;
    } catch (error) {
      console.error("Profile creation failed", error);
      return rejectWithValue("Error occurred while creating profile");
    }
  }
);

export const GetProfile = createAsyncThunk<UserInfo, void, { rejectValue: string }>(
  "user/get-profile",
  async (_, { rejectWithValue }) => {
    try {
      const config = { headers: {'Content-Type': 'application/json'} };
      const { data } = await axios.get<UserInfo>('/api/v1/profile/get', config);
      return data;
    } catch (error) {
      console.error("Failed to read profile", error);
      return rejectWithValue("Error occurred while reading profile");
    }
  }
);

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

const initialState: AuthState & {
  registerStatus: RequestStatus;
  loginStatus: RequestStatus;
  logoutStatus: RequestStatus;
  profileStatus: RequestStatus;
} =  {
  success: false,
  error: null,
  isAuthenticated: false,
  message: "",
  userInfo: null,
  loading: false,

  registerStatus: "idle",
  loginStatus: "idle",
  logoutStatus: "idle",
  profileStatus: "idle",
};

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
      state.registerStatus = "loading";
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.registerStatus = "succeeded";
      state.loading = false;
      state.success = true;
      state.isAuthenticated = true;
      state.userInfo = action.payload.userInfo ?? null;
      state.error = null;
      state.message = action.payload?.message ?? ""
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.registerStatus = "failed";
      state.loading = false;
      state.error = action.payload ?? "Something went wrong";
      state.success = false;
    });

    builder.addCase(LoginUser.pending, (state) => {
      state.loginStatus = "loading";
      state.loading = true;
      state.error = null;
    });
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      state.loginStatus = "succeeded";
      state.loading = false;
      state.success = true;
      state.message = "Login successfully";
      state.error = null;
      state.userInfo = action.payload;
      state.isAuthenticated = Boolean(action.payload);

      localStorage.setItem("user", JSON.stringify(state.userInfo));
      localStorage.setItem("isAuthenticated", JSON.stringify(Boolean(state.userInfo)));  
    });
    builder.addCase(LoginUser.rejected, (state, action) => {
      state.loginStatus = "failed";
      state.loading = false;
      state.error = action.payload ?? "Error occurred while login";
      state.success = false;
      state.userInfo = null;
      state.isAuthenticated = false;
    });

    builder.addCase(LogoutUser.pending, (state) => {
      state.logoutStatus = "loading";
      state.loading = true;
      state.error = null;
    });
    builder.addCase(LogoutUser.fulfilled, (state) => {
      state.logoutStatus = "succeeded";
      state.loading = false;
      state.success = true;
      state.message = "Logout successfully";
      state.isAuthenticated = false;
      state.userInfo = null;
      state.error = null;

      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    });
    builder.addCase(LogoutUser.rejected, (state, action) => {
      state.logoutStatus = "failed";
      state.loading = false;
      state.error = action.payload ?? "Logout failed";
    });

    builder.addCase(ProfileSetUp.pending, (state) => {
      state.profileStatus = "loading";
      state.loading = true;
      state.error = null;
    });
    builder.addCase(ProfileSetUp.fulfilled, (state, action) => {
      state.profileStatus = "succeeded";
      state.loading = false;
      state.error = null;
      state.message = "Profile completed successfully";
      state.userInfo = action.payload;
      state.isAuthenticated = Boolean(action.payload);
    });
    builder.addCase(ProfileSetUp.rejected, (state, action) => {
      state.profileStatus = "failed";
      state.loading = false;
      state.error = action.payload ?? "Failed to create profile";
      state.isAuthenticated = false;
      state.message = "Failed to create profile";
    });

    builder.addCase(GetProfile.pending, (state) => {
      state.profileStatus = "loading";
      state.loading = true;
      state.error = null;
    });
    builder.addCase(GetProfile.fulfilled, (state, action) => {
      state.profileStatus = "succeeded";
      state.loading = false;
      state.error = null;
      state.success = true;
      state.userInfo = action.payload;
    });
    builder.addCase(GetProfile.rejected, (state, action) => {
      state.profileStatus = "failed";
      state.loading = false;
      state.error = action.payload ?? "Error occurred while loading profile";
    });
  }
});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
