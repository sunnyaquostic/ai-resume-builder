export interface GeneralInfo {
  name: string;
  email: string;
}

export interface UserProfile extends GeneralInfo {
  role?: string; 
  bio?: string;
  phone?: string;            
  address?: string;
  linkedin?: string;        
  github?: string;
  success?: boolean;
  message?: string;
  error?: string 
}

export interface UserData extends GeneralInfo {
  password: string
  confirmPassword: string
}

export interface UserInfo extends GeneralInfo {
  docId?: string;
  userId?: string;
  role?: string;
  bio?: string | null;
  phone?: string | null;
  address?: string | null;
  linkedin?: string | null;
  github?: string | null;
  success?: boolean;
  message?: string;
  error?: string | null;
}

export interface AuthResponse {
  success: boolean
  message: string
  error?: string | Record<string, object> | null
  userInfo?: UserInfo | null
}

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface AuthState {
  success: boolean;
  error: string | null;
  isAuthenticated: boolean;
  message: string;
  userInfo: UserInfo | null;
  loading: boolean;

  registerStatus: RequestStatus;
  loginStatus: RequestStatus;
  logoutStatus: RequestStatus;
  profileStatus: RequestStatus;
}


export interface LoginData {
    email: string
    password: string
}
