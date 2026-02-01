
export interface AuthRequest {
  email: string
  password: string
}

export interface VerifyOTPRequest {
  user_id: string
  code: string
  action: "login" | "register" | "forgot-password"
}

export interface ResetPasswordRequest {
  user_id: string
  new_password: string
}

export interface BlockRequest {
  profile_id: string
  blocked_profile_id: string
}

export interface DeleteAccountRequest {
  password: string
}

export interface OTPSentResponse {
  user_id: string
  message: string
}

export interface RecoveryResponse {
  message: string
  recovery_token: string
}

export interface TempTokenResponse {
  user_id: string
  temp_token: string
}