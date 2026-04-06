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

// Matches backend AuthResponse.cs — FIXED: added missing fields
export interface AuthResponse {
  token:     string;
  tokenType: string;
  expiresIn: number;
  userId:    number;    // ← was missing before
  email:     string;
  name:      string;
  issuedAt:  string;
  role:      string;    // ← new field
}