export interface SRTSubtitle {
  startTime: string
  startSeconds: number
  endTime: string
  endSeconds: number
  text: string
}

export type CommonSubtitle = {
  index: number
  text: string
  start: number
  end: number
}
export function reduceSubtitle(subtitles: SRTSubtitle[] = []): CommonSubtitle[] {
  const MINIMUM_COUNT_ONE_GROUP = 10

  return subtitles.reduce((accumulator: CommonSubtitle[], current: SRTSubtitle, index: number) => {
    const groupIndex: number = Math.floor(index / MINIMUM_COUNT_ONE_GROUP)

    if (!accumulator[groupIndex]) {
      accumulator[groupIndex] = {
        // 5.88 -> 5.9
        index: groupIndex,
        text: '',
        start: current.startSeconds,
        end: current.endSeconds,
      }
    }

    accumulator[groupIndex].text = accumulator[groupIndex].text + current.text + ' '
    accumulator[groupIndex].end = current.endSeconds

    return accumulator
  }, [])
}
