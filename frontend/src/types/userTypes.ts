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

// Backend profile response schema alignment
export interface UserInfo extends GeneralInfo {
  // backend returns docId and userId; keep both optional to support auth payloads
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

export interface AuthState extends AuthResponse {
  loading: boolean
  isAuthenticated: boolean
}

export interface LoginData {
    email: string
    password: string
}
