import { useTranslation } from '@/hooks/useTranslation'
import React from 'react'
import { TypeAnimation } from 'react-type-animation'
import SquigglyLines from './SquigglyLines'

export default function TypingSlogan() {
  const { t } = useTranslation()
  return (
    <div>
      <h1 className="h-[5rem] w-screen justify-center text-4xl font-bold sm:w-[64rem] sm:text-7xl flex flex-col md:flex-row items-center">
        <div>{t('Chat With Any')}</div>
        <span className="relative w-fit whitespace-nowrap	px-3 text-pink-400">
          <SquigglyLines />
          <TypeAnimation
            sequence={[
              'YouTube',
              2000,
              t('Video'),
              2000,
              t('Audio'),
              2000,
              t('Podcast'),
              2000,
              t('Meeting'),
              2000,
              t('Lecture'),
              3000,
              () => {
                // console.log('Done typing!')
              },
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            className="relative text-pink-400	"
          />
        </span>
        {/*{t('Content')}*/}
        <br />
      </h1>

      <h1 className="mt-4 w-full text-center text-xl font-bold sm:w-[64rem] sm:text-5xl">
        {t('Powered by ChatGPT & Whisper API')}
      </h1>
    </div>
  )
}
