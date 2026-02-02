import { defineStore } from 'pinia'
import type { ErrorResponse, MessageResponse } from '@/types/error.dto.ts'
import { isErrorResponse } from '@/utils/ResponseType.ts'
import type { Block } from '@/types/profile/block.model.ts'
import { blockService } from '@/api/profile/block.api.ts'

export const useBlockStore = defineStore('block', {
  state: () => ({
    // Заблокированы мной
    blocks: [] as Block[],
    blockedIds: new Set<string>(),

    // Заблокировали меня (кеш)
    blockedMeBy: {} as Record<string, boolean>,

    isLoading: true,
    error: null as ErrorResponse | null,
  }),
  getters: {
    isBlocked: (state) => (id: string) => state.blockedIds.has(id),
    isBlockedMeBy: (state) => (id: string) => state.blockedMeBy[id] ?? false
  },
  actions: {
    async FetchAll(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: Block[] | ErrorResponse = await blockService.GetAll()
        if (isErrorResponse(response)) {
          this.error = response
          return
        }
        this.blocks = response
        this.blockedIds = new Set(response.map(b => b.blocked_profile_id));
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
      } finally {
        this.isLoading = false
      }
    },

    async BlockProfile(id: string): Promise<boolean> {
      if (this.isBlocked(id)) return true
      try {
        this.isLoading = true
        this.error = null

        const response: Block | ErrorResponse = await blockService.BlockProfile(id)
        if (isErrorResponse(response)) {
          this.error = response
          return false
        }
        this.blocks.push(response)
        if (!this.blockedIds.has(id)) {
          this.blockedIds.add(id)
        }
        return true
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
        return false
      } finally {
        this.isLoading = false
      }
    },

    async UnblockProfile(id: string): Promise<boolean> {
      if (!this.isBlocked(id)) return true
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await blockService.UnblockProfile(id)
        if (isErrorResponse(response)) {
          this.error = response
          return false
        }
        this.blocks = this.blocks.filter((b: Block) => b.id !== id)
        if (this.blockedIds.has(id)) {
          this.blockedIds.delete(id)
        }
        return true
      } catch (error) {
        this.error = { code: 500, error: error!.toString() }
        return false
      } finally {
        this.isLoading = false
      }
    },

    async CheckIfBlockedMe(targetID: string): Promise<void> {
      if (targetID in this.blockedMeBy) return
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await blockService.CheckBlock(targetID)
        if (isErrorResponse(response)) {
          this.error = response
          return
        }
        this.blockedMeBy[targetID] = response
      }
      catch (error) {
        this.error = { code: 500, error: error!.toString() }
      }
      finally {
        this.isLoading = false
      }
    }
  }
})