import { useAppStore } from '@/store'
import React, { useRef } from 'react'
import ReactPlayer, { Config } from 'react-player'
import BaseReactPlayer from 'react-player/types/base'

export function VideoPlayer() {
  const { videoUrl } = useAppStore()
  const ref = useRef<BaseReactPlayer<Config>>(null)
  const config: Config = {
    youtube: {
      playerVars: { showinfo: 1 },
    },
  }
  return (
    <div className="aspect-video w-full">
      <ReactPlayer ref={ref} width="100%" height="100%" url={videoUrl} controls config={config} />
    </div>
  )
}
