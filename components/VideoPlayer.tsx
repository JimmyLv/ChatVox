import { useAppStore } from '@/store'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer, { Config } from 'react-player'
import BaseReactPlayer from 'react-player/types/base'

export function VideoPlayer() {
  const [playing, setPlaying] = useState(true)
  const { videoUrl } = useAppStore()
  const searchParams = useSearchParams()
  const time = searchParams.get('t')
  const ref = useRef<BaseReactPlayer<Config>>(null)
  const config: Config = {
    youtube: {
      playerVars: { showinfo: 0 },
    },
  }
  useEffect(() => {
    if (!ref.current) {
      return
    }

    const reactPlayer = ref.current
    if (time) {
      setPlaying(true)
      reactPlayer.seekTo(Number(time))
    }
  }, [time])

  return (
    <div className="aspect-video w-full">
      <ReactPlayer
        ref={ref}
        width="100%"
        height="100%"
        url={videoUrl}
        controls
        config={config}
        playing={playing}
      />
    </div>
  )
}
