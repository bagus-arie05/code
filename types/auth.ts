// types/auth.ts - Enhanced with better error handling and optional fields
export interface User {
  id: string
  email?: string
  name?: string
  preferred_username?: string
  given_name?: string
  family_name?: string
  roles?: string[]
  realm_access?: {
    roles: string[]
  }
  // Add any other Keycloak user properties you might need
}

export interface SessionResponse {
  success?: boolean // Add success indicator
  user: User | null
  accessToken?: string
  refreshToken?: string // Often useful to track
  expiresAt?: number
  error?: string // For error cases
}

export interface LoginResponse {
  success: boolean
  data?: {
    authUrl: string
  }
  error?: string // Add error message support
  message?: string
}

export interface LogoutResponse {
  success: boolean
  logoutUrl?: string // Make optional in case of errors
  error?: string
  message?: string
}

// Additional utility types for auth state
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Token information interface
export interface TokenInfo {
  accessToken: string
  refreshToken?: string
  idToken?: string
  expiresAt: number
  tokenType?: string
}

// Keycloak specific user info (if you need more detailed typing)
export interface KeycloakUserInfo extends User {
  sub: string
  email_verified?: boolean
  preferred_username?: string
  given_name?: string
  family_name?: string
  name?: string
}