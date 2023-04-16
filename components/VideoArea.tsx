import Chat from '@/components/Chat'
import { VideoPlayer } from '@/components/VideoPlayer'
import { VideoSubtitle } from '@/components/VideoSubtitle'
export default function VideoArea() {
  return (
    <>
      <div className="flex flex-col md:flex-row mx-auto w-full max-w-7xl items-end justify-center gap-8 p-2">
        <VideoPlayer />
        <Chat />
      </div>
      <VideoSubtitle />
    </>
  )
}
