import { Analytics } from '@vercel/analytics/react'
import Header from '@/components/Header'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'
import { createBrowserSupabaseClient, Session } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'

import { useState } from 'react'

const SignInModal = dynamic(() => import(`../components/SignInModal`), { ssr: false })

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
        <Analytics />
        <TailwindIndicator />
        <Toaster />
        <SignInModal />
      </SessionContextProvider>
    </>
  )
}
