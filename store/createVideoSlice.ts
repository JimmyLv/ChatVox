import { toast } from '@/hooks/use-toast'
import { SubtitleMetadata } from '@/lib/langchain/SRTLoader'
import { Document } from 'langchain/document'
import { StateCreator } from 'zustand'

export interface VideoSlice {
  adding: boolean
  videoUrl?: string
  subtitleDocs: Document<SubtitleMetadata>[]
  addVideo: (url: string) => Promise<void>
}

export const createVideoSlice: StateCreator<VideoSlice> = (set) => ({
  adding: false,
  subtitleDocs: [],
  addVideo: async (url) => {
    set({ adding: true, videoUrl: url })
    const response = await fetch('/api/add-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })
    const json = await response.json()

    if (!response.ok) {
      console.error('Failed to add video: ', response)
      toast({
        variant: 'destructive',
        title: response.statusText,
        description: json.errorMessage || json.error,
      })
    } else {
      set({
        subtitleDocs: json.subtitleDocs,
      })
      toast({
        title: response.statusText,
        description: 'Video added successfully!',
      })
    }
    set({ adding: false })
  },
})
