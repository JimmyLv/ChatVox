import Source from '@/components/Source'
import { SubtitleMetadata } from '@/lib/langchain/SRTLoader'
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
  if (!message) {
    return null
  }
  const formatteMessage = convertNewLines(message)
  const filteredSources = sources
    ? uniqBy(sources, (i) => i.metadata.start).sort(
        (a, b) => Number(a.metadata.start) - Number(b.metadata.start)
      )
    : []
  return (
    <div className={who != 'bot' ? 'float-right clear-both back' : 'float-left clear-both'}>
      {/*<BalancerWrapper>*/}
      <div className="float-right mb-5 rounded-lg bg-white dark:text-black px-4 py-5 shadow-lg ring-1 ring-zinc-100 sm:px-6">
        <div className="flex space-x-3">
          <div className="flex-1 gap-4 flex flex-row">
            <div>
              <p className="font-large text-xxl text-gray-900">
                <a href="#" className="hover:underline">
                  {who == 'bot' ? 'ChatVox AI' : 'You'}
                </a>
              </p>
              <p className={clsx('text ', who == 'bot' ? 'font-semibold font- ' : 'text-gray-400')}>
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
