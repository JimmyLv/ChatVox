import { Icons } from '@/components/icons'
import { AskQuestion } from '@/components/AskQuestion'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store'
import clsx from 'clsx'
import getVideoId from 'get-video-id'
import React, { useState } from 'react'
import { ChatLine, LoadingChatLine, type Message } from './ChatLine'

// default first message to display in UI (not necessary to define the prompt)
export const getInitialMessagesWithSummary: (summary?: string) => Message[] = (summary) => [
  {
    who: 'bot',
    message: `Hey! What do you want to learn from this video?
    
### Summary(via [aitodo.co](https://aitodo.co))
${summary}`,
  },
]

function useVideoId() {
  const { videoUrl } = useAppStore()
  const videoId = getVideoId(videoUrl || '').id
  return { videoId }
}

export default function Chat({ className }: { className?: string }) {
  const { summary } = useAppStore()
  const initialMessages = getInitialMessagesWithSummary(summary)

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [history, setHistory] = useState<[string, string][]>([])
  const [input, setInput] = useState('')
  const [chatSessionId, setChatSessionId] = useState(Math.random().toString(36).substring(7))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<String | undefined>(undefined)
  const { videoId } = useVideoId()

  const resetChatSessionId = () => {
    setChatSessionId(Math.random().toString(36).substring(7))
  }

  const resetChatConversation = () => {
    resetChatSessionId()
    setMessages(initialMessages)
    setHistory([])
  }

  const regenerateAnswer = () => {
    let { who: who_first } = messages[messages.length - 1]
    let offset = 0
    if (who_first === 'bot') {
      offset = 1
    }
    const { message, who } = messages[messages.length - 1 - offset]
    sendMessage(message as string, messages.slice(0, messages.length - 1 - offset))
  }

  const sendMessage = async (message: string, message_history?: Message[]) => {
    setLoading(true)
    setError(undefined)
    const newMessages = [
      ...(message_history || messages),
      { message: message, who: 'user' } as Message,
    ]
    setMessages(newMessages)

    const response = await fetch('/api/chat-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoId,
        question: message,
        history,
        chat_session_id: chatSessionId,
      }),
    })
    if (!response.ok) {
      setLoading(false)
      setError(response.statusText)
      return
    }

    const { answer, sources } = await response.json()
    setLoading(false)

    if (error) {
      setError(error)
    } else {
      setMessages((oldMessages) => [
        ...oldMessages,
        {
          message: answer.trim(),
          who: 'bot',
          sources: sources,
        } as Message,
      ])
      setHistory((oldHistory) => [...oldHistory, [message, answer]])
    }
  }

  return (
    <div className={clsx('w-full overflow-auto justify-between px-2', className)}>
      {messages.map(({ message, who, sources }, index) => (
        <ChatLine key={index} who={who} message={message} sources={sources} />
      ))}

      {loading && <LoadingChatLine />}

      {messages.length < 2 ? (
        <span className="mx-auto flex flex-grow text-gray-600 clear-both">
          Type a message to ask related question
        </span>
      ) : (
        !loading && (
          <span className="justify-end content-center mx-auto flex flex-grow clear-both">
            <Button disabled={loading} onClick={regenerateAnswer}>
              <div className="flex flex-row items-center">
                <Icons.retry className="mr-2 h-5 w-5" /> Regenerate
              </div>
            </Button>
            <Button disabled={loading} onClick={resetChatConversation} className="ml-2">
              <div className="flex flex-row items-center">
                <Icons.chat className="mr-2 h-5 w-5" /> New chat
              </div>
            </Button>
          </span>
        )
      )}

      <AskQuestion input={input} setInput={setInput} sendMessage={sendMessage} loading={loading} />

      {error && (
        <div className="rounded-md bg-red-50 p-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
