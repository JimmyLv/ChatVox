import { toast } from '@/hooks/use-toast'
import { SubtitleMetadata } from '@/lib/langchain/SRTLoader'
import { Document } from 'langchain/document'
import { StateCreator } from 'zustand'

export interface VideoSlice {
  adding: boolean
  videoUrl?: string
  summary: string
  subtitleDocs: Document<SubtitleMetadata>[]
  addVideo: (url: string) => Promise<void>
}

export const createVideoSlice: StateCreator<VideoSlice> = (set) => ({
  adding: false,
  subtitleDocs: [],
  summary: '',
  addVideo: async (url) => {
    set({ adding: true, videoUrl: url })
    try {
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
          summary: json.summary,
        })
        toast({
          title: response.statusText,
          description: 'Video added successfully!',
        })
      }
    } catch (e: any) {
      console.error('Failed to add video: ', e)
      toast({
        variant: 'destructive',
        title: 'Failed to add video',
        description: e.message,
      })
    } finally {
      set({ adding: false })
    }
  },
})
