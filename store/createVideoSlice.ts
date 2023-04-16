import { toast } from '@/hooks/use-toast'
import { StateCreator } from 'zustand'

export interface VideoSlice {
  adding: boolean
  addVideo: (url: string) => Promise<void>
}

export const createVideoSlice: StateCreator<VideoSlice> = (set) => ({
  adding: false,
  addVideo: async (url) => {
    set({ adding: true })
    const response = await fetch('/api/add-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })
    const json = await response.json()

    if (!response.ok) {
      console.error('Failed to save to Notion: ', response)
      toast({
        variant: 'destructive',
        title: response.statusText,
        description: json.errorMessage || json.error,
      })
    }
    set({ adding: false })
  },
})
