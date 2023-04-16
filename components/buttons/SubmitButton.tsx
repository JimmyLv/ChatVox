import { useTranslation } from '@/hooks/useTranslation'
import React from 'react'
import { LoadingText } from './LoadingText'

export function SubmitButton({ loading }: { loading: boolean }) {
  const { t } = useTranslation()
  if (!loading) {
    return (
      <button
        className="z-10 mx-auto mt-7 w-3/4 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-400 p-3 text-lg font-medium text-white transition hover:bg-sky-500 hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 sm:mt-10 sm:w-1/3"
        type="submit"
      >
        {t('Ask')}
      </button>
    )
  }

  return (
    <button
      className="z-10 mx-auto mt-7 w-3/4 cursor-not-allowed rounded-2xl border-gray-500 bg-sky-400 p-3 text-lg font-medium transition hover:bg-sky-500 sm:mt-10 sm:w-1/3"
      disabled
    >
      <LoadingText />
    </button>
  )
}
