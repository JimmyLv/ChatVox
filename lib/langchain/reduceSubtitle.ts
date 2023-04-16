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
  // 如果字幕不够多，就每x句话合并一下
  const MINIMUM_COUNT_ONE_GROUP = 10

  return subtitles.reduce((accumulator: CommonSubtitle[], current: SRTSubtitle, index: number) => {
    // 计算当前元素在哪一组
    const groupIndex: number = Math.floor(index / MINIMUM_COUNT_ONE_GROUP)

    // 如果是当前组的第一个元素，初始化这一组的字符串
    if (!accumulator[groupIndex]) {
      accumulator[groupIndex] = {
        // 5.88 -> 5.9
        // text: current.start.toFixed() + ": ",
        index: groupIndex,
        text: '',
        start: current.startSeconds,
        end: current.endSeconds,
      }
    }

    // 将当前元素添加到当前组的字符串末尾
    accumulator[groupIndex].text = accumulator[groupIndex].text + current.text + ' '
    accumulator[groupIndex].end = current.endSeconds

    return accumulator
  }, [])
}
