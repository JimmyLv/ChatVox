import '@/styles/globals.css'
import Header from '@/components/Header'
import SignInModal from '@/components/SignInModal'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/toaster'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { createBrowserSupabaseClient, Session } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

import { useState } from 'react'

export default function App({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Header />
        <Component {...pageProps} />
        <TailwindIndicator />
        <Toaster />
        <SignInModal />
      </SessionContextProvider>
    </>
  )
}
