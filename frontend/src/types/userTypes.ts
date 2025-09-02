export interface UserSignup {
    name: string,
    email: string,
    password: string,
    confirmPassowrd: string
}

export interface UserLogin {
    email: string;
    password: string
}

export interface AuthResponse {
    success: boolean
    message: string
    error: string | null 
    user: object | null
    isAuthenticated: boolean
    loading: false
}