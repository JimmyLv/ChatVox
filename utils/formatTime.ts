export function formatTime(secondStr: number | string = 0) {
  const seconds = Number(secondStr)
  const hours = Math.floor(seconds / 3600)
  const remainingSeconds = Math.floor(seconds % 3600)
  const minutes = Math.floor(remainingSeconds / 60)
  const remainingMinutes = Math.floor(remainingSeconds % 60)
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`
  } else {
    return `${minutes}:${remainingMinutes.toString().padStart(2, '0')}`
  }
}

export function trimSeconds(secondsStr: number | string) {
  return Number(secondsStr).toFixed()
}
