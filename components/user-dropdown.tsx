import { useTranslation } from '@/hooks/useTranslation'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { motion } from 'framer-motion'
import { Clock3, Clover, Edit, Film, LogOut, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import Popover from '~/components/ui/popover'
import { FADE_IN_ANIMATION_SETTINGS } from '~/constants/constants'

export default function UserDropdown() {
  const { t } = useTranslation()
  const user = useUser()
  const supabaseClient = useSupabaseClient()
  const { email, user_metadata } = user || {}
  const image = user_metadata?.avatar_url
  const [openPopover, setOpenPopover] = useState(false)

  if (!email) return null

  async function signOut(param: { redirect: boolean }) {
    const { error } = await supabaseClient.auth.signOut()
    error && console.error('=======sign out error=====', { error })
  }

  return (
    <motion.div
      className="relative inline-block flex content-center text-left"
      {...FADE_IN_ANIMATION_SETTINGS}
    >
      <Popover
        content={
          <div className="w-full rounded-md bg-white dark:bg-black p-2 sm:w-56">
            <Link
              href="/user/videos"
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75  dark:hover:bg-gray-900 hover:bg-gray-100"
            >
              <Film className="h-4 w-4" />
              <p className="text-sm">{t('History')}</p>
            </Link>
            <button
              className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 dark:hover:bg-gray-900 hover:bg-gray-100"
              onClick={() => signOut({ redirect: false })}
            >
              <LogOut className="h-4 w-4" />
              <p className="text-sm">{t('Logout')}</p>
            </button>
          </div>
        }
        align="end"
        openPopover={openPopover}
        setOpenPopover={setOpenPopover}
      >
        <button
          onClick={() => setOpenPopover(!openPopover)}
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
        >
          <img
            alt={email}
            src={image || `https://avatars.dicebear.com/api/micah/${email}.svg`}
            width={40}
            height={40}
          />
        </button>
      </Popover>
    </motion.div>
  )
}
