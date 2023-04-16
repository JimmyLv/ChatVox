import { useTranslation } from '@/hooks/useTranslation'
import { useUser } from '@supabase/auth-helpers-react'
import { AnimatePresence, motion } from 'framer-motion'
import UserDropdown from '~/components/user-dropdown'
import { FADE_IN_ANIMATION_SETTINGS } from '~/constants/constants'
import { useAppStore } from '~/store'

export default function UserAvatar() {
  const user = useUser()
  const { t } = useTranslation()
  const { showSignIn } = useAppStore()

  function handleSignIn() {
    showSignIn(true)
  }

  return (
    <div>
      <AnimatePresence>
        {user ? (
          <UserDropdown />
        ) : (
          <motion.button
            className="rounded-xl border border-black bg-black px-1 py-0.5 text-sm text-white transition-all hover:bg-white hover:text-black md:rounded-full md:p-1.5 md:px-4"
            onClick={handleSignIn}
            {...FADE_IN_ANIMATION_SETTINGS}
          >
            {t('Login')}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
