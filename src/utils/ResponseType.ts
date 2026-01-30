import type { ErrorResponse, MessageResponse } from '@/types/error.dto.ts'

export function isErrorResponse(response: any): response is ErrorResponse {
  return response && typeof response.error === 'string'
}

export function isMessageResponse(response: any): response is MessageResponse {
  return response && typeof response.message === 'string'
}