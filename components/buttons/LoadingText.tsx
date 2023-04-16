import Image from 'next/image'
import React from 'react'

export function LoadingText({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center">
      <Image src="/loading.svg" alt="Loading..." width={28} height={28} className="mr-2" />
      {text && <span>{text}</span>}
    </div>
  )
}
