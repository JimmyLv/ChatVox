import { VideoConfigSchema } from '@/schemas/video'

export type VideoDetail = {
  id: string
  url: string
  subtitleUrl?: string
  title: string
  cover?: string
  duration: number
  subtitlesArray?: null | Array<any>
  descriptionText?: string
}

export type LocalFile = VideoDetail

export type LocalFileConfig = VideoConfigSchema
