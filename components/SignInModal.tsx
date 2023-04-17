import { useTranslation } from '@/hooks/useTranslation'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { AuthChangeEvent, Session } from '@supabase/gotrue-js/src/lib/types'
import Link from 'next/link'
import React, { useEffect } from 'react'
import Modal from '~/components/ui/modal'
import { useAppStore } from '~/store'
import { getRedirectURL } from '~/utils/getRedirectUrl'

const SignInModal = () => {
  const { t } = useTranslation()
  const supabase = useSupabaseClient()
  const {
    ui: { showSignInModal },
    showSignIn,
  } = useAppStore()

  const redirectURL = getRedirectURL()
  const handleAuth = async (event: AuthChangeEvent, session: Session | null) => {
    const user = session?.user
    console.debug('user auth event', { event, user: user?.email })

    if (event === 'SIGNED_IN' && user?.id) {
      // TODO: set global state
      showSignIn(false)
    }
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuth)
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <Modal showModal={showSignInModal} setShowModal={showSignIn as any}>
      <div className="flex w-auto flex-col overflow-hidden shadow-xl md:max-w-3xl md:flex-row md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-1 flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-12">
          <Link href="/" className="animate-swim">
            <img src="/icon_32x32@2x.png" alt="Logo" className="h-16 w-16" />
          </Link>
          <h3 className="font-display text-2xl font-bold">
            {t('Login ')}
            <span className="px-0.5 text-pink-400">Chat</span>
            <span className="text-sky-400">Vox</span>
          </h3>
          <p className="text-base text-sky-300">{t('Chat With Any Video')}</p>
        </div>
        <div className="w-96 flex flex-1 flex-col justify-center bg-gray-50 p-4 md:px-10 md:py-8">
          <Auth
            supabaseClient={supabase}
            redirectTo={redirectURL}
            // view={'magic_link'}
            // showLinks={false}
            socialLayout={'horizontal'}
            // onlyThirdPartyProviders
            magicLink
            providers={[
              'google',
              'github',
              'notion',
              // "facebook",
              // "twitter",
            ]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#F17EB8',
                    brandAccent: '#f88dbf',
                    // brandButtonText: "white",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </Modal>
  )
}

export default SignInModal
