import { MainNav } from '@/components/MainNav'
import UserAvatar from '@/components/UserAvatar'
import { useTranslation } from '@/hooks/useTranslation'
import clsx from 'clsx'
import { Poppins } from 'next/font/google'
import Link from 'next/link'
import React from 'react'

const poppins = Poppins({ weight: '800', subsets: ['latin'] })

export default function Header() {
  const { t } = useTranslation()

  return (
    <header className="supports-backdrop-blur:bg-white/60 max-w-8xl sticky top-0 z-40 mx-auto w-full flex-none bg-sky-50 py-4 shadow-sm backdrop-blur transition-colors duration-500 dark:bg-transparent md:z-50 md:mx-0">
      <div className="flex items-center justify-between px-3 2xl:px-8">
        <div className="flex items-center space-x-2 md:space-x-3">
          <a href="https://jimmylv.cn" target="_blank" rel="noopener noreferrer">
            <img
              src="/pure_icon_32x32@2x.png"
              alt="logo"
              className="animate-bounce hover:animate-pulse hover:duration-300"
              width={38}
              height={38}
            />
          </a>
          <Link href="/">
            <h2
              className={clsx(
                'flex flex-col items-start text-2xl lg:flex-row lg:items-center',
                poppins.className
              )}
            >
              <span className="pr-2">
                <span className="pr-0.5 text-pink-400">Chat</span>
                <span className="text-sky-400">Vox</span>
              </span>
              <span className="text-xl">{t('Chat With Any Video')}</span>
            </h2>
          </Link>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          <MainNav />
          <UserAvatar />
        </div>
      </div>
    </header>
  )
}
