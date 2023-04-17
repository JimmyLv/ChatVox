import { SearchDialog } from '@/components/SearchDialog'
import TypingSlogan from '@/components/TypingSlogan'
import { VideoForm } from '@/components/VideoForm'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store'
import styles from '@/styles/Home.module.css'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const VideoArea = dynamic(() => import(`../components/VideoArea`), { ssr: false })

export default function Home() {
  const { subtitleDocs } = useAppStore()

  return (
    <>
      <Head>
        <title>ChatVox · Chat With Any Video</title>
      </Head>
      <main className={styles.main}>
        <TypingSlogan />
        <div className="sm:mt-30 mx-auto mt-8 w-full max-w-7xl px-0">
          <VideoForm />
        </div>
        {subtitleDocs.length > 0 && <VideoArea />}
        <div className={styles.center}>
          <SearchDialog />
        </div>

        <div className="py-8 w-full flex items-center justify-center space-x-6">
          <div className="opacity-75 transition hover:opacity-100 cursor-pointer flex items-center justify-center">
            <div className="text-base mr-2">
              Built with ❤️ by
              <a
                href="https://twitter.com/Jimmy_JingLv"
                target="_blank"
                rel="noreferrer"
                className="font-bold underline-offset-2 transition hover:text-pink-400 hover:underline"
              >
                &nbsp;JimmyLv
              </a>
            </div>
            <Link href="https://supabase.com">
              <Image src={'/supabase.svg'} width="20" height="20" alt="Supabase logo" />
            </Link>
          </div>
          <div className="border-l border-gray-300 w-1 h-4" />
          <div className="flex items-center justify-center space-x-4">
            <div className="opacity-75 transition hover:opacity-100 cursor-pointer">
              <Link
                href="https://github.com/JimmyLv/ChatVox"
                className="flex items-center justify-center"
              >
                <Image src={'/github.svg'} width="20" height="20" alt="Github logo" />
              </Link>
            </div>
            <div className="opacity-75 transition hover:opacity-100 cursor-pointer">
              <Link
                href="https://twitter.com/Jimmy_JingLv/status/1647483720608415744?s=20"
                className="flex items-center justify-center"
              >
                <Image src={'/twitter.svg'} width="20" height="20" alt="Twitter logo" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
