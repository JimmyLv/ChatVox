import Source from '@/components/Source'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SubtitleMetadata } from '@/lib/langchain/SRTLoader'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store'
import { useUser } from '@supabase/auth-helpers-react'
import clsx from 'clsx'
import { Document } from 'langchain/document'
import uniqBy from 'lodash.uniqby'
import Balancer from 'react-wrap-balancer'

const BalancerWrapper = (props: any) => <Balancer {...props} />

export type Message = {
  who: 'bot' | 'user' | undefined
  message?: string
  sources?: Document<SubtitleMetadata>[]
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
    <div className="flex flex-grow space-x-3">
      <div className="min-w-0 flex-1">
        <p className="font-large text-xxl text-gray-900 dark:text-black">
          <a href="#" className="hover:underline">
            ChatVox AI is thinking...
          </a>
        </p>
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
            <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
          </div>
          <div className="h-2 rounded bg-zinc-500"></div>
        </div>
      </div>
    </div>
  </div>
)

// util helper to convert new lines to <br /> tags
const convertNewLines = (text: string) =>
  text.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ))

export function ChatLine({ who = 'bot', message, sources }: Message) {
  const { videoUrl } = useAppStore()
  const user = useUser()

  if (!message) {
    return null
  }
  const formatteMessage = convertNewLines(message)
  const filteredSources = sources
    ? uniqBy(sources, (i) => i.metadata.start)
        .filter((i) => i.metadata.source === videoUrl)
        .sort((a, b) => Number(a.metadata.start) - Number(b.metadata.start))
    : []

  const isBot = who === 'bot'

  const { email, user_metadata } = user || {}
  const userName = user_metadata?.name || user_metadata?.full_name || email || 'You'
  const chatImage = isBot ? '/pure_icon_32x32@2x.png' : user_metadata?.avatar_url
  const chatName = isBot ? 'ChatVox AI' : userName

  return (
    <div className={isBot ? 'float-left clear-both' : 'float-right clear-both back'}>
      {/*<BalancerWrapper>*/}
      <div className="float-right mb-5 rounded-lg bg-white dark:text-black px-4 py-5 shadow-lg ring-1 ring-zinc-100 sm:px-6">
        <div className="flex space-x-3">
          <div className="flex-1 gap-4 flex flex-row">
            <div>
              <p className="font-large text-xxl text-gray-900">
                <a
                  href="#"
                  className={cn('hover:underline flex items-center gap-2', {
                    'flex-row-reverse': !isBot,
                  })}
                >
                  <Avatar className="w-9 h-9">
                    <AvatarImage src={chatImage} alt="ChatVox AI" />
                    <AvatarFallback>{chatName}</AvatarFallback>
                  </Avatar>
                  <span>{chatName}</span>
                </a>
              </p>
              <p className={clsx('text ', isBot ? 'font-semibold font- ' : 'text-gray-400 mt-2')}>
                {formatteMessage}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 mt-2">
                {filteredSources.map((source_doc, index) => {
                  const { pageContent: page_content, metadata } = source_doc
                  const { source, start } = metadata
                  return (
                    <Source
                      key={index}
                      index={index}
                      pageContent={page_content}
                      source={source}
                      start={start}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*</BalancerWrapper>*/}
    </div>
  )
}
