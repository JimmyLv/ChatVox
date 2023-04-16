import { formatTime } from '@/utils/formatTime'
import Link from 'next/link'

export default function Source({
  index,
  pageContent,
  source,
  start,
  title,
}: {
  index: number
  pageContent?: string
  source?: string
  start?: number
  title?: string
}) {
  return (
    <Link
      href={`?t=${start}&i=${index}`}
      scroll={false}
      className="text-left pt-2 text-blue-600 hover:underline cursor-pointer"
    >
      🧠 Source {index + 1}: {formatTime(start)}
    </Link>
  )
}
