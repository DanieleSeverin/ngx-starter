export interface User{
    id: number;
    name: string;
    email: string;
}
  
export interface AuthRequest{ 
    Email : string, 
    Password : string 
}

export interface AuthResponse{
    User: User,
    AccessToken: string,
    RefreshToken: string,
}

export interface RefreshRequest{
    RefreshToken: string
}

export interface RefreshResponse{
    AccessToken: string
}