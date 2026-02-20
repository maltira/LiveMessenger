
export interface AuthRequest {
  email: string
  password: string
}

export interface VerifyOTPRequest {
  user_id: string
  email?: string | null
  password?: string | null
  code: string
  action: "login" | "register" | "forgot-password" | "change-mail" | "change-pass" | "delete-account"
}

export interface ResetPasswordRequest {
  user_id: string
  new_password: string
}

export interface SessionResponse {
  id: string;
  refresh_token: string;
  device: string;
  ip: string;
  user_agent: string;

  created_at: Date;
  updated_at: Date;
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
  to_be_deleted_at: Date
  recovery_token: string
}