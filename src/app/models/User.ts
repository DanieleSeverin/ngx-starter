export interface User{
    id: string;
    name: string;
    email: string;
}
  
export interface AuthRequest{ 
    email : string, 
    password : string 
}

export interface AuthResponse{
    user: User,
    accessToken: string,
    refreshToken: string,
}

export interface RefreshRequest{
    refreshToken: string
}

export interface RefreshResponse{
    accessToken: string
}