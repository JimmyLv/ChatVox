import { reduceSubtitle } from '@/lib/langchain/reduceSubtitle'
import { Document } from 'langchain/document'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import type SRTParserT from 'srt-parser-2'

export class SRTLoader extends TextLoader {
  constructor(filePathOrBlob: string | Blob) {
    super(filePathOrBlob)
  }

  public async load(): Promise<Document<{ start: number }>[]> {
    const parsed = await super.load()
    const rawText = parsed[0]
    const { pageContent, metadata } = rawText

    const { SRTParser2 } = await SRTLoaderImports()
    const parser: SRTParserT = new SRTParser2()

    const srts = parser.fromSrt(pageContent)
    return reduceSubtitle(srts).map((srt) => ({
      pageContent: srt.text,
      metadata: {
        ...metadata,
        start: srt.start,
      },
    }))
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
