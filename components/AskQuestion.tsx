import { LoadingText } from '@/components/buttons/LoadingText'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import React from 'react'

export const AskQuestion = ({ input, setInput, sendMessage, loading }: any) => (
  <div className="mt-6">
    <div className="flex clear-both">
      <input
        type="text"
        aria-label="chat input"
        required
        className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm dark:placeholder:text-black text-black"
        value={input}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(input)
            setInput('')
          }
        }}
        placeholder="Your question..."
        onChange={(e) => {
          setInput(e.target.value)
        }}
      />

      {!loading && (
        <Button
          type="submit"
          className="ml-2 flex-none w-30"
          onClick={(e) => {
            sendMessage(input)
            setInput('')
          }}
        >
          <Icons.arrowRight className="mr-2 h-5 w-5" />
          Ask
        </Button>
      )}

      {loading && (
        <Button className="ml-2" disabled>
          <LoadingText text="loading..." />
        </Button>
      )}
    </div>
  </div>
)
