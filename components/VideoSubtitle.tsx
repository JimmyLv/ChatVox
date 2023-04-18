import { useAppStore } from '@/store'
import { formatTime } from '@/utils/formatTime'
import { useSearchParams } from 'next/navigation'
import React from 'react'

export function VideoSubtitle() {
  const { subtitleDocs } = useAppStore()
  const searchParams = useSearchParams()
  const time = Number(searchParams.get('t'))
  const subtitle = subtitleDocs.find((i) => i.metadata.start === time)
  const { pageContent, metadata } = subtitle || {}
  const parsed_content = pageContent?.replace(/↓/g, '\n')
  const embed_source = metadata?.source
    ?.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')
    .replace('https://youtu.be/', 'https://www.youtube.com/embed/')

  if (!parsed_content) {
    return null
  }

  const url = `${embed_source}?showinfo=0&start=${Math.round(time)}`
  return (
    <div className="flex flex-row space-x-6 mt-10 m-auto max-w-7xl px-2">
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
