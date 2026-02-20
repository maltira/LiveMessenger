import { defineStore } from 'pinia'
import type {
  AuthRequest,
  OTPSentResponse,
  RecoveryResponse,
  ResetPasswordRequest,
  SessionResponse,
  VerifyOTPRequest,
} from '@/types/auth/auth.dto.ts'
import type { ErrorResponse } from '@/types/error.dto.ts'
import { authService } from '@/api/auth/auth.api.ts'
import { isErrorResponse } from '@/utils/ResponseType.ts'
import type { User } from '@/types/auth/auth.model.ts'
import { useProfileStore } from '@/stores/profile.store.ts'
import { WSStatus } from '@/api/ws.api.ts'


const useAuthStore = defineStore('auth', {
  state: () => ({
    me: null as User | null,
    sessions: [] as SessionResponse[],

    email: null as string | null,
    password: null as string | null,
    user_id: null as string | null,

    recovery: null as RecoveryResponse | null,

    isLoading: true,
    error: null as ErrorResponse | null,
  }),

  actions: {
    async Login(req: AuthRequest): Promise<OTPSentResponse | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: OTPSentResponse | ErrorResponse = await authService.Login(req)
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        return response
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async Register(req: AuthRequest): Promise<OTPSentResponse | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: OTPSentResponse | ErrorResponse = await authService.Register(req)
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        return response
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async ChangeMail(email: string): Promise<boolean> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await authService.ChangeMail(email)
        if (isErrorResponse(response)) {
          this.error = response
          return false
        }
        return response
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return false
      }
      finally {
        this.isLoading = false
      }
    },

    async ChangePass(oldPass: string, newPass: string): Promise<boolean> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await authService.ChangePass(oldPass, newPass)
        if (isErrorResponse(response)) {
          this.error = response
          return false
        }
        return response
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return false
      }
      finally {
        this.isLoading = false
      }
    },

    async VerifyOTP(req: VerifyOTPRequest): Promise<boolean | RecoveryResponse> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | RecoveryResponse | ErrorResponse = await authService.VerifyOTP(req)
        if (isErrorResponse(response)) {
          this.error = response
          return false
        }

        if (req.action in ['login', 'register'] && response === true) {
          const profileStore = useProfileStore()
          await profileStore.FetchMe()
          WSStatus.connect()
        }

        return response
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return false
      }
      finally {
        this.isLoading = false
      }
    },

    async Logout(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await authService.Logout()
        if (isErrorResponse(response)) {
          this.error = response
          return
        }

        WSStatus.disconnect()
        this.me = null
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return
      }
      finally {
        this.isLoading = false
      }
    },

    async LogoutSession(token: string): Promise<boolean> {
      try {
        this.error = null

        const response: boolean | ErrorResponse = await authService.LogoutToken(token)
        if (isErrorResponse(response)) {
          this.error = response
          return false
        }
        this.sessions = this.sessions.filter((session: SessionResponse) => session.refresh_token !== token)
        return true
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return false
      }
    },

    async FetchMe(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: User | ErrorResponse = await authService.Me()
        if (isErrorResponse(response)) {
          this.error = response
          return
        }

        this.me = response
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return
      }
      finally {
        this.isLoading = false
      }
    },

    async FetchSessions(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: SessionResponse[] | ErrorResponse = await authService.GetSessions()
        if (isErrorResponse(response)) {
          this.error = response
          return
        }

        this.sessions = response
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return
      }
      finally {
        this.isLoading = false
      }
    },

    async ResendOTP(userID: string, email: string): Promise<boolean> {
      try {
        this.error = null

        const response: boolean | ErrorResponse = await authService.ResendOTP(userID, email)
        if (isErrorResponse(response)) {
          this.error = response
          return false
        }

        return response
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return false
      }
    },

    async ForgotPassword(email: string): Promise<OTPSentResponse | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: OTPSentResponse | ErrorResponse = await authService.ForgotPassword(email)
        if (isErrorResponse(response)) {
          this.error = response
          return null
        }

        return response
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async ResetPassword(req: ResetPasswordRequest): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await authService.ResetPassword(req)
        if (isErrorResponse(response)) {
          this.error = response
        }
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
      }
      finally {
        this.isLoading = false
      }
    },

    async RecoveryAccount(user_id: string, token: string): Promise<boolean> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await authService.RecoveryAccount(user_id, token)
        if (isErrorResponse(response)) {
          this.error = response
          return false
        }

        return response
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return false
      }
      finally {
        this.isLoading = false
      }
    },

    async DeleteAccount(email: string): Promise<boolean> {
      try {
        this.isLoading = true
        this.error = null

        const response: OTPSentResponse | ErrorResponse = await authService.DeleteAccount(email)
        if (isErrorResponse(response)) {
          this.error = response
          return false
        }

        return true
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return false
      }
      finally {
        this.isLoading = false
      }
    },
  }
})
export default useAuthStore