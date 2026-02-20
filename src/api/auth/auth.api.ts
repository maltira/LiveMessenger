import type {
  AuthRequest,
  OTPSentResponse,
  RecoveryResponse,
  ResetPasswordRequest,
  SessionResponse,
  VerifyOTPRequest,
} from '@/types/auth/auth.dto.ts'
import type { ErrorResponse } from '@/types/error.dto.ts'
import type { User } from '@/types/auth/auth.model.ts'
import { apiFetch } from '@/api/fetch.ts'

class AuthService {
  private baseUrl = import.meta.env.VITE_API_URL
  // ? Вход в аккаунт
  async Login(req: AuthRequest): Promise<OTPSentResponse | ErrorResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(req),
    })
    return response.json()
  }

  // ? Регистрация аккаунта
  async Register(req: AuthRequest): Promise<OTPSentResponse | ErrorResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(req),
    })
    return response.json()
  }

  // ? Верификация OTP
  async VerifyOTP(req: VerifyOTPRequest): Promise<boolean | RecoveryResponse | ErrorResponse> {
    const response = await fetch(`${this.baseUrl}/auth/verify`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(req),
    })
    return response.json()
  }

  // ? Изменить почту
  async ChangeMail(email: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch('/auth/change-mail', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({email: email}),
    })
    return response.json()
  }

  // ? Изменить пароль
  async ChangePass(oldPass: string, newPass: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch('/auth/change-pass', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({password: oldPass, new_password: newPass}),
    })
    return response.json()
  }

  // ? Выход из профиля
  async Logout(): Promise<boolean | ErrorResponse> {
    const response = await apiFetch('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    return response.json()
  }

  // ? Завершить сессию
  async LogoutToken(token: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/auth/logout/${token}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    return response.json()
  }

  // ? Текущий пользователь
  async Me(): Promise<User | ErrorResponse> {
    const response = await apiFetch('/auth/me', {
      method: 'GET',
      credentials: 'include',
    })
    return response.json()
  }

  // ? Восстановление аккаунта
  async RecoveryAccount(user_id: string, token: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/auth/recovery/${user_id}?token=` + token, {
      method: 'PUT',
      credentials: 'include',
    })
    return response.json()
  }

  // ? Восстановление аккаунта
  async DeleteAccount(email: string): Promise<OTPSentResponse | ErrorResponse> {
    const response = await apiFetch('/auth/delete/' + email, {
      method: 'POST',
      credentials: 'include',
    })
    return response.json()
  }

  // ? Список сессий
  async GetSessions(): Promise<SessionResponse[] | ErrorResponse> {
    const response = await apiFetch('/auth/sessions', {
      method: 'GET',
      credentials: 'include',
    })
    return response.json()
  }

  // ? Переотправить OTP
  async ResendOTP(user_id: string, email: string): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/auth/resend?id=${user_id}&email=${email}`, {
      method: 'POST',
      credentials: 'include',
    })
    return response.json()
  }

  // ? Забыл пароль
  async ForgotPassword(email: string): Promise<OTPSentResponse | ErrorResponse> {
    const response = await apiFetch(`/auth/forgot-password?email=${email}`, {
      method: 'POST',
      credentials: 'include',
    })
    return response.json()
  }

  // ? Восстановление пароля
  async ResetPassword(req: ResetPasswordRequest): Promise<boolean | ErrorResponse> {
    const response = await apiFetch(`/auth/reset-password`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(req),
    })
    return response.json()
  }
}

export const authService = new AuthService()