import { defineStore } from 'pinia'
import type {
  AuthRequest,
  OTPSentResponse,
  ResetPasswordRequest,
  VerifyOTPRequest,
} from '@/types/auth/auth.dto.ts'
import type { ErrorResponse, MessageResponse } from '@/types/error.dto.ts'
import { authService } from '@/api/auth/auth.api.ts'
import { isErrorResponse } from '@/utils/ResponseType.ts'
import type { User } from '@/types/auth/auth.model.ts'
import { useProfileStore } from '@/stores/profile.store.ts'
import { WSStatus } from '@/api/ws.api.ts'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    me: null as User | null,
    email: null as string | null,
    password: null as string | null,
    user_id: null as string | null,
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

    async VerifyOTP(req: VerifyOTPRequest): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await authService.VerifyOTP(req)
        if (isErrorResponse(response)) {
          this.error = response
          return
        }

        if (req.action != "forgot-password") {
          const profileStore = useProfileStore()
          await profileStore.FetchMe()
          WSStatus.connect()
        }
      }
      catch (error) {
        this.error = {code: 500, error: error!.toString()}
        return
      }
      finally {
        this.isLoading = false
      }
    },

    async Logout(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await authService.Logout()
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

    async ResendOTP(userID: string, email: string): Promise<boolean> {
      try {
        this.error = null

        const response: MessageResponse | ErrorResponse = await authService.ResendOTP(userID, email)
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

        const response: MessageResponse | ErrorResponse = await authService.ResetPassword(req)
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
    }
  }
})