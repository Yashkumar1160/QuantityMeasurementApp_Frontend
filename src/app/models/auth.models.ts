// Matches backend LoginRequest.cs
export interface LoginRequest {
  email: string;
  password: string;
}

// Matches backend RegisterRequest.cs
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Matches backend AuthResponse.cs 
export interface AuthResponse {
  token:     string;
  tokenType: string;
  expiresIn: number;
  userId:    number;    
  email:     string;
  name:      string;
  issuedAt:  string;
  role:      string;   
}