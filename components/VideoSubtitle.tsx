import { useAppStore } from '@/store'
import { formatTime } from '@/utils/formatTime'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export function VideoSubtitle() {
  const { videoUrl, subtitleDocs } = useAppStore()
  const searchParams = useSearchParams()
  const time = searchParams.get('t')
  const index = searchParams.get('i')

  const subtitle = subtitleDocs[Number(index)]
  const { pageContent } = subtitle || {}
  const parsed_content = pageContent?.replace(/↓/g, '\n')
  const embed_source = videoUrl
    ?.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')
    .replace('https://youtu.be/', 'https://www.youtube.com/embed/')

  if (!parsed_content) {
    return null
  }

  const url = `${embed_source}?showinfo=0&start=${Math.round(Number(time))}`
  return (
    <div className="flex flex-row space-x-6 mt-10 m-auto max-w-7xl">
      <div className="space-y-6">
        <div className="text-2xl font-bold dark:text-white">
          Transcript at{' '}
          <a href={url} target="_blank">
            {formatTime(time || 0)}
          </a>
        </div>
        <a className="text-base dark:text-gray-400" href={url} target="_blank">
          ...{parsed_content}...
        </a>
      </div>
    </div>
  )
}
