import { CommonSubtitle } from '@/lib/langchain/types'
import { Document } from 'langchain/document'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import type SRTParserT from 'srt-parser-2'

export type SubtitleMetadata = Omit<CommonSubtitle, 'text'> & {
  source?: string
}

export class SRTLoader extends TextLoader {
  constructor(filePathOrBlob: string | Blob) {
    super(filePathOrBlob)
  }

  public async load(): Promise<Document<SubtitleMetadata>[]> {
    const parsed = await super.load()
    const rawText = parsed[0]
    const { pageContent, metadata } = rawText

    const { SRTParser2 } = await SRTLoaderImports()
    const parser: SRTParserT = new SRTParser2()

    const srtSubtitles = parser.fromSrt(pageContent)
    // return reduceSubtitle(srtSubtitles).map((subtitle) => {
    return srtSubtitles.map((subtitle, index) => {
      const { text, startSeconds, endSeconds } = subtitle
      return {
        pageContent: text?.trim().replaceAll('\n', ''),
        metadata: {
          ...metadata,
          index,
          start: startSeconds,
          end: endSeconds,
        },
      }
    })
  }
}

async function SRTLoaderImports(): Promise<{
  SRTParser2: typeof SRTParserT
}> {
  try {
    const SRTParser2 = (await import('srt-parser-2')).default
    return { SRTParser2 }
  } catch (e) {
    throw new Error(
      'Please install srt-parser-2 as a dependency with, e.g. `yarn add srt-parser-2`'
    )
  }
}
