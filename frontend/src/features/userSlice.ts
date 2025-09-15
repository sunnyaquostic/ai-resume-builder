import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api";
import type { 
  UserData, 
  UserInfo, 
  AuthState, 
  LoginData,
  UserProfile,
  AuthResponse,
} from "../types/userTypes";

type RejectValue = string;


export const registerUser = createAsyncThunk<AuthResponse, UserData, { rejectValue: RejectValue }>(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post<AuthResponse>("/v1/signup", userData);
      return data;
    } catch (err) {
      console.error("Registration failed:", err);
      return rejectWithValue("Registration failed");
    }
  }
);

export const LoginUser = createAsyncThunk<AuthState, LoginData, { rejectValue: RejectValue }>(
  "user/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const { data } = await api.post<AuthState>("/v1/login", loginData);
      return data;
    } catch (err) {
      console.error("Login failed:", err);
      return rejectWithValue("Login failed");
    }
  }
);

export const LogoutUser = createAsyncThunk<void, void, { rejectValue: RejectValue }>(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/v1/logout", {});
    } catch (err) {
      console.error("Logout failed:", err);
      return rejectWithValue("Logout failed");
    }
  }
);

export const getProfile = createAsyncThunk<UserInfo, void, { rejectValue: RejectValue }>(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<{ user: UserInfo }>("/v1/me");
      return data.user;
    } catch (err) {
      console.error("Get profile failed:", err);
      return rejectWithValue("Failed to fetch profile");
    }
  }
);

export const profileSetUp = createAsyncThunk<UserInfo, UserProfile, { rejectValue: RejectValue }>(
  "user/profileSetUp",
  async (userProfile, { rejectWithValue }) => {
    try {
      const { data } = await api.post<UserInfo>("/v1/profile/create", userProfile);
      return data;
    } catch (err) {
      console.error("Profile setup failed:", err);
      return rejectWithValue("Failed to setup profile");
    }
  }
);


export const GetProfile = createAsyncThunk<UserInfo, void, { rejectValue: string }>(
  "user/get-profile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<UserInfo>("/v1/profile/get");
      return data;
    } catch (error) {
      console.error("Failed to read profile", error);
      return rejectWithValue("Error occurred while reading profile");
    }
  }
);

export const GetSession = createAsyncThunk<UserInfo, void, { rejectValue: string }>(
  "user/get-session",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get<UserInfo>("/v1/me");
      return data;
    } catch (error) {
      console.error("Failed to read session", error);
      return rejectWithValue("Error occurred while reading session");
    }
  }
);


const initialState: AuthState = {
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
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    /* REGISTER */
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerStatus = "succeeded";
        state.loading = false;
        state.success = true;
        state.isAuthenticated = true;
        state.userInfo = action.payload.userInfo ?? null;
        state.message = action.payload.message ?? "";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.loading = false;
        state.success = false;
        state.error = action.payload ?? "Registration failed";
      });

    /* LOGIN */
    builder
      .addCase(LoginUser.pending, (state) => {
        state.loginStatus = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginUser.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.userInfo = action.payload.userInfo ?? null;
        state.isAuthenticated = Boolean(action.payload.userInfo);
        state.error = action.payload.error ? String(action.payload.error) : null;
      })
      .addCase(LoginUser.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.loading = false;
        state.success = false;
        state.userInfo = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? "Login failed";
      });

    /* LOGOUT */
    builder
      .addCase(LogoutUser.pending, (state) => {
        state.logoutStatus = "loading";
        state.loading = true;
      })
      .addCase(LogoutUser.fulfilled, (state) => {
        state.logoutStatus = "succeeded";
        state.loading = false;
        state.success = true;
        state.isAuthenticated = false;
        state.userInfo = null;
        state.message = "Logout successful";
      })
      .addCase(LogoutUser.rejected, (state, action) => {
        state.logoutStatus = "failed";
        state.loading = false;
        state.isAuthenticated = false;
        state.userInfo = null;
        state.error = action.payload ?? "Logout failed";
      });

    /* PROFILE SETUP */
    builder
      .addCase(profileSetUp.pending, (state) => {
        state.profileStatus = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(profileSetUp.fulfilled, (state, action) => {
        state.profileStatus = "succeeded";
        state.loading = false;
        state.userInfo = action.payload;
        state.message = "Profile updated successfully";
      })
      .addCase(profileSetUp.rejected, (state, action) => {
        state.profileStatus = "failed";
        state.loading = false;
        state.error = action.payload ?? "Profile setup failed";
        state.message = "Profile setup failed";
      });

    /* GET PROFILE */
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.isAuthenticated = Boolean(action.payload);
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.userInfo = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? "Failed to fetch profile";
      });
  },

});

export const { removeErrors, removeSuccess } = userSlice.actions;
export default userSlice.reducer;
