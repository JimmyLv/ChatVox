export interface SRTSubtitle {
  startTime: string
  startSeconds: number
  endTime: string
  endSeconds: number
  text: string
}

export type CommonSubtitle = {
  index: number
  text: string
  start: number
  end: number
}
