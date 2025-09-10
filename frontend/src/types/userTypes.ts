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
  id: string
  // add more fields if your backend returns them
}

export interface AuthResponse {
  success: boolean
  message: string
  error?: string | Record<string, object> | null
  userInfo?: UserInfo | null
}

export interface AuthState extends AuthResponse {
  loading: boolean
  isAuthenticated: boolean
}

export interface LoginData {
    email: string
    password: string
}
